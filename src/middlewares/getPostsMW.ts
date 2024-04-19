import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { PostResolver } from '../service/db';
import { UuidInput } from '../service/inputSchemas';
import { inputCheck } from '../service/inputCheck';

/**
 * A bejegyzések listáját menti a `locals.posts` értékbe. A repostok adatait is hozzáfűzi az adatokhoz.
 */
export const getPostsMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const postResolver = new PostResolver(objectRepo.db.models.postModel, objectRepo.db.models.userModel);

    const posts = postResolver.getPosts();

    res.locals.posts = posts;
    next();
  } catch (err) {
    return next(err);
  }
};

/**
 * A `:userId` alapján kiválasztott felhasználó bejegyzéseit listázza. A repostok adatait hozzáfűzi az adatokhoz,
 * de az egyes bejegyzésekhez nem fűz hozzá szerző felhasználót. A listát a `locals.posts` értékbe menti.
 */
export const getPostsByUserMW = (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
  const mistakes = await inputCheck(req.params.userId, UuidInput);
  if (mistakes.length > 0) {
    next(new MistakeError(mistakes));
  }
  try {
    const postResolver = new PostResolver(objectRepo.db.models.postModel, objectRepo.db.models.userModel);

    const { posts, user } = postResolver.getPostsByUser(req.params.userId);

    res.locals.user = user;
    res.locals.posts = posts;
    next();
  } catch (err) {
    return next(err);
  }
};
