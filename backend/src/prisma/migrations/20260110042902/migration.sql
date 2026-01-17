/*
  Warnings:

  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(19,2)`.
  - Added the required column `name` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,2);
