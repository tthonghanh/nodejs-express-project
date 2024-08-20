import { ProductAdminController } from "@controllers";
import { Router } from "express";
import multer from "multer";
import { Route } from "../..";
import { RestActions } from "../../../enum";

const upload = multer({ dest: "uploads/" });

export class ProductAdminRoute {
  private static path = Router();

  public static draw() {
    this.path.post(
      "/",
      upload.single("image"),
      new ProductAdminController().create
    );
    Route.resource(this.path, ProductAdminController, {
      except: [RestActions.Show],
    });

    return this.path;
  }
}
