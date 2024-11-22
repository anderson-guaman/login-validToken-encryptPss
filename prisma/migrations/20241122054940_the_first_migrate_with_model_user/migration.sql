-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN_ROLE', 'USER_ROLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "role" "role"[] DEFAULT ARRAY['USER_ROLE']::"role"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
