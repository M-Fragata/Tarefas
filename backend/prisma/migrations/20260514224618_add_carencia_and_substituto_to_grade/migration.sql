/*
  Warnings:

  - A unique constraint covering the columns `[turma_id,dia_semana,tempo]` on the table `grade_horario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `escola_id` to the `grade_horario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "grade_horario" ADD COLUMN     "escola_id" INTEGER NOT NULL,
ADD COLUMN     "substituto_matricula" TEXT,
ADD COLUMN     "tipo_carencia" "TipoCarencia";

-- CreateIndex
CREATE UNIQUE INDEX "grade_horario_turma_id_dia_semana_tempo_key" ON "grade_horario"("turma_id", "dia_semana", "tempo");

-- AddForeignKey
ALTER TABLE "grade_horario" ADD CONSTRAINT "grade_horario_escola_id_fkey" FOREIGN KEY ("escola_id") REFERENCES "escolas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_horario" ADD CONSTRAINT "grade_horario_substituto_matricula_fkey" FOREIGN KEY ("substituto_matricula") REFERENCES "professores"("matricula") ON DELETE SET NULL ON UPDATE CASCADE;
