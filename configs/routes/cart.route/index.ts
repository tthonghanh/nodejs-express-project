import { CartController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { AuthenticationMiddleware } from "../../../app/middlewares/authentication.middleware";

export class CartRoute {
  private static path = Router();

  public static draw() {
    this.path.use("/", (new AuthenticationMiddleware()).checkLogin);
    Route.resource(this.path, CartController);

    return this.path;
  }
}
