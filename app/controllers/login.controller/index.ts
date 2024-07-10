import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";

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
      },
    });

    if (user) {
      const findPassword = await models.password.findMany({
        // find all password of this user
        where: {
          userId: user.id,
        },
      });

      for (let i = 0; i < findPassword.length; i++) {
        if (password == findPassword[i].password) {
          if (findPassword[i].deleteAt == null) {
            // current password
            req.session.userId = user.id;
            req.flash("success", "Login successfully");
            return res.redirect("/");
          } else {
            req.flash("error", "This password has been changed before");
            return res.redirect("/logins");
          }
        }
      }
    }

    req.flash(
      "error",
      "Your email or password is incorrect. Please login again."
    );
    return res.redirect("/logins");
  }
}
