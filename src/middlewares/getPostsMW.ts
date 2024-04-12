import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

/**
 * A bejegyzések listáját menti a `locals.posts` értékbe. A repostok adatait is hozzáfűzi az adatokhoz.
 */
export const getPostsMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
