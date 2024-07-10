import { Router } from "express";
import { RestActions } from "../../enum";
import { Route } from "..";
import { CartController } from "@controllers";

export class CartRoute {
  private static path = Router();

  public static draw() {
    Route.resource("", this.path, CartController);

    return this.path;
  }
}