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
  ({
    db: {
      database,
      models: { userModel },
    },
  }: ObjectRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(
      req.body,
      req.body.pass || req.body.passAgain ? ProfileInput : ProfileInputWithoutPass,
    );
    if ((req.body.pass || req.body.passAgain) && req.body.pass !== req.body.passAgain) {
      mistakes.push('A két jelszó nem egyezik.');
    }

    const user = userModel.findOne({ id: req.session.userId }) as User;

    if (user.email !== req.body.email) {
      const userWithThisEmail = userModel.findOne({ email: req.body.email });
      if (userWithThisEmail) {
        mistakes.push('Ez az e-mail cím már szerepel a rendszerben.');
      }
    }
    if (req.body.pass) {
      user.passwordHash = getPasswordHash(req.body.pass);
    }
    if (user.name !== req.body.name) {
      const userWithThisName = userModel.findOne({ name: req.body.name });
      if (userWithThisName) {
        mistakes.push('Ez a név már foglalt.');
      }
    }

    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

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
      userModel.update(user);
    } catch (err) {
      return next(err);
    }

    return database.save(next);
  };
