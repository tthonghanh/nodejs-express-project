import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";

export class CheckoutController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const userId = req.session.userId;
    if (userId) {
      const orders = await models.order.findMany({
        where: {
          userId: userId,
        },
      });
      res.render("checkout.view/index", { orders: orders });
    } else {
      req.flash("error", "You have not logged in yet.");
      res.redirect("/");
    }
  }
  public async new(req: Request, res: Response) {
    const cartItems = await models.cart.findMany({
      include: {
        product: true,
      },
    });
    res.render("checkout.view/new", { cartItems: cartItems });
  }
  public async create(req: Request, res: Response) {
    const userId = req.session.userId;
    if (userId) {
      const cart = await models.cart.findMany({
        include: {
          product: true,
        },
      });
      const {
        firstName,
        lastName,
        email,
        mobileNo,
        address1,
        address2,
        country,
        city,
        state,
        zipCode,
        totalInvoicement,
        payment,
      } = req.body;

      const newOrder = await models.order.create({
        data: {
          firstName,
          lastName,
          email,
          mobileNo,
          address1,
          address2,
          country,
          city,
          state,
          zipCode,
          totalInvoicement: +totalInvoicement,
          payment,
          userId: userId,
        },
      });
      for (let i = 0; i < cart.length; i++) {
        await models.productOnOrder.create({
          data: {
            productId: cart[i].productId,
            orderId: newOrder.id,
            quantity: cart[i].quantity,
            price: cart[i].product.price,
          },
        });
      }
      await models.cart.deleteMany({
        where: { userId: userId },
      });

      res.redirect("/checkouts");
    } else {
      req.flash("error", "You have not logged in yet.");
      res.redirect("/");
    }
  }
}
