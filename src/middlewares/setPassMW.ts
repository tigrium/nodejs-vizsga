import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';
import { getPasswordHash } from '../service/passwordHash';

/**
 * A `locals.forgotPass` alapján kiválasztott igénylés userének jelszavát módosítja a paraméterben (`body.pass`) kapottra.
 * A jelszókéréshez regisztrálja a felhasználás idejét.
 */
export const setPassMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = res.locals.forgotPass;

    objectRepo.db.models.forgotPassModel.remove(res.locals.forgotPass);

    const user = objectRepo.db.models.userModel.findOne({ id: userId });
    if (!user) {
      return next(new Error('A felhasználó nem létezik.'));
    }

    user.passwordHash = getPasswordHash(req.body.pass);
    objectRepo.db.models.userModel.update(user);

    objectRepo.db.database.save();
  } catch (err) {
    return next(err);
  }

  next();
};
