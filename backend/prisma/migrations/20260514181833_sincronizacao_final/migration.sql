-- CreateEnum
CREATE TYPE "Turno" AS ENUM ('MANHA', 'TARDE', 'NOITE');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEG', 'TER', 'QUA', 'QUI', 'SEX');

-- CreateEnum
CREATE TYPE "TipoVinculo" AS ENUM ('PRINCIPAL', 'SUBSTITUTO', 'CARENCIA');

-- CreateEnum
CREATE TYPE "TipoCarencia" AS ENUM ('REAL', 'TEMPORARIA', 'REAL_COBERTA', 'TEMPORARIA_COBERTA');

-- CreateTable
CREATE TABLE "escolas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escolas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" TEXT NOT NULL,
    "escola_id" INTEGER NOT NULL,
    "codigo_turma" TEXT NOT NULL,
    "id_ecidade" INTEGER,
    "turno" "Turno" NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplinas" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome_completo" TEXT,
    "cor_hex" TEXT NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professores" (
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "disciplina_id" TEXT NOT NULL,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("matricula")
);

-- CreateTable
CREATE TABLE "grade_horario" (
    "id" TEXT NOT NULL,
    "turma_id" TEXT NOT NULL,
    "professor_matricula" TEXT,
    "disciplina_id" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "tempo" INTEGER NOT NULL,
    "tipo_vinculo" "TipoVinculo" NOT NULL DEFAULT 'PRINCIPAL',
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grade_horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carencias_docentes" (
    "id" TEXT NOT NULL,
    "escola_id" INTEGER NOT NULL,
    "disciplina" TEXT NOT NULL,
    "turno" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horarioTempo" INTEGER NOT NULL,
    "turma" INTEGER,
    "tipo" "TipoCarencia" NOT NULL DEFAULT 'REAL',
    "professorCobertura" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carencias_docentes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "escolas_nome_key" ON "escolas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "turmas_id_ecidade_key" ON "turmas"("id_ecidade");

-- CreateIndex
CREATE UNIQUE INDEX "disciplinas_sigla_key" ON "disciplinas"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "carencias_docentes_escola_id_disciplina_turno_diaSemana_hor_key" ON "carencias_docentes"("escola_id", "disciplina", "turno", "diaSemana", "horarioTempo");

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_escola_id_fkey" FOREIGN KEY ("escola_id") REFERENCES "escolas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores" ADD CONSTRAINT "professores_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_horario" ADD CONSTRAINT "grade_horario_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_horario" ADD CONSTRAINT "grade_horario_professor_matricula_fkey" FOREIGN KEY ("professor_matricula") REFERENCES "professores"("matricula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_horario" ADD CONSTRAINT "grade_horario_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carencias_docentes" ADD CONSTRAINT "carencias_docentes_escola_id_fkey" FOREIGN KEY ("escola_id") REFERENCES "escolas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
