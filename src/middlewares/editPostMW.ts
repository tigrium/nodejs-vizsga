import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * A `locals.mypost` bejegyzést a kapott adatokkal módosítja.
 */
export const editPostMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  console.log('editPostMW');
  next();
};
