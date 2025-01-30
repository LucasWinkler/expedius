ALTER TABLE "list" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_user_slug_idx" UNIQUE("user_id","slug");