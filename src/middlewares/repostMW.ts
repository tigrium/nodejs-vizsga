import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { UuidInput } from '../service/inputSchemas';
import { Post } from '../service/models';

/**
 * A paraméterben kapott `:postId`-t menti az üzenetek közé.
 */
export const repostMW = (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
  const mistakes = await inputCheck(req.params.postId, UuidInput);
  if (mistakes.length > 0) {
    next(new MistakeError(mistakes));
  }

  const post: Post = {
    id: objectRepo.uuid(),
    postId: req.params.postId,
    userId: res.locals.me.id as string,
    ts: new Date().getTime(),
  };

  try {
    objectRepo.db.models.postModel.insert(post);
    objectRepo.db.database.save();
  } catch (err) {
    return next(err);
  }

  next();
};
