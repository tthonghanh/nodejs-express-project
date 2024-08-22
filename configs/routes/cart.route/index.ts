import { CartController } from "@controllers";
import { Router } from "express";
import { Route } from "@routes";
import { AuthenticationMiddleware } from "../../../app/middlewares/authentication.middleware";

export class CartRoute {
  private static path = Router();
  private static cartController = new CartController();

  public static draw() {
    this.path.use("/", this.cartController.validateUserLogin);
    Route.resource(this.path, this.cartController);

    return this.path;
  }
}
