/*
  Warnings:

  - Added the required column `email` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "payload" JSONB,
ALTER COLUMN "user_id" DROP NOT NULL;
