CREATE TYPE "public"."podcast_curation_status" AS ENUM('running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "podcast_candidate" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"source" text NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"signal" integer,
	"top_position" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "podcast_curation_run" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "podcast_curation_status" DEFAULT 'running' NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"window_end" timestamp with time zone NOT NULL,
	"triggered_by_id" text,
	"source_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "podcast_candidate" ADD CONSTRAINT "podcast_candidate_run_id_podcast_curation_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."podcast_curation_run"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_curation_run" ADD CONSTRAINT "podcast_curation_run_triggered_by_id_user_id_fk" FOREIGN KEY ("triggered_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "podcast_candidate_run_url_idx" ON "podcast_candidate" USING btree ("run_id","url");--> statement-breakpoint
CREATE INDEX "podcast_candidate_url_idx" ON "podcast_candidate" USING btree ("url");--> statement-breakpoint
CREATE INDEX "podcast_curation_run_status_idx" ON "podcast_curation_run" USING btree ("status","window_end" DESC NULLS LAST);