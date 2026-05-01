/*
  Warnings:

  - The `description` column on the `taskLogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `status` to the `taskLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_userID_fkey";

-- AlterTable
ALTER TABLE "taskLogs" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "TaskStatus" NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "userID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
