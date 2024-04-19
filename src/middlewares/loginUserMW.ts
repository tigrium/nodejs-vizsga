import { NextFunction, Request, Response } from 'express';

import { MistakeError, ObjectRepository } from '../service/types';
import { LoginInput } from '../service/inputSchemas';
import { getPasswordHash } from '../service/passwordHash';
import { inputCheck } from '../service/inputCheck';

/**
 * A paraméterben kapott adatok (`body.email`, `body.pass`) alapján kikeresi a usert.
 * Ha nem találja, hibát dob. Ha megtalálja, beállítja a sessiont és átirányít a kezdőlapra.
 */
export const loginUserMW =
  (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.body, LoginInput);
    if (mistakes.length > 0) {
      next(new MistakeError(mistakes));
    }

    const user = objectRepo.db.models.userModel.findOne({ email: req.body.email });
    if (!user || user.passwordHash !== getPasswordHash(req.body.pass)) {
      return next(new MistakeError('E-mail cím vagy jelszó hibás.'));
    }

    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect('/');
    });
  };
