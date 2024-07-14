import { Router } from "express";
import { RestActions } from "../../enum";
import { Route } from "..";
import { CategoryController} from "@controllers";

export class CategoryRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, CategoryController, { except: [RestActions.Show] });

    return this.path;
  }
}