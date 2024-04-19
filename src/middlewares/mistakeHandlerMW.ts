import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';

/**
 * Hibakezelő middleware. A kapott `MistakeError` hiba message és/vagy `messages` értékeit elmenti a `locals.errors: string[]` értékbe.
 * Más hibát továbbdob.
 */
export const mistakeHandlerMW =
  (objectRepo: ObjectRepository) => (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof MistakeError)) {
      return next(err);
    }
    const errors = new Set();
    [err.message, ...(err.messages ?? [])].forEach((message) => {
      if (message) {
        errors.add(message);
      }
    });

    res.locals = { ...res.locals, errors, ...req.body };
    next();
  };
