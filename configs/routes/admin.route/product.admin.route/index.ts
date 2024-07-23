import { ProductAdminController } from "@controllers";
import express, { Express, Router } from "express";
import multer from "multer";
import { Route } from "../..";
import { RestActions } from "../../../enum";
import fs from 'fs'

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

const upload = multer({ dest: 'uploads/' });

export class ProductAdminRoute {
  private static path = Router();

  public static draw() {
    this.path.post('/', upload.single('image'), (new ProductAdminController()).create);
    Route.resource(this.path, ProductAdminController, {
      except: [RestActions.Show],
    });

    return this.path;
  }
}
