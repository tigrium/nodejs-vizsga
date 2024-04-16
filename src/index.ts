import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";

import { addRoutes } from "./routing";
import { initDatabase } from "./service/db";

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

initDatabase()
  .then((db) => {
    addRoutes(app, db);

    app.listen(PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
