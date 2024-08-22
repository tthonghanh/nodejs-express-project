import { FeedbackController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";

export class FeedbackRoute {
  private static path = Router();
  private static feedbackController = new FeedbackController();

  public static draw() {
    Route.resource(this.path, this.feedbackController, {
      only: [RestActions.Create],
    });

    return this.path;
  }
}
