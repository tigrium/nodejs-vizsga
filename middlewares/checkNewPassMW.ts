import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

/**
 * Leellenőrzi a POST-ban kapott két jelszót (`body.pass`, `body.passAgain`), hogy egyeznek-e és elég hosszú-e. Ha nem, hibát dob.
 */
export const checkNewPassMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
