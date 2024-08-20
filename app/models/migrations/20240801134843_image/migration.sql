-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" BLOB,
    "product_name" TEXT NOT NULL,
    "original_price" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "categoryId" TEXT,
    "description" TEXT NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products" ("categoryId", "description", "id", "image", "original_price", "price", "product_name") SELECT "categoryId", "description", "id", "image", "original_price", "price", "product_name" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
