import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Session alapján ellenőrzi, hogy a felhasználó be van-e jelentkezve. Ha be van, a nevét (`name`) és id-ját (`userId`) menti a `locals.me` értékbe.
 */
export const sessionCheckMW =
  ({
    db: {
      models: { userModel },
    },
  }: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
      const user = userModel.findOne({ id: req.session.userId });
      res.locals.me = user;
    }

    if (req.session.errors) {
      res.locals = { ...res.locals, ...req.session.reqBody };
      delete req.session.reqBody;
      res.locals.errors = req.session.errors;
      delete req.session.errors;

      return req.session.save(next);
    }
    next();
  };
