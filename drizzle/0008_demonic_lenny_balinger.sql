ALTER TABLE "order_items" drop column "subtotal";--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "subtotal" numeric(10, 2) GENERATED ALWAYS AS (quantity * "unitPrice") STORED NOT NULL;