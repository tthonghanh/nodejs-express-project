import { ProductAdminController } from "@controllers";
import { upload } from "@fileUpload";
import bodyParser from "body-parser";
import { exec } from "child_process";
import cookieParser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import flash from "express-flash";
import session from "express-session";
import createError from "http-errors";
import methodOverride from "method-override";
import passport from "passport";
import passFacebook from "passport-facebook";
import { join, resolve } from "path";
import serverless from "serverless-http";
import env from "./env";
import { Route } from "./routes";

const FACEBOOK_CLIENT_ID = env.facebookClientId;
const FACEBOOK_CLIENT_SECRET = env.facebookClientSecret;
const FACEBOOK_REDIRECT_URI = env.facebookRedirectUri;

class Application {
  private readonly port = env.port || "3000";
  private readonly app: Express = express();
  private readonly FacebookStrategy = passFacebook.Strategy;

  constructor() {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (obj: any, done) {
      done(null, obj);
    });

    passport.use(
      new this.FacebookStrategy(
        {
          clientID: FACEBOOK_CLIENT_ID!,
          clientSecret: FACEBOOK_CLIENT_SECRET!,
          callbackURL: FACEBOOK_REDIRECT_URI!,
        },
        (accessToken: any, refreshToken: any, profile: any, done: any) => {
          process.nextTick(() => {
            console.log(accessToken, refreshToken, profile, done);
            return done(null, profile);
          });
        }
      )
    );
    this.app.set("views", join(resolve("./app"), "views"));
    this.app.set("view engine", "pug");

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(methodOverride("_method"));
    this.app.use(cookieParser("keyboard cat"));
    this.app.use(
      session({
        secret: "hjjdbjsabca",
        resave: true,
        saveUninitialized: true,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 3,
        },
      })
    );
    this.app.use(flash());
    // this.app.use(fileUpload());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(multer({ storage: storage, fileFilter: fileFilter }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());

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
    this.app.post(
      "/admin/products",
      upload.single("image"),
      new ProductAdminController().create
    );
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
        if (env.nodeEnv === "development") exec(`start microsoft-edge:${url}`);
      })
      .on("error", (_error) => {
        return console.log("Error: ", _error.message);
      });
  }
}

export default new Application();

