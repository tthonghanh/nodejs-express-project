import { CheckoutController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class CheckoutRoute {
  private static path = Router();
  private static checkoutController = new CheckoutController();

  public static draw() {
    this.path.route("/payment").post(this.checkoutController.checkoutWithVnPay);
    this.path.route("/payment/callback").post(this.checkoutController.checkoutRedirect);
    Route.resource(this.path, CheckoutController, {
      only: [RestActions.Index, RestActions.New, RestActions.Create],
    });

    return this.path;
  }
}
