-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product_on_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "orderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    CONSTRAINT "product_on_orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "product_on_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_product_on_orders" ("id", "orderId", "price", "productId", "quantity") SELECT "id", "orderId", "price", "productId", "quantity" FROM "product_on_orders";
DROP TABLE "product_on_orders";
ALTER TABLE "new_product_on_orders" RENAME TO "product_on_orders";
CREATE TABLE "new_carts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "carts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_carts" ("id", "productId", "quantity", "userId") SELECT "id", "productId", "quantity", "userId" FROM "carts";
DROP TABLE "carts";
ALTER TABLE "new_carts" RENAME TO "carts";
CREATE UNIQUE INDEX "carts_userId_productId_key" ON "carts"("userId", "productId");
CREATE TABLE "new_feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userID" TEXT,
    CONSTRAINT "feedbacks_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_feedbacks" ("content", "id", "productId", "userID") SELECT "content", "id", "productId", "userID" FROM "feedbacks";
DROP TABLE "feedbacks";
ALTER TABLE "new_feedbacks" RENAME TO "feedbacks";
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_no" TEXT NOT NULL,
    "address_1" TEXT NOT NULL,
    "address_2" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "tota_invoicement" DECIMAL NOT NULL DEFAULT 0,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("address_1", "address_2", "city", "country", "createAt", "email", "first_name", "id", "last_name", "mobile_no", "payment", "state", "tota_invoicement", "updateAt", "userId", "zipCode") SELECT "address_1", "address_2", "city", "country", "createAt", "email", "first_name", "id", "last_name", "mobile_no", "payment", "state", "tota_invoicement", "updateAt", "userId", "zipCode" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
