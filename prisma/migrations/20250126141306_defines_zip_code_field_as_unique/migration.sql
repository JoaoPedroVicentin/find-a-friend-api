/*
  Warnings:

  - A unique constraint covering the columns `[cep]` on the table `orgs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orgs_cep_key" ON "orgs"("cep");
