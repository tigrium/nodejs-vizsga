import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

/**
 * Ha van `locals.me` érték, kijelentkeztet és a paraméterben kapott oldalra irányít át.
 */
export const noauthMW =
  (objectRepo: ObjectRepository, redirectPath: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
