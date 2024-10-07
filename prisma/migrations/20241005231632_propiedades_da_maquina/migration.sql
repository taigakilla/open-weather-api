/*
  Warnings:

  - You are about to drop the `WeatherData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WeatherData";

-- CreateTable
CREATE TABLE "PropiedadesDaMaquina" (
    "id" SERIAL NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "eficiencia" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropiedadesDaMaquina_pkey" PRIMARY KEY ("id")
);
