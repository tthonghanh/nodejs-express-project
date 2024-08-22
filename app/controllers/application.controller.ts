import models from "@models";
import { UserRoleEnum } from "@models/enums";
import { NextFunction, Request, Response } from "express";

export class ApplicationController {
  public async validateUserLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.session.userId) {
      req.flash("errors", "You have to login first.");
      return res.redirect("/");
    }

    const user = await models.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (!user) {
      req.flash(
        "errors",
        `User with id: ${req.session.userId} does not found.`
      );
      return res.redirect("/");
    }

    req.user = user;
    next();
  }

  public async validateAdmin(req: Request, res: Response, next: NextFunction) {
    const currentUser = req.user;

    if (currentUser.role === UserRoleEnum.ADMIN) {
      next();
    } else {
      req.flash("errors", `You are not an admin`);

      return res.redirect("/");
    }
  }
}
