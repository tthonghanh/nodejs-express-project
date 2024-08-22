import { CategoryAdminController } from "@controllers";
import { RestActions } from "@enum";
import { Router } from "express";
import { Route } from "../..";

export class CategoryAdminRoute {
  private static path = Router();
  private static categoryAdminController = new CategoryAdminController();

  public static draw() {
    Route.resource(this.path, this.categoryAdminController, {
      except: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }
}
