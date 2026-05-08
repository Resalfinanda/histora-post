-- CreateEnum
CREATE TYPE "AdPlacement" AS ENUM ('HEADER', 'ARTICLE_HEADER', 'ARTICLE_MIDDLE', 'ARTICLE_FOOTER', 'SIDEBAR', 'HOMEPAGE_BANNER', 'SEARCH_RESULTS', 'FOOTER');

-- CreateEnum
CREATE TYPE "AdTopic" AS ENUM ('SPORTS', 'LOCAL_EVENTS', 'POLITICS', 'BUSINESS', 'TECHNOLOGY', 'ENTERTAINMENT', 'HEALTH', 'EDUCATION', 'GENERAL');

-- CreateTable
CREATE TABLE "advertisements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "ad_link" TEXT NOT NULL,
    "placement" "AdPlacement" NOT NULL,
    "topics" "AdTopic"[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);
