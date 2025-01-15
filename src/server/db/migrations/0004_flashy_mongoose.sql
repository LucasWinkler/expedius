ALTER TABLE "user_list" ALTER COLUMN "colour" SET DEFAULT '#EF4444';--> statement-breakpoint
ALTER TABLE "user_list" ALTER COLUMN "is_public" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_list" ALTER COLUMN "is_default" SET NOT NULL;