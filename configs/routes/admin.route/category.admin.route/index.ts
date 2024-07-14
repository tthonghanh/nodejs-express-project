import { CategoryAdminController } from "@controllers";
import { Router } from "express";
import { Route } from "../..";
import { RestActions } from "../../../enum";

export class CategoryAdminRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, CategoryAdminController, {
      except: [RestActions.Index, RestActions.Show]
    });

    return this.path;
  }
}
