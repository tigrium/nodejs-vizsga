import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * Felhasználók listáját (`locals.users`) userId kulcsú Map formájában menti a locals.userMap értékbe.
 */
export const mapUsersMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
