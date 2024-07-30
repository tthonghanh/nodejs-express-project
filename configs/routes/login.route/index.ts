import { HomeController, LoginController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";
import passport from "passport";

export class LoginRoute {
  private static path = Router();
  private static loginController = new LoginController();

  public static draw() {
    this.path.route("/google").get(this.loginController.loginWithGoogle);
    this.path.route("/google/callback").get(this.loginController.loginRedirectGooGle);
    this.path.route("/facebook").get(this.loginController.loginWithFacebook);
    this.path.route("/facebook/callback").get(this.loginController.loginRedirectFacebook);

    Route.resource(this.path, LoginController, {
      only: [RestActions.Index, RestActions.Create, RestActions.Destroy],
    });

    return this.path;
  }
}
