import { NextFunction, Request, Response } from 'express';

import { MistakeError, ObjectRepository } from '../service/types';
import { User } from '../service/models';
import { getPasswordHash } from '../service/passwordHash';

/**
 * Leellenőrzi, hogy létezik-e már az email-cím (`body.email`).
 * Ha nem, létrehozza az új felhasználót. Ha igen, hibát dob.
 */
export const signupUserMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  const emailExists = objectRepo.db.models.userModel.findOne({ email: req.body.email });
  if (emailExists) {
    return next(new MistakeError('Ezzel az e-mail címmel már létezik profil.'));
  }

  const user: User = {
    id: objectRepo.uuid(),
    email: req.body.email,
    name: req.body.name,
    passwordHash: getPasswordHash(req.body.pass),
  };

  try {
    objectRepo.db.models.userModel.insert(user);
    objectRepo.db.database.save();
  } catch (err) {
    return next(err);
  }

  next();
};
