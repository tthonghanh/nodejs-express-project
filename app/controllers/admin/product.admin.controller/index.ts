import { Request, Response } from "express";
// import fs from "fs";
import fs from "fs-extra";
import multer from "multer";
import models from "../../../models";
import { ApplicationController } from "../../application.controller";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = <any>multer({storage: storage}).single("image");

export class ProductAdminController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const products = await models.product.findMany({
      include: {
        category: true,
      },
    });
    const categories = await models.category.findMany();
    res.render("admin/product.admin.view/index", {
      products: products,
      categories: categories,
    });
  }

  public async new(req: Request, res: Response) {
    const categories = await models.category.findMany();
    res.render("admin/product.admin.view/new", { categories: categories });
  }

  public async create(req: Request, res: Response) {
    upload(req, res, async (err: any) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!req.file) {
        return res.status(400).send("Image file is required.");
      }

    const { productName, categoryId, originalPrice, price, description } = req.body;
    const image = req.file!;

    if (!req.file) {
      return res.status(400).send("Image file is required.");
    }

    // Read image file and convert to base64
    const img = fs.readFileSync(image.path);
    const encode_image = img.toString("base64");
    const finalImg = {
      contentType: image.mimetype,
      image: Buffer.from(encode_image, "base64"),
    };

    // Save product with image
    // await models.product.create({
    //   data: {
    //     productName,
    //     image: finalImg.image,
    //     categoryId,
    //     originalPrice,
    //     price,
    //     description,
    //   },
    // });

    // Optionally delete the uploaded file if no longer needed
    fs.unlinkSync(image.path);

    res.redirect("/admin/products");
    });
  }

  public async edit(req: Request, res: Response) {
    const categories = await models.category.findMany();
    const id = req.params.id;
    const product = await models.product.findUnique({
      where: {
        id: id,
      },
    });
    res.render("admin/product.admin.view/edit", {
      id: id,
      product: product,
      categories: categories,
    });
  }

  public async update(req: Request, res: Response) {
    const id = req.params.id;
    const {
      productName,
      image,
      categoryId,
      originalPrice,
      price,
      description,
    } = req.body;
    await models.product.update({
      where: {
        id: id,
      },
      data: {
        productName,
        image,
        categoryId,
        originalPrice: +originalPrice,
        price: +price,
        description,
      },
    });
    res.redirect("/admin/products");
  }

  public async destroy(req: Request, res: Response) {
    await models.product.delete({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/admin/products");
  }
}
