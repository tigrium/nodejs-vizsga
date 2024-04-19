import { NextFunction, Request, Response } from 'express';
import { ObjectRepository, PostToRender } from '../service/types';

/**
 * A kapott id alapján menti a bejegyzést a `locals.mypost` értékbe, ha az saját post (`locals.me`).
 * (Ha nem saját vagy nem létező post, hibát dob, amit külön nem kezel, csak a végén.)
 */
export const getMyPostMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  const myPost: PostToRender = {
    id: 'abcdef',
    text: 'Maecenas dignissim molestie velit, eu sollicitudin nisl eleifend eu. Vivamus vel lobortis purus. Nam vitae neque quam. Cras dictum, diam quis cursus faucibus, tellus tellus viverra diam, ut pretium massa.',
    ts: '2024.04.17. 20:59:23',
  };
  res.locals.myPost = myPost;
  next();
};
