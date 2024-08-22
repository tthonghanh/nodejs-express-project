import { ApplicationController } from "@controllers";
import models from "@models";
import { UserRoleEnum } from "@models/enums";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import md5 from "md5";
import env from "@env"

const CLIENT_ID = env.googleClientId;
const CLIENT_SECRET = env.googleClientSecret;
const REDIRECT_URI = env.googleRedirectUri;

const FACEBOOK_CLIENT_ID = env.facebookClientId;
const FACEBOOK_CLIENT_SECRET = env.facebookClientSecret;
const FACEBOOK_REDIRECT_URI = env.facebookRedirectUri;

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

  public async destroy(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((err: Error) => {
        if (err) console.log(err);
        else {
          res.redirect("https://accounts.google.com/logout");
        }
      });
    });

    // req.logout(function(err) {
    //   if (err) { return next(err); }
    //   res.redirect('');
    // });
  }

  public async loginWithGoogle(req: Request, res: Response) {
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`
    );
  }

  public async loginRedirectGooGle(req: Request, res: Response) {
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
        email: user.email,
      },
    });

    if (!loginUser) {
      const newUser = await models.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: UserRoleEnum.USER,
        },
      });
      req.session.userId = newUser.id;
    } else req.session.userId = loginUser.id;

    req.flash("success", "Login successfully");

    res.redirect("/");
  }

  public async loginWithFacebook(req: Request, res: Response) {
    res.redirect(
      `https://www.facebook.com/v13.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email`
    );
  }

  public async loginRedirectFacebook(req: Request, res: Response) {
    const { code } = req.query;
    const { data } = await axios({
      url: "https://graph.facebook.com/v4.0/oauth/access_token",
      method: "get",
      params: {
        client_id: FACEBOOK_CLIENT_ID,
        client_secret: FACEBOOK_CLIENT_SECRET,
        redirect_uri: FACEBOOK_REDIRECT_URI,
        code,
      },
    });
    const { data: user } = await axios({
      url: "https://graph.facebook.com/me",
      method: "get",
      params: {
        fields: ["id", "email", "name", "picture{url}"].join(","),
        access_token: data.access_token,
      },
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    const loginUser = await models.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!loginUser) {
      const newUser = await models.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: UserRoleEnum.USER,
        },
      });
      req.session.userId = newUser.id;
    } else req.session.userId = loginUser.id;

    req.flash("success", "Login successfully");
    res.redirect("/");
  }

  public async logoutFacebook(req: Request, res: Response) {}
}
