/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `Price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `catgoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - Added the required column `feedback` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_link` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percent` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "img_link" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    CONSTRAINT "feedbacks_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "img_link" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_price" TEXT NOT NULL,
    "original_price" TEXT NOT NULL,
    "percent" TEXT NOT NULL,
    "feedback" INTEGER NOT NULL
);
INSERT INTO "new_products" ("id") SELECT "id" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
