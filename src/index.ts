import express, { NextFunction, Request, Response } from "express";
import { sessionCheckMW } from "./middlewares";

const app = express();
const port = 3000;

app.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(1);
    // throw new Error("different-passwords");
    res.locals.message = "Express + TypeScript Server";
    next();
  },
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(2);
    res.locals.error = err.message;
    next();
  },
  (req: Request, res: Response) => {
    console.log(3);
    res.send(res.locals.message ?? res.locals.error);
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
