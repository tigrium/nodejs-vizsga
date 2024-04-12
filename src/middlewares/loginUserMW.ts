import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * A paraméterben kapott adatok (`body.email`, `body.pass`) alapján kikeresi a usert.
 * Ha nem találja, hibát dob. Ha megtalálja, beállítja a sessiont és átirányít a kezdőlapra.
 */
export const loginUserMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  next();
};
