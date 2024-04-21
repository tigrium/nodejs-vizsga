import { Request, Response } from 'express';
import { ObjectRepository } from '../service/types';

export const renderMW = (objectRepo: ObjectRepository, templateFile: string) => (req: Request, res: Response) => {
  res.render(templateFile, res.locals, (err, html) => {
    if (err) {
      console.log(err);
      console.log(res.locals);
      return res.render('error');
    }
    res.send(html);
  });
};
