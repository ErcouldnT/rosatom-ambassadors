DROP INDEX "user_username_unique";--> statement-breakpoint
ALTER TABLE `tickers` ALTER COLUMN "is_active" TO "is_active" integer NOT NULL DEFAULT true;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);