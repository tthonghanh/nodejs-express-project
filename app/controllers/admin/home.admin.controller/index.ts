import { Request, Response } from "express";
import models from "../../../models";
import { ApplicationController } from "../../application.controller";

export class AdminHomeController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const orders = await models.order.findMany();
    res.render("admin/home.admin.view/index", { orders: orders });
  }
}
