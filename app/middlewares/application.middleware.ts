import models from "@models";
import { User } from "@prisma/client";
import { Request } from "express";

export class ApplicationMiddleware {
  public static async currentUser(req: Request): Promise<User | null> {
    const userId = req.session.userId;
    if (!userId) return null;

    const user = await models.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }
}
