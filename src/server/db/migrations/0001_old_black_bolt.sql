CREATE TABLE "place" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text,
	"latitude" text,
	"longitude" text,
	"place_id" text,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "place_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "user_list" ALTER COLUMN "colour" SET DEFAULT 'red';--> statement-breakpoint
ALTER TABLE "user_list" ALTER COLUMN "colour" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_list" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "user_list" ADD COLUMN "is_default" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "place" ADD CONSTRAINT "place_list_id_user_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."user_list"("id") ON DELETE cascade ON UPDATE no action;