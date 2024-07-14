import { NextFunction, Request, Response } from "express";
import { ApplicationMiddleware } from "./application.middleware";

export class AuthorizationMiddleware extends ApplicationMiddleware {
  public async checkAdmin(req: Request, res: Response, next: NextFunction) {
    const currentUser = await ApplicationMiddleware.currentUser(req);

    if (!currentUser) {
      req.flash("error", "You have not logged in yet.");
      return res.redirect("/logins");
    } else if (currentUser.role != 0) {
      req.flash("error", "You are not admin");
      return res.redirect("/logins");
    }

    next();
  }
}
