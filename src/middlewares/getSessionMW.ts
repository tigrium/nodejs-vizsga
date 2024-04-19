import { getProcessEnv } from '../service/processEnv';
import { Express } from 'express';
import session, { SessionOptions } from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    userId: string;
  }
}

export const getSessionMW = (app: Express) => {
  const isProduction = getProcessEnv('PROD', (v) => Boolean(v), false);

  const sessionOptions: SessionOptions = {
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
