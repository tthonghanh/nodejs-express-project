import { HomeController, LoginController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class LoginRoute {
  private static path = Router();
  private static loginController = new LoginController();

  public static draw() {
    this.path.route("/google").get(this.loginController.loginWithGoogle);
    this.path.route("/google/callback").get(this.loginController.loginRedirect);
    this.path.route("/facebook").get(this.loginController.loginWithFacebook);
    Route.resource(this.path, LoginController, {
      only: [RestActions.Index, RestActions.Create, RestActions.Destroy],
    });

    return this.path;
  }
}
