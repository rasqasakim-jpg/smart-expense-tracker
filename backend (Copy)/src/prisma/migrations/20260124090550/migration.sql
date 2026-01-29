/*
  Warnings:

  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - Changed the type of `name` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Wallet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryOption" AS ENUM ('FOOD_AND_DRINK', 'TRANSPORTATION', 'SHOPPING', 'ENTERTAINMENT', 'BILLS', 'HEALTH', 'EDUCATION', 'OTHER_EXPENSE', 'SALARY', 'BONUS', 'INVESTMENT', 'FREELANCE', 'OTHER_INCOME');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('CASH', 'BANK', 'E_WALLET', 'SAVINGS');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "icon",
DROP COLUMN "name",
ADD COLUMN     "name" "CategoryOption" NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "type",
ADD COLUMN     "type" "WalletType" NOT NULL;
