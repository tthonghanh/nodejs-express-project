import { HomeController } from "@controllers";
import { RestActions } from "@enum";
import { Router } from "express";
import { AdminHomeRoute } from "./admin.route";
import { CartRoute } from "./cart.route";
import { CategoryRoute } from "./category.route";
import { CheckoutRoute } from "./checkout.route";
import { FeedbackRoute } from "./feedback.route";
import { LoginRoute } from "./login.route";
import { ShopRoute } from "./shop.route";
import { UserRoute } from "./user.route";

export class Route {
  private static path = Router();
  private static homeController = new HomeController();

  public static draw() {
    this.path.use("/shops", ShopRoute.draw());
    this.path.use("/users", UserRoute.draw());
    this.path.use("/categories", CategoryRoute.draw());
    this.path.use("/carts", CartRoute.draw());
    this.path.use("/checkouts", CheckoutRoute.draw());
    this.path.use("/auth", LoginRoute.draw());
    this.path.use("/admin", AdminHomeRoute.draw());
    this.path.use("/feedbacks", FeedbackRoute.draw());

    Route.resource(this.path, this.homeController, {
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

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Index))
      path.route("/").get(CustomController.index);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.New))
      path.route(`/new`).get(CustomController.new);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Show))
      path.route(`/:id`).get(CustomController.show);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Create))
      path.route("/").post(CustomController.create);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Edit))
      path.route(`/:id/edit`).get(CustomController.edit);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Update))
      path.route(`/:id`).put(CustomController.update);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Destroy))
      path.route(`/:id`).delete(CustomController.destroy);
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
