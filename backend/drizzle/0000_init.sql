CREATE TABLE "movies" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"original_title" text NOT NULL,
	"poster_path" text,
	"release_date" text,
	"cached_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"refresh_token_id" varchar(36) NOT NULL,
	"access_token_id" varchar(36),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"last_used_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_sessions_refresh_token_id_unique" UNIQUE("refresh_token_id")
);
--> statement-breakpoint
CREATE TABLE "user_movies" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"movie_id" integer NOT NULL,
	"rating" integer,
	"watched_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_movies_user_movie_unique" UNIQUE("user_id","movie_id"),
	CONSTRAINT "user_movies_rating_constraint" CHECK ("user_movies"."rating" IS NULL OR ("user_movies"."rating" >= 1 AND "user_movies"."rating" <= 5))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_sessions_expires_at_idx" ON "user_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_sessions_refresh_token_id_idx" ON "user_sessions" USING btree ("refresh_token_id");--> statement-breakpoint
CREATE INDEX "user_sessions_access_token_id_idx" ON "user_sessions" USING btree ("access_token_id");--> statement-breakpoint
CREATE INDEX "user_movies_user_id_idx" ON "user_movies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_movies_movie_id_idx" ON "user_movies" USING btree ("movie_id");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username");