import { NextFunction, Request, Response } from 'express';
import { MistakeError, ObjectRepository } from '../service/types';

/**
 * Hibakezelő middleware. A kapott `MistakeError` hiba message és/vagy `messages` értékeit elmenti a `session.errors: string[]` értékbe, majd átirányít a forrás oldalra.
 * Más hibát továbbdob.
 */
export const mistakeHandlerMW =
  (objectRepo: ObjectRepository) => (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof MistakeError)) {
      return next(err);
    }
    const errors = new Set<string>();
    [err.message, ...(err.messages ?? [])].forEach((message) => {
      if (message) {
        errors.add(message);
      }
    });
    req.session.errors = Array.from(errors.values());
    req.session.reqBody = req.body;
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(req.path);
    });
  };
