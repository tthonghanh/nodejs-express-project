import { Request, Response } from "express";
import { google } from "googleapis";
import { createTransport } from "nodemailer";
import env from "@env"

export type EmailOption = {
  from?: string; // email nguồn
  to: string | string[]; // email nhận (1 hoặc nhiều email)
  subject: string; // tiêu đề email
  text?: string; // option 1: chỉ gửi mỗi nội dung là chữ cái
  html?: string; // option 2: gửi nội dung email có chứa giao diện bằng html/css
};

export const sendMail = (
  options: EmailOption,
  httpInfo: { req: Request; res: Response },
  accessToken: string
) => {
  const { req, res } = httpInfo;
  
  const mailOption = {
    ...options,
    from: options.from || env.emailName, //override field from
  };

  const transporter = createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: env.emailName,
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      refreshToken: env.refreshToken,
      accessToken,
    },
  });

  transporter.sendMail(mailOption, (err: Error | null, info: any) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/");
      return;
    } else {
      req.flash("success", "Register successfully");
      res.redirect("/");
      return;
    }
  });
};
