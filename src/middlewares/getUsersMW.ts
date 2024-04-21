import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Felhasználók listáját menti a `locals.users` értékbe.
 */
export const getUsersMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  const users = objectRepo.db.models.userModel.find().sort((a, b) => (a.name > b.name ? 1 : -1));

  res.locals.users = users;
  next();
};
