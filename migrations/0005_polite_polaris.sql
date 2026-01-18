ALTER TABLE `ambassadors` ADD `slug` text;--> statement-breakpoint
ALTER TABLE `ambassadors` ADD `about_en` text;--> statement-breakpoint
ALTER TABLE `ambassadors` ADD `about_ru` text;--> statement-breakpoint
ALTER TABLE `ambassadors` ADD `contributions_en` text;--> statement-breakpoint
ALTER TABLE `ambassadors` ADD `contributions_ru` text;--> statement-breakpoint
CREATE UNIQUE INDEX `ambassadors_slug_unique` ON `ambassadors` (`slug`);