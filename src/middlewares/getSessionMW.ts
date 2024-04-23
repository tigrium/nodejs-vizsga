import { Express } from 'express';
import session, { SessionOptions } from 'express-session';

import { getProcessEnv } from '../service/processEnv';
import { LokiStore } from '../service/LokiStore';

declare module 'express-session' {
  // eslint-disable-next-line no-unused-vars
  interface SessionData {
    userId: string;
  }
}

export const getSessionMW = (app: Express) => {
  const isProduction = getProcessEnv('PROD', (v) => Boolean(v), false);

  const sessionOptions: SessionOptions = {
    store: new LokiStore(),
    secret: getProcessEnv('COOKIE_SECRET'),
    name: isProduction ? '__Host-Session' : 'Session',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  };

  if (isProduction) {
    app.set('trust proxy', 1);
  }

  return session(sessionOptions);
};
