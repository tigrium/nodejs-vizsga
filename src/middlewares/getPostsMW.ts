import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { PostResolver } from '../service/db';
import { UuidInput } from '../service/inputSchemas';
import { inputCheck } from '../service/inputCheck';

/**
 * A bejegyzések listáját menti a `locals.posts` értékbe. A repostok adatait is hozzáfűzi az adatokhoz.
 */
export const getPostsMW =
  ({
    db: {
      models: { postModel, userModel },
    },
  }: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const postResolver = new PostResolver(postModel, userModel);

      const posts = postResolver.getPosts(postModel.find().sort((a, b) => (a.ts > b.ts ? -1 : 1)));

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
export const getPostsByUserMW =
  ({
    db: {
      models: { postModel, userModel },
    },
  }: ObjectRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.params.userId, UuidInput);
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }
    try {
      const postResolver = new PostResolver(postModel, userModel);

      const user = postResolver.getUserData(req.params.userId);
      const posts = postResolver.getPosts(
        postModel.find({ userId: req.params.userId }).sort((a, b) => (a.ts > b.ts ? -1 : 1)),
        true,
      );

      res.locals.user = user;
      res.locals.posts = posts;
      next();
    } catch (err) {
      return next(err);
    }
  };
