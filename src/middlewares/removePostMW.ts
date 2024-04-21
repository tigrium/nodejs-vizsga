import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * A `locals.myPost` bejegyzést törli az adatbázisból.
 */
export const removePostMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const reposts = objectRepo.db.models.postModel.find({ postId: res.locals.myPost.id });
    reposts.forEach((post) => {
      objectRepo.db.models.postModel.remove(post);
    });
    objectRepo.db.models.postModel.remove(res.locals.myPost);
    objectRepo.db.database.save();
  } catch (err) {
    return next(err);
  }

  next();
};
