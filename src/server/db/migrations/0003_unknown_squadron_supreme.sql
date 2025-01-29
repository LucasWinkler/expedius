ALTER TYPE "public"."roles" RENAME TO "user_role";--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "saved_place" ADD CONSTRAINT "saved_place_id_unique" UNIQUE("id");