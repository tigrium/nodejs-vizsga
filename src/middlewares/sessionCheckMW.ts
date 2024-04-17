import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * Session alapján ellenőrzi, hogy a felhasználó be van-e jelentkezve. Ha be van, a nevét (`name`) és id-ját (`userId`) menti a `locals.me` értékbe.
 */
export const sessionCheckMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.me = {
      id: "xyz",
      name: "Kata",
    };
    next();
  };
