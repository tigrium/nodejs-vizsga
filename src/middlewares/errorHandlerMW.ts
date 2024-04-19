import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * A route lista végén elkapja a hibákat, logolja a hibaüzenetet, hibaoldalt renderel.
 */
export const errorHandlerMW =
  (objectRepo: ObjectRepository) => (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('ERROR HANDLER MW');
    console.log(err);
    res.render('error');
  };
