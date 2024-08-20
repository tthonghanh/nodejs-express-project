import { Router } from "express";
import { Route } from "..";
import { FeedbackController, ShopController } from "../../../app/controllers";
import { RestActions } from "../../enum";

export class FeedbackRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, FeedbackController, {
      only: [RestActions.Create],
    });

    return this.path;
  }
}
