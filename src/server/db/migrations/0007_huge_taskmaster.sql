CREATE TABLE "list_place" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"place_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "list_place_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "list_place" ADD CONSTRAINT "list_place_list_id_user_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."user_list"("id") ON DELETE cascade ON UPDATE no action;