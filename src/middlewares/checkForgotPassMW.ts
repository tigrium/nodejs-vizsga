import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { ForgotPassSecretInput } from '../service/inputSchemas';
import { isAfter } from 'date-fns';

/**
 * Lekéri a `:secret` alapján, hogy érvényes jelszó igénylés-e. Ha nem, hibát dob.
 * Ha érvényes, a `locals.forgotPass` értékbe menti az igénylés db objektumát.
 */
export const checkForgotPassMW =
  (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
    console.log('checkForgotPassMW');
    const mistakes = await inputCheck(req.params.secret, ForgotPassSecretInput);
    if (mistakes.length > 0) {
      next(new MistakeError(mistakes));
    }

    const forgotPass = objectRepo.db.models.forgotPassModel.findOne({ secret: req.params.secret });
    if (!forgotPass) {
      res.locals.ok = false;
      return next();
    }
    if (isAfter(new Date(forgotPass.valid), new Date())) {
      res.locals.ok = true;
      res.locals.forgotPass = forgotPass;
      return next();
    }

    try {
      objectRepo.db.models.forgotPassModel.remove(forgotPass);
      objectRepo.db.database.save();
    } catch (err) {
      return next(err);
    }

    next();
  };
