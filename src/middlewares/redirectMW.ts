import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Átirányít a paraméterben kapott oldalra.
 */
export const redirectMW =
  (objectRepo: ObjectRepository, redirectPath: string) => (req: Request, res: Response, next: NextFunction) => {
    console.log('redirectMW', redirectPath);
    res.redirect(redirectPath);
  };
