import { NextFunction, Request, Response } from 'express';

import { MistakeError, ObjectRepository } from '../service/types';
import { SetPassInput } from '../service/inputSchemas';
import { inputCheck } from '../service/inputCheck';

/**
 * Leellenőrzi a POST-ban kapott két jelszót (`body.pass`, `body.passAgain`), hogy egyeznek-e és elég hosszúak-e. Ha nem, hibát dob.
 */
export const checkNewPassMW =
  (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.body, SetPassInput);

    if (req.body.pass !== req.body.passAgain) {
      mistakes.push('A két jelszó nem egyezik.');
    }
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }
    next();
  };
