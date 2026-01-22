CREATE TYPE "public"."user_type" AS ENUM('admin', 'client');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"type" "user_type" DEFAULT 'client' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
