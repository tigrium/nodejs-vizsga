import { NextFunction, Request, Response } from 'express';
import { addDays } from 'date-fns';

import { MistakeError, ObjectRepository } from '../service/types';
import { ForgotPassInput } from '../service/inputSchemas';
import { inputCheck } from '../service/inputCheck';
import { sendEmail } from '../service/sendEmail';
import { ForgotPass } from '../service/models';

/**
 * Létrehoz az adatbázisban egy jelszó kérést és elküldi emailben a linket.
 */
export const createPassRequestMW =
  (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
    console.log('createPassRequestMW');
    const mistakes = await inputCheck(req.body, ForgotPassInput);

    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const user = objectRepo.db.models.userModel.findOne({ email: req.body.email });

    if (!user) {
      return next();
    }

    const forgotpass: ForgotPass = {
      userId: user.id,
      secret: objectRepo.uuid(),
      valid: addDays(new Date(), 30).getTime(),
    };

    try {
      objectRepo.db.models.forgotPassModel.insert(forgotpass);
      objectRepo.db.database.save();
    } catch (err) {
      return next(err);
    }

    await sendEmail({
      recipient: user.email,
      subject: 'Elfelejtett jelszó kérés',
      message: `Kedves ${user.name}!

Ezen a címen állíthatsz be új jelszót: ${req.protocol}://${req.headers.host}/forgotpass/${forgotpass.secret}.
A link 30 napig érvényes.

Kukori`,
    });

    next();
  };
