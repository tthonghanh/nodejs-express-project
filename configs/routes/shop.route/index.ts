import { Router } from "express";
import { RestActions } from "../../enum";
import { Route } from "..";
import { ShopController } from "../../../app/controllers";

export class ShopRoute {
  private static path = Router();

  public static draw() {
    Route.resource("", this.path, ShopController, { only: [RestActions.Index, RestActions.Show] });

    return this.path;
  }
}