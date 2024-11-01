/*
  Warnings:

  - A unique constraint covering the columns `[fileId,userId,typeId]` on the table `FilePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FilePermission_fileId_userId_typeId_key" ON "FilePermission"("fileId", "userId", "typeId");
