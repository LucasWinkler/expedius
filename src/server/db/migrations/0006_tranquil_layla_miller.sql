CREATE TABLE "user_primary_type_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"place_type" text NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_primary_type_preference_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user_type_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"place_type" text NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_type_preference_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "user_primary_type_preference" ADD CONSTRAINT "user_primary_type_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_type_preference" ADD CONSTRAINT "user_type_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "primary_type_user_idx" ON "user_primary_type_preference" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "primary_type_user_place_type_idx" ON "user_primary_type_preference" USING btree ("user_id","place_type");--> statement-breakpoint
CREATE INDEX "type_user_idx" ON "user_type_preference" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "type_user_place_type_idx" ON "user_type_preference" USING btree ("user_id","place_type");