import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { UuidInput } from '../service/inputSchemas';
import { isAfter } from 'date-fns';

/**
 * Lekéri a `:secret` alapján, hogy érvényes-e a jelszó igénylés és a `locals.ok`-ba menti.
 * Ha érvényes, a `locals.forgotPass` értékbe menti az igénylés db objektumát.
 */
export const checkForgotPassMW =
  (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.params.secret, UuidInput);
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const forgotPass = objectRepo.db.models.forgotPassModel.findOne({ secret: req.params.secret });
    if (!forgotPass) {
      res.locals.ok = false;
      return next();
    }

    res.locals.ok = isAfter(new Date(forgotPass.valid), new Date());

    if (!res.locals.ok) {
      try {
        objectRepo.db.models.forgotPassModel.remove(forgotPass);
        objectRepo.db.database.save();
        return next();
      } catch (err) {
        return next(err);
      }
    }

    res.locals.ok = true;
    res.locals.forgotPass = forgotPass;
    next();
  };
