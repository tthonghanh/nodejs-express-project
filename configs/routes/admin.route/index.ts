import { Router } from "express";
import { Route } from "..";
import { AdminHomeController } from "../../../app/controllers/admin/home.admin.controller";
import { RestActions } from "../../enum";
import { ProductAdminRoute } from "./product.admin.route";
import { CategoryAdminRoute } from "./category.admin.route";
import { AuthorizationMiddleware } from "../../../app/middlewares/authorization.middleware";

export class AdminHomeRoute {
  private static path = Router();

  public static draw() {
    this.path.use("/", (new AuthorizationMiddleware()).checkAdmin);
    this.path.use("/products", ProductAdminRoute.draw());
    this.path.use("/categories", CategoryAdminRoute.draw());

    Route.resource(this.path, AdminHomeController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
