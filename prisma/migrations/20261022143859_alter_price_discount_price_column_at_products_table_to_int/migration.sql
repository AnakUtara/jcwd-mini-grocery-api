/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `discount_price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_price" SET DATA TYPE INTEGER;
