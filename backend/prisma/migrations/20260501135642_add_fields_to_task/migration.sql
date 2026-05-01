/*
  Warnings:

  - You are about to drop the column `title` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `entrada` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matricula` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servidor` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "taskType" AS ENUM ('Movimentacao', 'Admissao');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "title",
ADD COLUMN     "entrada" TEXT NOT NULL,
ADD COLUMN     "matricula" INTEGER NOT NULL,
ADD COLUMN     "saida" TEXT,
ADD COLUMN     "servidor" TEXT NOT NULL,
ADD COLUMN     "tipo" "taskType" NOT NULL;
