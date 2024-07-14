import { LoginController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class LoginRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, LoginController, {
      only: [RestActions.Index, RestActions.Create, RestActions.Destroy],
    });

    return this.path;
  }
}
