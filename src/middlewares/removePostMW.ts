import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * A `locals.myPost` bejegyzést törli az adatbázisból.
 */
export const removePostMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  res.locals.myPost.text = req.body.text;

  try {
    objectRepo.db.models.postModel.remove(res.locals.myPost);
    objectRepo.db.database.save();
  } catch (err) {
    return next(err);
  }

  next();
};
