import { Request, Response } from "express";
import md5 from "md5";
import models from "../../models";
import { ApplicationController } from "../application.controller";
import { use } from "passport";
import { EmailOption, sendMail } from "@mail";
import axios from "axios";
import { google } from "googleapis";

export class UserController extends ApplicationController {
  public async new(req: Request, res: Response) {
    res.render("user.view/new", { messages: req.flash() });
  }

  public async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const { code } = req.query;

    if (!name || !email || !password) {
      req.flash("error", "Name, Email and Password are required.");

      return res.redirect("/users/new");
    } else if (name.length < 6 || password.length < 6) {
      if (name.length < 6) {
        req.flash("error", "Length of name must be more than 6 letters");
      }
      if (password.length < 6) {
        req.flash("error", "Length of password must be more than 6 letters");
      }

      return res.redirect("/users/new");
    }

    const user = await models.user.create({
      data: {
        name,
        email,
        role: 1,
        passwords: {
          create: {
            password: md5(password),
          },
        },
      },
    });

    const createdUserEmail = email;

    const options: EmailOption = {
      to: createdUserEmail,
      subject: 'CREATED USER FROM QLBH',
      html: "welcome to store"
    };

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    await sendMail(options, { req, res }, String(accessToken));
  }
}
