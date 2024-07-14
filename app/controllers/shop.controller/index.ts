import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";

export class ShopController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const products = await models.product.findMany();
    res.render("shop.view/index", { products: products });
  }
  public show(req: Request, res: Response) {
    const productId = req.params.id;
    const productDetail = models.product.findUnique({
      where: {
        id: productId,
      },
    });
    res.render("shop.view/show", { productDetail: productDetail });
  }
}
