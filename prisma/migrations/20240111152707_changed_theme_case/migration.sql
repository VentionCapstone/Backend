/*
  Warnings:

  - The values [LIGHT,DARK,SYSTEM] on the enum `UiTheme` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UiTheme_new" AS ENUM ('light', 'dark', 'system');
ALTER TABLE "UserProfile" ALTER COLUMN "uiTheme" DROP DEFAULT;
ALTER TABLE "UserProfile" ALTER COLUMN "uiTheme" TYPE "UiTheme_new" USING ("uiTheme"::text::"UiTheme_new");
ALTER TYPE "UiTheme" RENAME TO "UiTheme_old";
ALTER TYPE "UiTheme_new" RENAME TO "UiTheme";
DROP TYPE "UiTheme_old";
ALTER TABLE "UserProfile" ALTER COLUMN "uiTheme" SET DEFAULT 'light';
COMMIT;

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "uiTheme" SET DEFAULT 'light';
