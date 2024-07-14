import { ProductAdminController } from "@controllers";
import { Router } from "express";
import { Route } from "../..";
import { RestActions } from "../../../enum";

export class ProductAdminRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, ProductAdminController, {
      except: [RestActions.Show]
    });

    return this.path;
  }
}
