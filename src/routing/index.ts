import { Express } from 'express';
import { v4 as uuid } from 'uuid';

import {
  authMW,
  checkForgotPassMW,
  checkNewPassMW,
  createPassRequestMW,
  editPostMW,
  errorHandlerMW,
  getMyPostMW,
  getMyPostsMW,
  getPostsByUserMW,
  getPostsMW,
  getUsersMW,
  loginUserMW,
  mistakeHandlerMW,
  noauthMW,
  postMW,
  redirectMW,
  removePostMW,
  renderMW,
  repostMW,
  sessionCheckMW,
  setPassMW,
  setUserDataMW,
  signupUserMW,
} from '../middlewares';
import { KukoriDb } from '../service/db';

export const addRoutes = (app: Express, db: KukoriDb) => {
  const objectRepository = { db, uuid };

  app.use(sessionCheckMW(objectRepository));

  app.get('/signup', noauthMW(objectRepository, '/signup'), renderMW(objectRepository, 'signup'));

  app.post(
    '/signup',
    noauthMW(objectRepository),
    checkNewPassMW(objectRepository),
    signupUserMW(objectRepository),
    redirectMW(objectRepository, '/login'),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, 'signup'),
  );

  app.get('/login', noauthMW(objectRepository), renderMW(objectRepository, 'login'));

  app.post(
    '/login',
    noauthMW(objectRepository),
    loginUserMW(objectRepository),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, 'login'),
  );

  app.get(
    '/forgotpass/:secret',
    noauthMW(objectRepository),
    checkForgotPassMW(objectRepository),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, 'forgotpass'),
  );

  app.post(
    '/forgotpass/:secret',
    noauthMW(objectRepository),
    checkForgotPassMW(objectRepository),
    checkNewPassMW(objectRepository),
    setPassMW(objectRepository),
    redirectMW(objectRepository, '/'),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, 'forgotpass'),
  );

  app.get('/forgotpass', noauthMW(objectRepository), renderMW(objectRepository, 'forgotpass'));

  app.post(
    '/forgotpass',
    noauthMW(objectRepository),
    createPassRequestMW(objectRepository),
    redirectMW(objectRepository, '/'),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, 'forgotpass'),
  );

  app.get('/profile', authMW(objectRepository), renderMW(objectRepository, 'profile'));

  app.post(
    '/profile',
    authMW(objectRepository),
    setUserDataMW(objectRepository),
    redirectMW(objectRepository, '/profile'),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, 'profile'),
  );

  app.post('/logout', authMW(objectRepository), noauthMW(objectRepository, '/'));

  app.post(
    '/post',
    authMW(objectRepository),
    postMW(objectRepository),
    redirectMW(objectRepository, '/'),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, 'posts'),
  );

  app.post('/repost/:postId', authMW(objectRepository), repostMW(objectRepository), redirectMW(objectRepository, '/'));

  app.get('/my-posts', authMW(objectRepository), getMyPostsMW(objectRepository), renderMW(objectRepository, 'posts'));

  app.post(
    '/remove-post/:postId',
    authMW(objectRepository),
    getMyPostMW(objectRepository),
    removePostMW(objectRepository),
    redirectMW(objectRepository, '/my-posts'),
  );

  app.get(
    '/edit-post/:postId',
    authMW(objectRepository),
    getMyPostMW(objectRepository),
    renderMW(objectRepository, 'editPost'),
  );

  app.post(
    '/edit-post/:postId',
    authMW(objectRepository),
    getMyPostMW(objectRepository),
    editPostMW(objectRepository),
    redirectMW(objectRepository, '/my-posts'),
  );

  app.get('/users', getUsersMW(objectRepository), renderMW(objectRepository, 'users'));

  app.get('/posts/:userId', getPostsByUserMW(objectRepository), renderMW(objectRepository, 'posts'));

  app.get('/', getPostsMW(objectRepository), renderMW(objectRepository, 'posts'));

  app.get('*', redirectMW(objectRepository, '/'));

  app.use(errorHandlerMW(objectRepository));
};
