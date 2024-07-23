import { exec } from "child_process";
import cookieParser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import flash from "express-flash";
import expressSession from "express-session";
import createError from "http-errors";
import methodOverride from "method-override";
import multer from "multer";
import { join, resolve } from "path";
import serverless from "serverless-http";
import env from "./env";
import { Route } from "./routes";
import fs from 'fs-extra'
import { ProductAdminController } from "../app/controllers";
import bodyParser from 'body-parser'
import { fileFilter } from "./multer";
import path from 'path'

declare module "express-session" {
  interface SessionData {
    user: string;
  }
}

// const storage = multer.diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, '/uploads')
//       },
//       filename: (req, file, cb) => {
//         cb(null, file.fieldname + "-" + Date.now());
//       },
//     });

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

class Application {
  private readonly port = env.PORT || "3000";
  private readonly app: Express = express();
  // private session = require('express-session');
  // private readonly methodOverride = require("method-override");
  // private storage;
  // private upload;

  constructor() {

    this.app.set("views", join(resolve("./app"), "views"));
    this.app.set("view engine", "pug");

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(methodOverride("_method"));
    this.app.use(cookieParser("keyboard cat"));
    this.app.use(
      expressSession({
        secret: "hjjdbjsabca",
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 60000,
        },
      })
    );
    this.app.use(flash());
    // this.app.use(fileUpload());
    this.app.use(bodyParser.urlencoded({extended: false}));
    // app.use(multer({ storage: storage, fileFilter: fileFilter }));

    this.app.use(express.static(join(resolve("app"), "assets")));
    this.app.use(
      "/css",
      express.static(join(resolve("./node_modules"), "bootstrap/dist/css"))
    );
    this.app.use(
      "/js",
      express.static(join(resolve("./node_modules"), "bootstrap/dist/js"))
    );
    this.app.use(
      "/js",
      express.static(join(resolve("./node_modules"), "jquery/dist"))
    );
    this.app.use(
      "/js",
      express.static(join(resolve("./node_modules"), "vue/dist"))
    );

    this.mountRoutes();
    this.on404Handler();
    this.onErrorHandler();
  }

  mountRoutes() {
    this.app.post('/admin/products', <any>upload.fields([{name: 'image'}]), (new ProductAdminController()).create);
    this.app.use(Route.draw());
  }

  on404Handler() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
      }
    );
  }

  onErrorHandler() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render("error");
      }
    );
  }

  handler() {
    return serverless(this.app);
  }

  run() {
    this.app
      .listen(this.port, () => {
        const url = `http://localhost:${this.port}`;
        console.log(`[server]:⚡️ Server is running at ${url}`);
        if (env.NODE_ENV === "development") exec(`start microsoft-edge:${url}`);
      })
      .on("error", (_error) => {
        return console.log("Error: ", _error.message);
      });
  }
}

export default new Application();
function session(arg0: { cookie: { maxAge: number } }): any {
  throw new Error("Function not implemented.");
}
