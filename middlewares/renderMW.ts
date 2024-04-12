import { Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

export const renderMW = (objectRepo: ObjectRepository, templateFile: string) => (req: Request, res: Response) => {
  res.json({ templateFile, data: res.locals });
  // res.render(templateFile, res.locals);
};
