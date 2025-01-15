ALTER TABLE "user" ALTER COLUMN "username_updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username_updated_at" DROP NOT NULL;