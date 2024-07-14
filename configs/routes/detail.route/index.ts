import { DetailController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class DetailRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, DetailController, {
      only: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }
}
