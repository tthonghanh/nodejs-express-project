import { ContactController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";

export class ContactlerRoute {
  private static path = Router();
  private static contactController = new ContactController();

  public static draw() {
    Route.resource(this.path, this.contactController, {
      only: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }
}
