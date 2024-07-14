import { Request, Response } from "express";
import { ApplicationController } from "../application.controller";
import models from "../../models";

export class HomeController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const user = req.session.userId;
    const categories = await models.category.findMany();
    res.render("home.view/index", {user: user, categories: categories});
  }

  public async show(req: Request, res: Response) { // req: noi dung nguoi dung gui len tu client
    const user = await models.user.findUnique({
      where: {
        id: req.params.id
      }
    })
    res.render("home.view/show", {user : user}); // noi dung tra ve cho browser
  }
}
