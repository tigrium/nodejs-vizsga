import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';

import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { ProfileInput, ProfileInputWithoutPass } from '../service/inputSchemas';
import { User } from '../service/models';
import { getPasswordHash } from '../service/passwordHash';

/**
 * A paraméterben kapott felhasználóadatokat menti.
 */
export const setUserDataMW =
  (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(
      req.body,
      req.body.pass || req.body.passAgain ? ProfileInput : ProfileInputWithoutPass,
    );
    if ((req.body.pass || req.body.passAgain) && req.body.pass !== req.body.passAgain) {
      mistakes.push('A két jelszó nem egyezik.');
    }
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const user = objectRepo.db.models.userModel.findOne({ id: req.session.userId }) as User;

    if (user.email !== req.body.email) {
      const userWithThisEmail = objectRepo.db.models.userModel.findOne({ email: req.body.email });
      if (userWithThisEmail) {
        return next(new MistakeError('Ez az e-mail cím már szerepel a rendszerben.'));
      }
    }
    if (req.body.pass) {
      user.passwordHash = getPasswordHash(req.body.pass);
    }
    user.name = req.body.name;

    if (req.file) {
      if (user.picturePath) {
        try {
          await fs.rm(user.picturePath);
        } catch (err) {
          return next(err);
        }
      }
      user.picturePath = req.file.path;
    }

    try {
      objectRepo.db.models.userModel.update(user);
      objectRepo.db.database.save();
    } catch (err) {
      return next(err);
    }

    next();
  };
