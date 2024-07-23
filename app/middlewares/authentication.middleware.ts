import { NextFunction, Request, Response } from "express";
import { ApplicationMiddleware } from "./application.middleware";

export class AuthenticationMiddleware extends ApplicationMiddleware {
  public async checkLogin(req: Request, res: Response, next: NextFunction) {
    const currentUser = await ApplicationMiddleware.currentUser(req);

    if (!currentUser) {
      req.flash("error", "You have not logged in yet.");
      return res.redirect("/auth");
    }

    next();
  }
}
