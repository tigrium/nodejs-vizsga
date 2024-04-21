import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';
import { inputCheck } from '../service/inputCheck';
import { PostInput } from '../service/inputSchemas';

/**
 * A `locals.myPost` bejegyzést a kapott adatokkal módosítja.
 */
export const editPostMW = (objectRepo: ObjectRepository) => async (req: Request, res: Response, next: NextFunction) => {
  const mistakes = await inputCheck(req.body, PostInput);
  if (mistakes.length > 0) {
    return next(new MistakeError(mistakes));
  }

  res.locals.myPost.text = req.body.text;

  try {
    objectRepo.db.models.postModel.update(res.locals.myPost);
    objectRepo.db.database.save();
  } catch (err) {
    return next(err);
  }

  next();
};
