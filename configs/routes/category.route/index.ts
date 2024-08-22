import { CategoryController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";

export class CategoryRoute {
  private static path = Router();
  private static categoryController = new CategoryController();

  public static draw() {
    Route.resource(this.path, this.categoryController, {
      except: [RestActions.Show],
    });

    return this.path;
  }
}
