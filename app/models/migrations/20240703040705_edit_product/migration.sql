/*
  Warnings:

  - You are about to drop the column `percent` on the `products` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "img_link" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_short_name" TEXT NOT NULL,
    "original_price" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "feedback" INTEGER NOT NULL,
    "categoryId" TEXT,
    "description" TEXT NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products" ("categoryId", "description", "feedback", "id", "img_link", "original_price", "price", "product_name", "product_short_name") SELECT "categoryId", "description", "feedback", "id", "img_link", "original_price", "price", "product_name", "product_short_name" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
