CREATE TYPE "public"."vote_action" AS ENUM('added', 'removed');--> statement-breakpoint
CREATE TABLE "vote_event" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action" "vote_action" NOT NULL,
	"weight" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vote_event" ADD CONSTRAINT "vote_event_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_event" ADD CONSTRAINT "vote_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vote_event_created_at_idx" ON "vote_event" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "vote_event_project_id_idx" ON "vote_event" USING btree ("project_id");--> statement-breakpoint
INSERT INTO "vote_event" ("id", "project_id", "user_id", "action", "weight", "created_at")
SELECT md5(v."project_id" || ':' || v."user_id"), v."project_id", v."user_id", 'added',
       CASE WHEN u."is_alquimista" AND u."alquimista_checked_at" > now() - interval '7 days' THEN 2 ELSE 1 END,
       v."created_at"
FROM "vote" v
JOIN "user" u ON u."id" = v."user_id"
ON CONFLICT ("id") DO NOTHING;
