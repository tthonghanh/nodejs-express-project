import { Request, Response } from "express";
import { ApplicationController } from "../application.controller";
import models from "../../models";

export class DetailController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const products = await models.product.findMany();
    const feedbacks = await models.feedback.findMany();
    res.render("detail.view/index", {
      products: products,
      feedbacks: feedbacks,
    });
  }
  public async show(req: Request, res: Response) {
    const product = await models.product.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.render("detail.view/show", { product: product });
  }
}
