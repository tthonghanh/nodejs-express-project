import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";
import md5 from 'md5'

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export class LoginController extends ApplicationController {
  public async index(req: Request, res: Response) {
    res.render("login.view/index");
  }

  public async create(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await models.user.findUnique({
      where: {
        email: email,
        passwords: {
          some: {
            password: md5(password),
            deleteAt: null,
          },
        },
      },
    });

    if (!user) {
      req.flash("error", "Email or password is invalid");
      return res.redirect("/logins");
    }

    req.session.userId = user.id;
    req.flash("success", "Login successfully");
    if (user.role == 0) return res.redirect("/admin");
    return res.redirect("/");
  }

  public async destroy(req: Request, res: Response) {
    req.session.destroy((err: Error) => {
      if (err) console.log(err);
      else {
        res.redirect("/");
      }
    });
  }
}
