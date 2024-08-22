import { UserController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";

export class UserRoute {
  private static path = Router();
  private static userController = new UserController();

  public static draw() {
    Route.resource(this.path, this.userController, {
      only: [RestActions.New, RestActions.Create],
    });

    return this.path;
  }
}
