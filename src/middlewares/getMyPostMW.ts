import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { UuidInput } from '../service/inputSchemas';

/**
 * A kapott id (`:postId`) alapján menti a bejegyzést a `locals.myPost` értékbe, ha az saját post (`locals.me`).
 * (Ha nem saját vagy nem létező post, hibát dob, amit külön nem kezel, csak a végén.)
 */
export const getMyPostMW =
  (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
    const mistakes = await inputCheck(req.params.postId, UuidInput);
    if (mistakes.length > 0) {
      return next(new MistakeError(mistakes));
    }

    const myPost = objectRepo.db.models.postModel.findOne({ id: req.params.postId, userId: res.locals.me.id });

    if (!myPost) {
      return next(new MistakeError('Bejegyzés nem található.'));
    }

    res.locals.myPost = myPost;

    next();
  };
