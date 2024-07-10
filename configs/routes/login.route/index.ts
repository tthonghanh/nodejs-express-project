import { Router } from "express";
import { RestActions } from "../../enum";
import { Route } from "..";
import { LoginController } from "@controllers";

export class LoginRoute {
  private static path = Router();

  public static draw() {
    Route.resource("", this.path, LoginController, { only: [RestActions.Index, RestActions.Create] });

    return this.path;
  }
}