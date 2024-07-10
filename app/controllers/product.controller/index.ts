import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";

export class ProductController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const categories = await models.category.findMany();
    const products = await models.product.findMany();
    res.render("product.view/index", {
      categories: categories,
      products: products,
    });
  }

  public async show(req: Request, res: Response) {
    const product = await models.product.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.render("product.view/show", { product: product });
  }

  public async new(req: Request, res: Response) {
    const categories = await models.category.findMany();
    res.render("product.view/new", { categories: categories });
  }

  public async create(req: Request, res: Response) {
    const {
      productName,
      imgLink,
      categoryId,
      originalPrice,
      price,
      description,
      feedback,
    } = req.body;
    await models.product.create({
      data: {
        productName,
        imgLink,
        categoryId,
        originalPrice: +originalPrice,
        price: +price,
        description,
        feedback: +feedback,
      },
    });
    res.redirect("/products");
  }

  public async edit(req: Request, res: Response) {
    const categories = await models.category.findMany();
    const id = req.params.id;
    const product = await models.product.findUnique({
      where: {
        id: id,
      },
    });
    res.render("product.view/edit", {
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
      feedback,
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
        feedback: +feedback,
      },
    });
    res.redirect("/products");
  }

  public async destroy(req: Request, res: Response) {
    await models.product.delete({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/products");
  }
}
