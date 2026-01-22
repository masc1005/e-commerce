CREATE TYPE "public"."status_client" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar NOT NULL,
	"contact" varchar NOT NULL,
	"address" varchar,
	"status" "status_client" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;