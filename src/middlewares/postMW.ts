import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { PostInput } from '../service/inputSchemas';
import { Post } from '../service/models';

/**
 * A paraméterben kapott bejegyzést elmenti.
 */
export const postMW =
  ({
    db: {
      database,
      models: { postModel },
    },
    uuid,
  }: ObjectRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.body, PostInput);
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const post: Post = {
      id: uuid(),
      text: req.body.text as string,
      userId: res.locals.me.id as string,
      ts: new Date().getTime(),
    };

    try {
      postModel.insert(post);
      database.save();
    } catch (err) {
      return next(err);
    }

    next();
  };
