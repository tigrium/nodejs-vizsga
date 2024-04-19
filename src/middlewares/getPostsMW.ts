import { NextFunction, Request, Response } from 'express';
import { ObjectRepository, PostToRender } from '../service/types';

/**
 * A bejegyzések listáját menti a `locals.posts` értékbe. A repostok adatait is hozzáfűzi az adatokhoz.
 */
export const getPostsMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
  const posts: PostToRender[] = [
    {
      id: 'abcdef',
      text: 'Maecenas dignissim molestie velit, eu sollicitudin nisl eleifend eu. Vivamus vel lobortis purus. Nam vitae neque quam. Cras dictum, diam quis cursus faucibus, tellus tellus viverra diam, ut pretium massa.',
      user: 'Felhasználó 1',
      ts: '2024.04.17. 20:59:23',
    },
    {
      id: 'vdewr',
      text: 'Pellentesque dapibus enim eget sodales suscipit. Quisque sit amet ultrices ligula. Ut sit amet vulputate felis, a tristique quam. Mauris posuere viverra diam sit amet tristique. Mauris feugiat sollicitudin nisl vitae faucibus. Ut mollis diam ac augue.',
      user: 'Felhasználó 2',
      ts: '2024.04.17. 17:06:10',
      original: {
        user: 'Felhasználó Z',
        ts: '2024.04.01. 12:00:00',
      },
    },
  ];
  res.locals.posts = posts;
  next();
};

/**
 * A `:userId` alapján kiválasztott felhasználó bejegyzéseit listázza. A repostok adatait hozzáfűzi az adatokhoz,
 * de az egyes bejegyzésekhez nem fűz hozzá szerző felhasználót. A listát a `locals.posts` értékbe menti.
 */
export const getPostsByUserMW = (objectRepo: ObjectRepository) => (req: Request, res: Response, next: NextFunction) => {
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
  res.locals.user = 'Felhasználó 1';
  next();
};
