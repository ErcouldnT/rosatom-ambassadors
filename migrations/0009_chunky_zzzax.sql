CREATE TABLE `cms_content` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`image` blob,
	`image_mime_type` text,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_content_key_unique` ON `cms_content` (`key`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false,
	`created` text DEFAULT CURRENT_TIMESTAMP
);
