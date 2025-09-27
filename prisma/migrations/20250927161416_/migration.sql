/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "phone" VARCHAR(16) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phone_key" ON "public"."Profile"("phone");
