import express from "express";

export const staticRouter = () => {
  const router = express.Router();

  // App static
  router.use(express.static("public"));

  // Bootstrap
  router.use(
    "/css",
    express.static("node_modules/bootstrap/dist/css")
  );
  router.use("/js", express.static("node_modules/bootstrap/dist/js"));
  // router.use("/js", express.static("node_modules/jquery/dist"));
  router.use("/font", express.static("node_modules/bootstrap-icons/font"))

  return router;
};
