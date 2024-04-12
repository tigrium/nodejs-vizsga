import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * A bejelentkezett (`locals.me`) felhasználó bejegyzéseit menti a `locals.myposts` értékbe.
 */
export const getMyPostsMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
