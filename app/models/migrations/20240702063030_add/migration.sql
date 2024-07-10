/*
  Warnings:

  - You are about to drop the column `product_price` on the `products` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_short_name` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "img_link" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_short_name" TEXT NOT NULL,
    "original_price" TEXT NOT NULL,
    "percent" TEXT NOT NULL,
    "feedback" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("feedback", "id", "img_link", "original_price", "percent", "product_name") SELECT "feedback", "id", "img_link", "original_price", "percent", "product_name" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
