import { ApplicationController } from "@controllers";
import models from "@models";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export class HomeController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const user = req.session.userId;
    const categories = await models.category.findMany();
    res.render("home.view/index", { user: user, categories: categories });
  }

  public async show(req: Request, res: Response) {
    // req: noi dung nguoi dung gui len tu client
    // const user = await models.user.findUnique({
    //   where: {
    //     id: req.params.id
    //   }
    // })

    const users: { id: string; userName: string }[] = await models.$queryRaw(
      Prisma.sql`SELECT id, name AS "userName" FROM users WHERE id = ${req.params.id};`
    );
    const user = users.length ? users[0] : undefined;
    res.render("home.view/show", { user: user }); // noi dung tra ve cho browser
  }
}
