/*
  Warnings:

  - A unique constraint covering the columns `[fileId,providerId]` on the table `FileStatusByProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileStatusByProvider_fileId_providerId_key" ON "FileStatusByProvider"("fileId", "providerId");
