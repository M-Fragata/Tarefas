/*
  Warnings:

  - Added the required column `isMemorando` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "isMemorando" BOOLEAN NOT NULL,
ADD COLUMN     "number" INTEGER;
