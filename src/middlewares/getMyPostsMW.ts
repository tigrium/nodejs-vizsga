import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';
import { PostResolver } from '../service/db';

/**
 * A bejelentkezett (`locals.me`) felhasználó bejegyzéseit menti a `locals.myPosts` értékbe.
 */
export const getMyPostsMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const postResolver = new PostResolver(objectRepo.db.models.postModel, objectRepo.db.models.userModel);

    const posts = postResolver.getPosts(
      objectRepo.db.models.postModel.find({ userId: res.locals.me.id }).sort((a, b) => (a.ts > b.ts ? -1 : 1)),
      true,
    );

    res.locals.myPosts = true;
    res.locals.posts = posts;
    next();
  } catch (err) {
    return next(err);
  }
};
