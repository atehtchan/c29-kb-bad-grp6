import express, { ErrorRequestHandler, Request, Response } from "express";
import { print } from "listening-on";
import { knex } from "./db";
// import { RequestLog } from './types'
import { HttpError } from "./http.error";
import { env } from "./env";
import { userRoutes } from "./user.routes";

let app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(userRoutes);

app.get("/hi", (req: Request, res: Response) => {
  res.send("im hihi");
});

app.use((req, res, next) =>
  next(
    new HttpError(
      404,
      `route not found, method: ${req.method}, url: ${req.url}`
    )
  )
);

let errorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  if (!err.statusCode) console.error(err);
  res.status(err.statusCode || 500);
  let error = String(err).replace(/^(\w*)Error: /, "");
  if (req.headers.accept?.includes("application/json")) {
    res.json({ error });
  } else {
    res.end(error);
  }
};
app.use(errorHandler);

let port = env.PORT;
app.listen(port, () => {
  print(port);
});
