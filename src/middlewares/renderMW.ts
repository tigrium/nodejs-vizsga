import { Request, Response } from "express";
import { ObjectRepository } from "../utils/types";

export const renderMW =
  (objectRepo: ObjectRepository, templateFile: string) =>
  (req: Request, res: Response) => {
    if (templateFile === "myPosts") {
      return res.render(templateFile, res.locals);
    }
    res.json({ templateFile, data: res.locals });
    // res.render(templateFile, res.locals);
  };
