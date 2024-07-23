import axios from "axios";
import { Request, Response } from "express";
import md5 from "md5";
import models from "../../models";
import { ApplicationController } from "@controllers";
import { UserRoleEnum } from "@models/enums";
// import passport from 'passport'
// import passportfacebook from 'passport-facebook'


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export class LoginController extends ApplicationController {
  public async index(req: Request, res: Response) {
    res.render("login.view/index");
  }

  public async create(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await models.user.findUnique({
      where: {
        email: email,
        passwords: {
          some: {
            password: md5(password),
            deleteAt: null,
          },
        },
      },
    });

    if (!user) {
      req.flash("error", "Email or password is invalid");
      return res.redirect("/auth");
    }

    req.session.userId = user.id;
    req.flash("success", "Login successfully");
    if (user.role == 0) return res.redirect("/admin");
    return res.redirect("/");
  }

  public async destroy(req: Request, res: Response) {
    req.session.destroy((err: Error) => {
      if (err) console.log(err);
      else {
        res.redirect("/");
      }
    });
  }

  public async loginWithGoogle(req: Request, res: Response) {
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`
    );
  }

  public async loginRedirect(req: Request, res: Response) {
    const { code } = req.query;
    const {
      data: { access_token },
    } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { data: user } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const loginUser = await models.user.findUnique({
      where: {
        email: user.email
      }
    })

    if (!loginUser) {
      const newUser = await models.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: UserRoleEnum.USER
        }
      })
      req.session.userId = newUser.id;
    }
    else req.session.user = loginUser.id;
    req.flash("success", "Login successfully");

    res.redirect("/");
  }

  public async loginWithFacebook(req: Request, res: Response) {

  }
}
