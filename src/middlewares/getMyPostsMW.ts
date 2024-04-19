import { NextFunction, Request, Response } from 'express';
import { ObjectRepository, PostToRender } from '../service/types';

/**
 * A bejelentkezett (`locals.me`) felhasználó bejegyzéseit menti a `locals.myposts` értékbe.
 */
export const getMyPostsMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  console.log('getMyPostsMW');
  const posts: PostToRender[] = [
    {
      id: 'abcdef',
      text: 'Maecenas dignissim molestie velit, eu sollicitudin nisl eleifend eu. Vivamus vel lobortis purus. Nam vitae neque quam. Cras dictum, diam quis cursus faucibus, tellus tellus viverra diam, ut pretium massa.',
      ts: '2024.04.17. 20:59:23',
    },
    {
      id: 'vdewr',
      text: 'Pellentesque dapibus enim eget sodales suscipit. Quisque sit amet ultrices ligula. Ut sit amet vulputate felis, a tristique quam. Mauris posuere viverra diam sit amet tristique. Mauris feugiat sollicitudin nisl vitae faucibus. Ut mollis diam ac augue.',
      ts: '2024.04.17. 17:06:10',
      original: {
        user: 'Felhasználó Z',
        ts: '2024.04.01. 12:00:00',
      },
    },
  ];
  res.locals.posts = posts;
  res.locals.myposts = true;
  next();
};
