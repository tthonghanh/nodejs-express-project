import { ShopController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";

export class ShopRoute {
  private static path = Router();
  private static shopController = new ShopController();

  public static draw() {
    Route.resource(this.path, this.shopController, {
      only: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }
}
