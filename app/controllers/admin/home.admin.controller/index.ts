import { Request, Response } from "express";
import { ApplicationController } from "@controllers";
import models from "@models";

export class AdminHomeController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const orders = await models.order.findMany();
    res.render("admin/home.admin.view/index", { orders: orders });
  }
}
