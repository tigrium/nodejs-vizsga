import { NextFunction, Request, Response } from "express";
import { MistakeError, ObjectRepository } from "../utils/types";

/**
 * Hibakezelő middleware. A kapott `MistakeError` hiba message-ét elmenti a `locals.error` értékbe.
 * Más hibát továbbdob.
 */
export const mistakeHandlerMW =
  (objectRepo: ObjectRepository) =>
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof MistakeError)) {
      return next(err);
    }
    next();
  };
