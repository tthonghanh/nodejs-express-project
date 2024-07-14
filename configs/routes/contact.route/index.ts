import { ContactController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class ContactlerRoute {
  private static path = Router();

  public static draw() {
    Route.resource(this.path, ContactController, {
      only: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }
}
