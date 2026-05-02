/*
  Warnings:

  - Added the required column `cargaHoraria` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargo` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailEntrada` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expedicao` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funcao` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicio` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "cargaHoraria" TEXT NOT NULL,
ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "emailEntrada" TEXT NOT NULL,
ADD COLUMN     "emailSaida" TEXT,
ADD COLUMN     "enviado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expedicao" TEXT NOT NULL,
ADD COLUMN     "funcao" TEXT NOT NULL,
ADD COLUMN     "inicio" TEXT NOT NULL;
