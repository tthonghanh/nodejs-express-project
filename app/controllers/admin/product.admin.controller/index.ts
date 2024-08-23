import { Request, Response } from "express";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import fs from "fs-extra";
import { getUploadedImageUrl, storage, } from "@fileUpload";
import models from "@models";
import { ApplicationController } from "@controllers";

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
    const { productName, categoryId, originalPrice, price, description } =
      req.body;
    const image = req.file!;

    if (!req.file) {
      return res.status(400).send("Image file is required.");
    }

    // const storageRef = ref(storage, "images");

    // const metadata = {
    //   contentType: "image/jpeg",
    // };

    // // Read image file and convert to base64
    // const img = fs.readFileSync(image.path);
    // const encodeImage = img.toString("base64");
    // // const finalImg = {
    // //   contentType: image.mimetype,
    // //   image: Buffer.from(encode_image, "base64"),
    // // };

    // const uploadTask = await uploadString(
    //   storageRef,
    //   encodeImage,
    //   "base64",
    //   metadata
    // );

    const imageUrl = await getUploadedImageUrl(image.path, 'images');

    // Save product with image
    await models.product.create({
      data: {
        productName,
        image: imageUrl,
        categoryId,
        originalPrice,
        price,
        description,
      },
    });

    res.redirect("/admin/products");
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
