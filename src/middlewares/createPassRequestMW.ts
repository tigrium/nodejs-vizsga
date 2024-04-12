import { NextFunction, Request, Response } from "express";
import { ObjectRepository } from "../service/types";

/**
 * Létrehoz az adatbázisban egy jelszó kérést és elküldi emailben a linket.
 */
export const createPassRequestMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  next();
};
