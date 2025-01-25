ALTER TABLE "user" ALTER COLUMN "is_public" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_list" ALTER COLUMN "colour" SET DEFAULT 'oklch(0.6 0.25 230)';