-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('Baixa', 'Media', 'Alta');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pendente', 'Andamento', 'Concluida');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "teamID" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'Pendente',
    "priority" "TaskPriority" NOT NULL,
    "userID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskLogs" (
    "id" TEXT NOT NULL,
    "description" "TaskStatus" NOT NULL,
    "taskID" TEXT NOT NULL,

    CONSTRAINT "taskLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskLogs" ADD CONSTRAINT "taskLogs_taskID_fkey" FOREIGN KEY ("taskID") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
