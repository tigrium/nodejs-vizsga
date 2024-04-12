import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

/**
 * A `locals.mypost` bejegyzést törli az adatbázisból.
 */
export const removePostMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
