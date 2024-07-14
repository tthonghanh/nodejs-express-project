import { UserController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class UserRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, UserController, {
      only: [RestActions.New, RestActions.Create],
    });

    return this.path;
  }
}
