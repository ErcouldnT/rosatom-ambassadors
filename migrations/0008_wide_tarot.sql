ALTER TABLE `news` ADD `slug` text;--> statement-breakpoint
CREATE UNIQUE INDEX `news_slug_unique` ON `news` (`slug`);