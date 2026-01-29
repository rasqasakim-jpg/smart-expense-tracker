-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('SINGLE', 'IN_RELATIONSHIP', 'MARRIED', 'MARRIED_WITH_KIDS', 'DIVORCED', 'WIDOWED');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "relationship" "RelationshipStatus" NOT NULL DEFAULT 'SINGLE';
