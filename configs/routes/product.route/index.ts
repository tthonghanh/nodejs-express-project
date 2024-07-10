import { ProductController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class ProductRoute {
  private static path = Router();

  public static draw() {
    Route.resource("", this.path, ProductController);

    return this.path;
  }
}
