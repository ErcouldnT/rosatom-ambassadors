ALTER TABLE `ambassadors` ADD `country_id` text REFERENCES countries(id);--> statement-breakpoint
ALTER TABLE `countries` ADD `code` text;--> statement-breakpoint
ALTER TABLE `countries` ADD `latitude` text;--> statement-breakpoint
ALTER TABLE `countries` ADD `longitude` text;