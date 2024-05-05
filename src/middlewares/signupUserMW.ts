import { NextFunction, Request, Response } from 'express';

import { MistakeError, ObjectRepository } from '../service/types';
import { User } from '../service/models';
import { getPasswordHash } from '../service/passwordHash';
import { inputCheck } from '../service/inputCheck';
import { ProfileInput } from '../service/inputSchemas';

/**
 * Leellenőrzi, hogy létezik-e már az email-cím (`body.email`).
 * Ha nem, létrehozza az új felhasználót. Ha igen, hibát dob.
 */
export const signupUserMW =
  ({
    db: {
      database,
      models: { userModel },
    },
    uuid,
  }: ObjectRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.body, ProfileInput);

    if (req.body.pass !== req.body.passAgain) {
      mistakes.push('A két jelszó nem egyezik.');
    }

    const emailExists = userModel.findOne({ email: req.body.email });
    if (emailExists) {
      mistakes.push('Ezzel az e-mail címmel már létezik profil.');
    }
    const nameExists = userModel.findOne({ name: req.body.name });
    if (nameExists) {
      mistakes.push('Ezzel a névvel már létezik profil.');
    }

    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const user: User = {
      id: uuid(),
      email: req.body.email,
      name: req.body.name,
      passwordHash: getPasswordHash(req.body.pass),
    };

    try {
      userModel.insert(user);
    } catch (err) {
      return next(err);
    }

    return database.save(next);
  };
