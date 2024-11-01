-- DropForeignKey
ALTER TABLE "FilePermission" DROP CONSTRAINT "FilePermission_fileId_fkey";

-- DropForeignKey
ALTER TABLE "FileStatusByProvider" DROP CONSTRAINT "FileStatusByProvider_fileId_fkey";

-- AddForeignKey
ALTER TABLE "FilePermission" ADD CONSTRAINT "FilePermission_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileStatusByProvider" ADD CONSTRAINT "FileStatusByProvider_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
