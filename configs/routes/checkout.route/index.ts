import { CheckoutController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class CheckoutRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, CheckoutController, {
      only: [RestActions.Index, RestActions.New, RestActions.Create],
    });

    return this.path;
  }
}
