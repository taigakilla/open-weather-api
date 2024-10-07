/*
  Warnings:

  - You are about to alter the column `eficiencia` on the `PropiedadesDaMaquina` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE "PropiedadesDaMaquina" ALTER COLUMN "eficiencia" SET DATA TYPE DECIMAL(4,2);
