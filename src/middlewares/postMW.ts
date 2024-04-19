import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * A paraméterben kapott bejegyzést elmenti.
 */
export const postMW =
  (objectRepo: ObjectRepository) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("post something...")
    next();
  };
