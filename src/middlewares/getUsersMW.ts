import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * Felhasználók listáját menti a `locals.users` értékbe.
 */
export const getUsersMW =
  ({
    db: {
      models: { userModel },
    },
  }: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    const users = userModel.find().sort((a, b) => (a.name > b.name ? 1 : -1));

    res.locals.users = users;
    next();
  };
