import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";

export class CategoryController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const categories = await models.category.findMany();
    res.render("category.view/index", { categories: categories });
  }

  public async new(req: Request, res: Response) {
    res.render("category.view/new");
  }

  public async create(req: Request, res: Response) {
    const { name, imgLink } = req.body;
    await models.category.create({
      data: {
        name,
        imgLink,
      },
    });
    res.redirect("/categories");
  }

  public async edit(req: Request, res: Response) {
    const id = req.params.id;
    const category = await models.category.findUnique({
      where: {
        id: id,
      },
    });
    res.render("category.view/edit", { id: id, category: category });
  }

  public async update(req: Request, res: Response) {
    const id = req.params.id;
    const { name, imgLink } = req.body;
    await models.category.update({
      where: {
        id: id,
      },
      data: {
        name,
        imgLink,
      },
    });
    res.redirect("/categories");
  }

  public async destroy(req: Request, res: Response) {
    await models.category.delete({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/categories");
  }
}
