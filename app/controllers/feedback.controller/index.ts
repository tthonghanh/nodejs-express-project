import { ApplicationController } from "@controllers";
import models from "@models";
import { Request, Response } from "express";

export class FeedbackController extends ApplicationController {
  public async create(req: Request, res: Response) {
    const { content, productId, parentId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      req.flash("error", "You must log-in to leave a feedback");
      res.redirect("/auth");
    }

    await models.feedback.create({
      data: {
        content,
        productId,
        userID: userId,
        parentId,
      },
    });

    req.flash("success", "Leave feedback successfully");
    res.redirect(`/shops/${productId}`);
  }
}
