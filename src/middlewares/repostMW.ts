import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * A paraméterben kapott `:postId`-t menti az üzenetek közé.
 */
export const repostMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  console.log('repostMW');
  next();
};
