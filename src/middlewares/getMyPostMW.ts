import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * A kapott id alapján menti a bejegyzést a `locals.mypost` értékbe, ha az saját post (`locals.me`).
 * (Ha nem saját vagy nem létező post, hibát dob, amit külön nem kezel, csak a végén.)
 */
export const getMyPostMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
