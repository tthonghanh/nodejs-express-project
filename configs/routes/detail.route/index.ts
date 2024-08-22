import { DetailController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";

export class DetailRoute {
  private static path = Router();
  private static detailController = new DetailController();

  public static draw() {
    Route.resource(this.path, this.detailController, {
      only: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }
}
