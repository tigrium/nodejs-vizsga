import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

/**
 * A paraméterben kapott `:postId`-t menti az üzenetek közé.
 */
export const repostMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  next();
};
