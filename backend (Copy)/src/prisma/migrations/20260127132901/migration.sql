/*
  Warnings:

  - The values [DIVORCED] on the enum `RelationshipStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationshipStatus_new" AS ENUM ('SINGLE', 'IN_RELATIONSHIP', 'MARRIED', 'MARRIED_WITH_KIDS', 'WIDOWED', 'WIDOWED_WITH_KIDS');
ALTER TABLE "public"."Profile" ALTER COLUMN "relationship" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "relationship" TYPE "RelationshipStatus_new" USING ("relationship"::text::"RelationshipStatus_new");
ALTER TYPE "RelationshipStatus" RENAME TO "RelationshipStatus_old";
ALTER TYPE "RelationshipStatus_new" RENAME TO "RelationshipStatus";
DROP TYPE "public"."RelationshipStatus_old";
ALTER TABLE "Profile" ALTER COLUMN "relationship" SET DEFAULT 'SINGLE';
COMMIT;
