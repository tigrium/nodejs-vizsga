import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * A `locals.forgotPass` alapján kiválasztott igénylés userének jelszavát módosítja a paraméterben (`body.pass`) kapottra.
 * A jelszókéréshez regisztrálja a felhasználás idejét.
 */
export const setPassMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  next();
};
