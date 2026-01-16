DROP INDEX "user_username_unique";--> statement-breakpoint
ALTER TABLE `ambassadors` ALTER COLUMN "image" TO "image" blob;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
ALTER TABLE `ambassadors` ADD `image_mime_type` text;--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "image" TO "image" blob;--> statement-breakpoint
ALTER TABLE `events` ADD `image_mime_type` text;--> statement-breakpoint
ALTER TABLE `news` ALTER COLUMN "image" TO "image" blob;--> statement-breakpoint
ALTER TABLE `news` ADD `image_mime_type` text;