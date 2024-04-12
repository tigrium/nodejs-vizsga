import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * A paraméterben kapott felhasználóadatokat menti.
 */
export const setUserDataMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };
