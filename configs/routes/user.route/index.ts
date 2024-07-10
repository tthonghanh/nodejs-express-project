import { Router } from "express";
import { RestActions } from "../../enum";
import { Route } from "..";
import { UserController} from "@controllers";

export class UserRoute {
  private static path = Router();

  public static draw() {
    Route.resource("", this.path, UserController, { only: [RestActions.New, RestActions.Create] });

    return this.path;
  }
}