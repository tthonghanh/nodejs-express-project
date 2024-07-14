import { Router } from "express";
import { Route } from "..";
import { ShopController } from "../../../app/controllers";
import { RestActions } from "../../enum";

export class ShopRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, ShopController, {
      only: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }
}
