-- CreateTable
CREATE TABLE "Provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileStatusByProvider" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileStatusByProvider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileStatusByProvider" ADD CONSTRAINT "FileStatusByProvider_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileStatusByProvider" ADD CONSTRAINT "FileStatusByProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
