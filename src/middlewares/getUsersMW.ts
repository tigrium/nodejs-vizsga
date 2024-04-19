import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Felhasználók listáját menti a `locals.users` értékbe.
 */
export const getUsersMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  next();
};
