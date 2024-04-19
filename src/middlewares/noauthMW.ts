import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Ha van `locals.me` érték, kijelentkeztet és a paraméterben kapott oldalra irányít át.
 * Ha nincs `redirectPath` megadva, akkor a `req.path` útvonalra.
 */
export const noauthMW =
  (objectRepo: ObjectRepository, redirectPath?: string) => (req: Request, res: Response, next: NextFunction) => {
    // session destroy...
    // res.redirect(redirectPath ?? req.path);
    next();
  };
