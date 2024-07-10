import { Request, Response } from "express";
import { ApplicationController } from "../application.controller";

export class ContactController extends ApplicationController {
  public index(req: Request, res: Response) {
    res.render("contact.view/index");
  }
}
