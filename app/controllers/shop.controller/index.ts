import { ApplicationController } from "@controllers";
import models from "@models";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Request, Response } from "express";

export class ShopController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const pageNumber: number = Number(req.query.pageNumber) || 1;
    const pageSize: number = 10;
    const searchTerm: string = req.query.searchTerm
      ? String(req.query.searchTerm)
      : "";

    const [totalRecords, products] = await Promise.all([
      models.product.count({
        where: {
          productName: {
            contains: searchTerm,
          },
        },
      }),
      models.product.findMany({
        where: {
          productName: {
            contains: searchTerm,
          },
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const numberOfPages = Math.ceil(totalRecords / pageSize);

    const url = "/shops?";

    res.render("shop.view/index", {
      products: products,
      numberOfPages: numberOfPages,
      pageNumber: pageNumber,
      url: url,
    });
  }
  public async show(req: Request, res: Response) {
    const productId = req.params.id;
    // const [productDetail, totalFeedbacks] = await Promise.all([
    //   models.product.findUnique({
    //     where: {
    //       id: productId,
    //     },
    //     include: {
    //       feedbacks: {
    //         include: {
    //           user: true,
    //         }
    //       }
    //     }
    //   }),

    //   models.feedback.count({
    //     where: {
    //       productId: productId
    //     }
    //   })
    // ])

    const productDetails: {
      id: string;
      productName: string;
      price: Decimal;
      description: string;
    }[] = await models.$queryRaw(Prisma.sql`
      SELECT
        p.id,
        p.product_name AS productName,
        p.price,
        p.description
      FROM products p
      WHERE p.id = ${productId}`);

    const productDetail = productDetails.length ? productDetails[0] : undefined;

    const productFeedbacks: {
      id: string;
      parentId: string;
      content: string;
      productId: string;
      userName: string;
      level: number;
      summaryId: string;
    }[] = await models.$queryRaw(Prisma.sql`
      WITH RECURSIVE feedbacks_hierachy AS (
        SELECT
          id,
          parentId,
          content,
          userID,
          productId,
          0 AS level,
          CAST(createAt AS TEXT) AS summaryCreatedDate
        FROM feedbacks
        WHERE parentId IS NULL
        UNION ALL
        SELECT
          f.id,
          f.parentId,
          f.content,
          f.userID,
          f.productId,
          (level + 1) AS level,
          fh.summaryCreatedDate || ' ' || CAST(f.createAt AS TEXT) AS summaryId
        FROM feedbacks f
        INNER JOIN feedbacks_hierachy fh ON fh.id = f.parentId
      )

      SELECT
        fh.id,
        fh.parentId,
        fh.content,
        fh.productId,
        u.name,
        fh.level,
        fh.summaryCreatedDate
      FROM feedbacks_hierachy fh
      LEFT JOIN users u ON u.id = fh.userId
      WHERE fh.productId = ${productId}
      ORDER BY fh.summaryCreatedDate
    `);

    const totalFeedbacks = await models.feedback.count({
      where: {
        productId: productId,
      },
    });
    res.render("shop.view/show", {
      productDetail: productDetail,
      totalFeedbacks: totalFeedbacks,
      productFeedbacks: productFeedbacks,
    });
  }
}
