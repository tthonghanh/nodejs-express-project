import { HomeController } from "@controllers";
import { Router } from "express";
import { RestActions } from "../enum";
import { AdminHomeRoute } from "./admin.route";
import { CartRoute } from "./cart.route";
import { CategoryRoute } from "./category.route";
import { CheckoutRoute } from "./checkout.route";
import { LoginRoute } from "./login.route";
import { ShopRoute } from "./shop.route";
import { UserRoute } from "./user.route";

export class Route {
  private static path = Router();

  public static draw() {
    this.path.use("/shops", ShopRoute.draw());
    this.path.use("/users", UserRoute.draw());
    this.path.use("/categories", CategoryRoute.draw());
    this.path.use("/carts", CartRoute.draw());
    this.path.use("/checkouts", CheckoutRoute.draw());
    this.path.use("/auth", LoginRoute.draw());
    this.path.use("/admin", AdminHomeRoute.draw());

    Route.resource(this.path, HomeController, {
      only: [RestActions.Index, RestActions.Show],
    });

    return this.path;
  }

  public static resource(
    path: Router,
    CustomController: any,
    filter?: {
      only?: RestActions[];
      except?: RestActions[];
    }
  ) {
    if (filter?.only && filter?.except) {
      throw new Error("Can only pass only or except!");
    }

    const action = new CustomController();

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Index))
      path.route("/").get(action.index);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.New))
      path.route(`/new`).get(action.new);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Show))
      path.route(`/:id`).get(action.show);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Create))
      path.route("/").post(action.create);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Edit))
      path.route(`/:id/edit`).get(action.edit);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Update))
      path.route(`/:id`).put(action.update);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Destroy))
      path.route(`/:id`).delete(action.destroy);
  }

  private static isAllowAccess(
    only: RestActions[] | undefined,
    except: RestActions[] | undefined,
    action: RestActions
  ) {
    return (
      (!only && !except) ||
      (only && only?.includes(action)) ||
      (except && !except?.includes(action))
    );
  }
}
