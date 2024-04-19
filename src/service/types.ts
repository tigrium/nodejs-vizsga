import { KukoriDb } from './db';
import { OriginalPost } from './models';

export class MistakeError extends Error {}

export type ObjectRepository = {
  db: KukoriDb;
};

export type PostToRender = Omit<OriginalPost, 'userId' | 'ts'> & {
  user?: string;
  ts: string;
  original?: {
    user: string;
    ts: string;
  };
};
