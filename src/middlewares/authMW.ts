import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Ha nincs `locals.me` érték, a kezdőlapra irányít át.
 */
export const authMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  console.log('authMW');
  if (!res.locals.me) {
    return res.redirect('/');
  }
  next();
};
