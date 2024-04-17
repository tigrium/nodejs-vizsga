import { Express } from "express";
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
  saveDbMW,
  sessionCheckMW,
  setPassMW,
  setUserDataMW,
  signupUserMW,
} from "../middlewares";
import { KukoriDb } from "../service/db";

export const addRoutes = (app: Express, db: KukoriDb) => {
  const objectRepository = { db };

  app.use(sessionCheckMW(objectRepository));

  app.get(
    "/signup",
    noauthMW(objectRepository, "/signup"),
    renderMW(objectRepository, "signup")
  );

  app.post(
    "/signup",
    noauthMW(objectRepository),
    checkNewPassMW(objectRepository),
    signupUserMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/login"),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, "signup")
  );

  app.get(
    "/login",
    noauthMW(objectRepository),
    renderMW(objectRepository, "login")
  );

  app.post(
    "/login",
    noauthMW(objectRepository),
    loginUserMW(objectRepository),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, "login")
  );

  app.get(
    "/forgotpass/:secret",
    noauthMW(objectRepository),
    checkForgotPassMW(objectRepository),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, "forgotpass")
  );

  app.post(
    "/forgotpass/:secret",
    noauthMW(objectRepository),
    checkNewPassMW(objectRepository),
    checkForgotPassMW(objectRepository),
    setPassMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/"),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, "forgotpass")
  );

  app.get(
    "/forgotpass",
    noauthMW(objectRepository),
    renderMW(objectRepository, "forgotpass")
  );

  app.post(
    "/forgotpass",
    noauthMW(objectRepository),
    createPassRequestMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/")
  );

  app.get(
    "/profile",
    authMW(objectRepository),
    renderMW(objectRepository, "profile")
  );

  app.post(
    "/profile",
    authMW(objectRepository),
    checkNewPassMW(objectRepository),
    setUserDataMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/profile"),
    mistakeHandlerMW(objectRepository),
    renderMW(objectRepository, "profile")
  );

  app.post(
    "/logout",
    authMW(objectRepository),
    noauthMW(objectRepository, "/")
  );

  app.post(
    "/post",
    authMW(objectRepository),
    postMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/")
  );

  app.post(
    "/repost/:postId",
    authMW(objectRepository),
    repostMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/")
  );

  app.get(
    "/my-posts",
    authMW(objectRepository),
    getMyPostsMW(objectRepository),
    renderMW(objectRepository, "myPosts")
  );

  app.post(
    "/remove-post/:postId",
    authMW(objectRepository),
    getMyPostMW(objectRepository),
    removePostMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/my-posts")
  );

  app.get(
    "/edit-post/:postId",
    authMW(objectRepository),
    getMyPostMW(objectRepository),
    renderMW(objectRepository, "editPost")
  );

  app.post(
    "/edit-post/:postId",
    authMW(objectRepository),
    getMyPostMW(objectRepository),
    editPostMW(objectRepository),
    saveDbMW(objectRepository),
    redirectMW(objectRepository, "/my-posts")
  );

  app.get(
    "/users",
    getUsersMW(objectRepository),
    renderMW(objectRepository, "users")
  );

  app.get(
    "/posts/:userId",
    getPostsByUserMW(objectRepository),
    renderMW(objectRepository, "posts")
  );

  app.get(
    "/",
    getUsersMW(objectRepository),
    getPostsMW(objectRepository),
    renderMW(objectRepository, "posts")
    // renderMW(objectRepository, "error")
  );

  app.get("*", redirectMW(objectRepository, "/"));

  app.use(errorHandlerMW(objectRepository));
};
