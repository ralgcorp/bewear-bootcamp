ALTER TABLE "cart" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "guest_id" text;--> statement-breakpoint
ALTER TABLE "product_variant" DROP COLUMN "status";--> statement-breakpoint
DROP TYPE "public"."product_variant_status";