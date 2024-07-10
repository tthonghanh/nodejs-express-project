import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";

export class UserController extends ApplicationController {
  public async new(req: Request, res: Response) {
    res.render("user.view/new", { messages: req.flash() });
  }

  public async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      req.flash("error", "Name, Email and Password are required.");

      return res.redirect("/users/new");
    } else if (name.length < 6 || password.length < 6) {
      if (name.length < 6) {
        req.flash("error", "Length of name must be more than 6 letters");
      }
      if (password.length < 6) {
        req.flash("error", "Length of password must be more than 6 letters");
      }

      return res.redirect("/users/new");
    }

    const newUser = await models.user.create({
      data: {
        name,
        email,
        role: 1,
      },
    });

    await models.password.create({
      data: {
        userId: newUser.id,
        password: password,
        deleteAt: null
      }
    })

    req.flash("success", "Register successfully");
    res.redirect("/");
  }
}
