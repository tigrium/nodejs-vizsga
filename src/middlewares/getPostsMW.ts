import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * A bejegyzések listáját menti a `locals.posts` értékbe. A repostok adatait is hozzáfűzi az adatokhoz.
 */
export const getPostsMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };

/**
 * A `:userId` alapján kiválasztott felhasználó bejegyzéseit listázza. A repostok adatait hozzáfűzi az adatokhoz,
 * de az egyes bejegyzésekhez nem fűz hozzá szerző felhasználót. A listát a `locals.posts` értékbe menti.
 */
export const getPostsByUserMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
