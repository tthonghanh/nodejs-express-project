import { Router } from "express";
import { RestActions } from "../../enum";
import { Route } from "..";
import { DetailController } from "@controllers";

export class DetailRoute {
  private static path = Router();

  public static draw() {
    Route.resource("", this.path, DetailController, { only: [RestActions.Index, RestActions.Show] });

    return this.path;
  }
}