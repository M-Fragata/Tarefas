/*
  Warnings:

  - Changed the type of `tipo` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('Movimentacao', 'Admissao');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TaskType" NOT NULL;

-- DropEnum
DROP TYPE "taskType";
