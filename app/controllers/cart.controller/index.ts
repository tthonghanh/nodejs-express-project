import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";
import { AuthenticationMiddleware } from "../../middlewares/authentication.middleware";

export class CartController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const currentUser = await ApplicationController.currentUser(req);
    const cartItems = await models.cart.findMany({
      where: {
        userId: currentUser!.id,
      },
      include: {
        product: true,
      },
    });
    res.render("cart.view/index", { cartItems: cartItems });
  }
  public async show(req: Request, res: Response) {
    res.render("cart.view/show");
  }
  public async new(req: Request, res: Response) {
    res.render("cart.view/new");
  }
  public async create(req: Request, res: Response) {
    const { productId } = req.body;
    const userId = req.session.userId;
    if (userId) {
      const isProductInCart = await models.cart.findUnique({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId,
          },
        },
      });
      if (isProductInCart) {
        await models.cart.update({
          where: {
            userId_productId: {
              userId: userId,
              productId: productId,
            },
          },
          data: {
            quantity: isProductInCart.quantity + 1,
          },
        });
      } else {
        await models.cart.create({
          data: {
            userId: userId,
            productId: req.body.productId,
            quantity: 1,
          },
        });
      }
      res.redirect("/shops");
    }
    else  {
      req.flash("error", "You have not logged in yet.")
      res.redirect("/");
    }
  }
  public async edit(req: Request, res: Response) {
    res.render("cart.view/edit");
  }
  public async update(req: Request, res: Response) {}
  public async destroy(req: Request, res: Response) {
    await models.cart.delete({
      where: {
        id: req.params.id,
      },
    });
    req.flash("success", "Product is deleted from cart")
    res.redirect("/carts");
  }
}
