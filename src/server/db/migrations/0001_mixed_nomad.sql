ALTER TABLE "list" ALTER COLUMN "colour" SET DEFAULT 'oklch(0.7 0.24 270)';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "header_image" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "colour" text DEFAULT 'oklch(0.7 0.24 270)' NOT NULL;