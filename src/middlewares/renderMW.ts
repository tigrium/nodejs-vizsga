import { NextFunction, Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

export const renderMW =
  (objectRepo: ObjectRepository, templateFile: string) => (req: Request, res: Response, next: NextFunction) => {
    res.render(templateFile, res.locals, (err, html) => {
      if (err) {
        console.log(err);
        console.log(res.locals);
        return next(err);
      }
      res.send(html);
    });
  };
