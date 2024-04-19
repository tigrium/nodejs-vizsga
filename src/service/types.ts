import { KukoriDb } from './db';
import { OriginalPost } from './models';

export class MistakeError extends Error {
  messages?: string[];

  constructor(message: string | string[]) {
    if (typeof message === 'string') {
      super(message);
    } else {
      super();
      this.messages = message;
    }
  }
}

export type ObjectRepository = {
  db: KukoriDb;

  uuid: () => string;
};

export type PostToRender = Omit<OriginalPost, 'userId' | 'ts'> & {
  user?: string;
  ts: string;
  original?: {
    user: string;
    ts: string;
  };
};
