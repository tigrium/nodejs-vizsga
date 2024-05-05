import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { UuidInput } from '../service/inputSchemas';
import { Post, RePost } from '../service/models';

/**
 * A paraméterben kapott `:postId`-t menti az üzenetek közé.
 */
export const repostMW =
  ({
    db: {
      database,
      models: { postModel },
    },
    uuid,
  }: ObjectRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.params.postId, UuidInput);
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const repost = postModel.findOne({ id: req.params.postId });

    if (!repost) {
      return next(new MistakeError('Bejegyzés nem található.'));
    }

    const post: Post = {
      id: uuid(),
      postId: Object.keys(repost).includes('postId') ? (repost as RePost).postId : repost.id,
      userId: res.locals.me.id as string,
      ts: new Date().getTime(),
    };

    try {
      postModel.insert(post);
    } catch (err) {
      return next(err);
    }

    return database.save(next);
  };
