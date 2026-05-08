/*
  Warnings:

  - The values [HEADER,SIDEBAR,FOOTER] on the enum `AdPlacement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdPlacement_new" AS ENUM ('ARTICLE_HEADER', 'ARTICLE_MIDDLE', 'ARTICLE_FOOTER', 'SIDEBAR_TOP', 'SIDEBAR_MIDDLE', 'SIDEBAR_BOTTOM', 'HOMEPAGE_BANNER', 'SEARCH_RESULTS');
ALTER TABLE "advertisements" ALTER COLUMN "placement" TYPE "AdPlacement_new" USING ("placement"::text::"AdPlacement_new");
ALTER TYPE "AdPlacement" RENAME TO "AdPlacement_old";
ALTER TYPE "AdPlacement_new" RENAME TO "AdPlacement";
DROP TYPE "AdPlacement_old";
COMMIT;
