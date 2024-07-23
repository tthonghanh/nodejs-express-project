import { Router } from "express";
import multer from "multer";
import { Route } from "..";
import { ProductAdminController } from "../../../app/controllers";
import { AdminHomeController } from "../../../app/controllers/admin/home.admin.controller";
import { AuthorizationMiddleware } from "../../../app/middlewares/authorization.middleware";
import { RestActions } from "../../enum";
import { CategoryAdminRoute } from "./category.admin.route";
import { ProductAdminRoute } from "./product.admin.route";

export class AdminHomeRoute {
  private static path = Router();

  public static draw() {
    this.path.use("/", new AuthorizationMiddleware().checkAdmin);
    this.path.use("/products", ProductAdminRoute.draw());
    this.path.use("/categories", CategoryAdminRoute.draw());

    Route.resource(this.path, AdminHomeController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
