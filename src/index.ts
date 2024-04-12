import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";

import { addRoutes } from "./routing";

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

addRoutes(app);

app.listen(PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${PORT}`
  );
});
