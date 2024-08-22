import { ProductAdminController } from "@controllers";
import { RestActions } from "@enum";
import { Router } from "express";
import multer from "multer";
import { Route } from "../..";

const upload = multer({ dest: "uploads/" });

export class ProductAdminRoute {
  private static path = Router();
  private static productAdminController = new ProductAdminController();

  public static draw() {
    this.path.post(
      "/",
      upload.single("image"),
      this.productAdminController.create
    );
    Route.resource(this.path, this.productAdminController, {
      except: [RestActions.Show],
    });

    return this.path;
  }
}
