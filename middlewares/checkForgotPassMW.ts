import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

/**
 * Lekéri a `:secret` alapján, hogy érvényes jelszó igénylés-e. Ha nem, hibát dob.
 * Ha érvényes, a `locals.forgotPass` értékbe menti az igénylés db objektumát.
 */
export const checkForgotPassMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  next();
};
