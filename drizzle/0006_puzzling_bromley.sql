CREATE TYPE "public"."order_status" AS ENUM('received', 'preparing', 'dispatched', 'delivered');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clientId" uuid NOT NULL,
	"status" "order_status" DEFAULT 'received' NOT NULL,
	"orderDate" timestamp DEFAULT now() NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;