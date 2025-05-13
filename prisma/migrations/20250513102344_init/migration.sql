-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_parentId_fkey";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
