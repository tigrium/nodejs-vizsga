import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Elmenti lemezre az adatbázist.
 */
export const saveDbMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  next();
};
