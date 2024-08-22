import { ApplicationController } from "@controllers";
import { Request, Response } from "express";

export class ContactController extends ApplicationController {
  public index(req: Request, res: Response) {
    res.render("contact.view/index");
  }
}
