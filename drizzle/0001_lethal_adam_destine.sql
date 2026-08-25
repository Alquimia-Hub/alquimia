CREATE TABLE "rate_limit" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"expires_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
UPDATE "project" SET "status" = 'pending' WHERE "status" = 'draft';--> statement-breakpoint
DROP TYPE "public"."project_status";--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "status" SET DATA TYPE "public"."project_status" USING "status"::"public"."project_status";--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."project_status";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp with time zone USING "access_token_expires_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "refresh_token_expires_at" SET DATA TYPE timestamp with time zone USING "refresh_token_expires_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone USING "expires_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "ban_expires" SET DATA TYPE timestamp with time zone USING "ban_expires" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "alquimista_checked_at" SET DATA TYPE timestamp with time zone USING "alquimista_checked_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone USING "expires_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "submitted_at" SET DATA TYPE timestamp with time zone USING "submitted_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "approved_at" SET DATA TYPE timestamp with time zone USING "approved_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "project" drop column "search_vector";--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(tagline, '') || ' ' || coalesce(description, ''))) STORED;--> statement-breakpoint
CREATE INDEX "project_search_idx" ON "project" USING gin ("search_vector");--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "resolved_at" SET DATA TYPE timestamp with time zone USING "resolved_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "locale" text DEFAULT 'es' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
CREATE UNIQUE INDEX "report_open_unique_idx" ON "report" USING btree ("project_id","reporter_id") WHERE "report"."status" = 'open';