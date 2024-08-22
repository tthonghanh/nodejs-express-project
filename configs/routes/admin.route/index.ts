import { AdminHomeController } from "@controllers";
import { RestActions } from "@enum";
import { Route } from "@routes";
import { Router } from "express";
import { CategoryAdminRoute } from "./category.admin.route";
import { ProductAdminRoute } from "./product.admin.route";

export class AdminHomeRoute {
  private static path = Router();
  private static adminHomeController = new AdminHomeController();

  public static draw() {
    this.path.use(
      "/",
      this.adminHomeController.validateUserLogin,
      this.adminHomeController.validateAdmin
    );
    this.path.use("/products", ProductAdminRoute.draw());
    this.path.use("/categories", CategoryAdminRoute.draw());

    Route.resource(this.path, this.adminHomeController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
