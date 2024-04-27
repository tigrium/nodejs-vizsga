import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

/**
 * A `locals.myPost` bejegyzést törli az adatbázisból.
 */
export const removePostMW =
  ({
    db: {
      database,
      models: { postModel },
    },
  }: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const reposts = postModel.find({ postId: res.locals.myPost.id });
      reposts.forEach((post) => {
        postModel.remove(post);
      });
      postModel.remove(res.locals.myPost);
      database.save();
    } catch (err) {
      return next(err);
    }

    next();
  };
