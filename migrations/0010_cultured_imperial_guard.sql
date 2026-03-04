CREATE TABLE `universities` (
	`id` text PRIMARY KEY NOT NULL,
	`name_en` text NOT NULL,
	`name_ru` text NOT NULL,
	`city_en` text,
	`city_ru` text,
	`website` text,
	`founded` text,
	`student_count` integer,
	`intl_student_count` integer,
	`budget_places` integer,
	`program_count` integer,
	`image` blob,
	`image_mime_type` text,
	`created` text DEFAULT CURRENT_TIMESTAMP,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `ambassadors` ADD `is_alumni` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `ambassadors` ADD `awards_json` text;--> statement-breakpoint
ALTER TABLE `ambassadors` DROP COLUMN `is_active`;--> statement-breakpoint
ALTER TABLE `events` ADD `event_date` text;