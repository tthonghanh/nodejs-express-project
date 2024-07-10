import { Router } from "express";
import { RestActions } from "../../enum";
import { Route } from "..";
import { ContactController } from "@controllers";

export class ContactlerRoute {
  private static path = Router();

  public static draw() {
    Route.resource("", this.path, ContactController, { only: [RestActions.Index, RestActions.Show] });

    return this.path;
  }
}