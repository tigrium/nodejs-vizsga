import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { getPasswordHash } from '../service/passwordHash';
import { inputCheck } from '../service/inputCheck';
import { SetPassInput } from '../service/inputSchemas';

/**
 * A `locals.forgotPass` alapján kiválasztott igénylés userének jelszavát módosítja a paraméterben (`body.pass`) kapottra.
 * A jelszókéréshez regisztrálja a felhasználás idejét.
 */
export const setPassMW = (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mistakes = await inputCheck(req.body, SetPassInput);

    if (req.body.pass !== req.body.passAgain) {
      mistakes.push('A két jelszó nem egyezik.');
    }
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }
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
