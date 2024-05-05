import { NextFunction, Request, Response } from 'express';
import { addHours } from 'date-fns';

import { MistakeError, ObjectRepository } from '../service/types';
import { ForgotPassInput } from '../service/inputSchemas';
import { inputCheck } from '../service/inputCheck';
import { sendEmail } from '../service/sendEmail';
import { ForgotPass } from '../service/models';

/**
 * Létrehoz az adatbázisban egy jelszó kérést és elküldi emailben a linket.
 */
export const createPassRequestMW =
  ({
    db: {
      models: { userModel, forgotPassModel },
      database,
    },
    uuid,
  }: ObjectRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.body, ForgotPassInput);
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const user = userModel.findOne({ email: req.body.email });
    if (!user) {
      // Nem tájékoztatjuk a felhasználót, hogy az adott cím regisztrálva van-e a rendszerben.
      return next();
    }

    const forgotpass: ForgotPass = {
      userId: user.id,
      secret: uuid(),
      valid: addHours(new Date(), 1).getTime(),
    };

    try {
      forgotPassModel.insert(forgotpass);
      await new Promise<void>((resolve, reject) => database.save((err?: any) => err ? reject(err) : resolve()));
    } catch (err) {
      return next(err);
    }

    try {
      await sendEmail({
        recipient: user.email,
        subject: 'Elfelejtett jelszó kérés',
        message: `Kedves ${user.name}!

Ezen a címen állíthatsz be új jelszót: ${req.protocol}://${req.headers.host}/forgotpass/${forgotpass.secret}
A link 1 órán keresztül érvényes.

Üdvözlettel,
Kukori`,
      });
    } catch (err) {
      return next(err);
    }

    next();
  };
