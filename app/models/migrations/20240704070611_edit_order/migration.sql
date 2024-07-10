-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("address_1", "address_2", "city", "country", "createAt", "email", "first_name", "id", "last_name", "mobile_no", "payment", "state", "updateAt", "userId", "zipCode") SELECT "address_1", "address_2", "city", "country", "createAt", "email", "first_name", "id", "last_name", "mobile_no", "payment", "state", "updateAt", "userId", "zipCode" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
