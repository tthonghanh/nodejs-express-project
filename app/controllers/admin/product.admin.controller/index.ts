import { Request, Response } from "express";
import models from "../../../models";
import { ApplicationController } from "../../application.controller";

export class ProductAdminController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const products = await models.product.findMany({
      include: {
        category: true,
      },
    });
    const categories = await models.category.findMany();
    res.render("admin/product.admin.view/index", {
      products: products,
      categories: categories,
    });
  }

  public async new(req: Request, res: Response) {
    const categories = await models.category.findMany();
    res.render("admin/product.admin.view/new", { categories: categories });
  }
  public async create(req: Request, res: Response) {
    const {
      productName,
      imgLink,
      categoryId,
      originalPrice,
      price,
      description,
    } = req.body;
    console.log(req.body);

    await models.product.create({
      data: {
        productName,
        imgLink,
        categoryId,
        originalPrice: +originalPrice,
        price: +price,
        description,
      },
    });
    res.redirect("/admin/products");
  }

  public async edit(req: Request, res: Response) {
    const categories = await models.category.findMany();
    const id = req.params.id;
    const product = await models.product.findUnique({
      where: {
        id: id,
      },
    });
    res.render("admin/product.admin.view/edit", {
      id: id,
      product: product,
      categories: categories,
    });
  }

  public async update(req: Request, res: Response) {
    const id = req.params.id;
    const {
      productName,
      imgLink,
      categoryId,
      originalPrice,
      price,
      description,
    } = req.body;
    await models.product.update({
      where: {
        id: id,
      },
      data: {
        productName,
        imgLink,
        categoryId,
        originalPrice: +originalPrice,
        price: +price,
        description,
      },
    });
    res.redirect("/admin/products");
  }

  public async destroy(req: Request, res: Response) {
    await models.product.delete({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/admin/products");
  }
}
