import { Request, Response } from "express";
import models from "@models";
import { ApplicationController } from "@controllers";

export class CategoryAdminController extends ApplicationController {
  public async new(req: Request, res: Response) {
    res.render("admin/category.admin.view/new");
  }
  public async create(req: Request, res: Response) {
    const { name, imgLink } = req.body;
    await models.category.create({
      data: {
        name,
        imgLink,
      },
    });
    res.redirect("/admin/products");
  }

  public async edit(req: Request, res: Response) {
    const id = req.params.id;
    const category = await models.category.findUnique({
      where: {
        id: id,
      },
    });
    res.render("admin/category.admin.view/edit", {
      id: id,
      category: category,
    });
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
    res.redirect("/admin/products");
  }

  public async destroy(req: Request, res: Response) {
    await models.category.delete({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/admin/products");
  }
}
