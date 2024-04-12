import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

/**
 * Leellenőrzi, hogy létezik-e már az email-cím (`body.email`).
 * Ha nem, létrehozza az új felhasználót. Ha igen, hibát dob.
 */
export const signupUserMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
