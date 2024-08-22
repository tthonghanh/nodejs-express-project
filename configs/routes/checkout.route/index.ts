import { CheckoutController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";

export class CheckoutRoute {
  private static path = Router();
  private static checkoutController = new CheckoutController();

  public static draw() {
    this.path.route("/payment").post(this.checkoutController.checkoutWithVnPay);
    this.path
      .route("/payment/callback")
      .post(this.checkoutController.checkoutRedirect);
    Route.resource(this.path, this.checkoutController, {
      only: [RestActions.Index, RestActions.New, RestActions.Create],
    });

    return this.path;
  }
}
