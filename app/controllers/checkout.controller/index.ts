import { Request, Response } from "express";
import models from "../../models";
import { ApplicationController } from "../application.controller";
// import dateFormat from "dateformat"
import crypto from "crypto"
import querystring from "qs"
import sortObject from "sortobject"

const VNPAY_TMNCODE = process.env.VNPAY_TMNCODE;
const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET;
const VNPAY_RETURN_URL = process.env.VNPAY_RETURN_URL;
const VNPAY_URL = process.env.VNPAY_URL!;

function dateFormat(date: Date, format: string): string {
  const map: { [key: string]: string } = {
      yyyy: date.getFullYear().toString(),
      MM: ('0' + (date.getMonth() + 1)).slice(-2),
      dd: ('0' + date.getDate()).slice(-2),
      HH: ('0' + date.getHours()).slice(-2),
      mm: ('0' + date.getMinutes()).slice(-2),
      ss: ('0' + date.getSeconds()).slice(-2),
  };

  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (matched) => map[matched]);
}

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

  public async checkoutWithVnPay(req: Request, res: Response) {
    // const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipAddr = "localhost:3000"
    const date = new Date();
    const createDate = dateFormat(date, 'yyyyMMddHHmmss');
    const orderId = dateFormat(date, 'HHmmss');
    const amount = req.body.totalInvoicement;
    const bankCode = req.body.payment;
    const orderInfo = `Thanh toan don hang thoi gian: ${createDate}`;
    const orderType = "200000";
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_url = VNPAY_URL;


    let vnp_Params = {
      'vnp_Version': '2.1.0',
      'vnp_Command': 'pay',
      'vnp_TmnCode': VNPAY_TMNCODE,
      'vnp_Locale': locale,
      'vnp_CurrCode': currCode,
      'vnp_TxnRef': orderId,
      'vnp_OrderInfo': orderInfo,
      'vnp_OrderType': orderType,
      'vnp_Amount': amount * 1000,
      'vnp_ReturnUrl': VNPAY_RETURN_URL,
      'vnp_IpAddr': ipAddr,
      'vnp_CreateDate': createDate,
      'vnp_BankCode': bankCode,
      'vnp_SecureHash': '',
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    
    const signed = crypto.createHmac("sha512", VNPAY_HASH_SECRET!)
                        .update(new Buffer(signData, 'utf-8'))
                        .digest("hex");
    vnp_Params.vnp_SecureHash = signed;
    vnp_url += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnp_url);
  }

  public async checkoutRedirect(req: Request, res: Response) {
    res.redirect("/");
  }
}
