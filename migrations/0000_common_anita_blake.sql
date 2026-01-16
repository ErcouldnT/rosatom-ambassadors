CREATE TABLE `ambassadors` (
	`id` text PRIMARY KEY NOT NULL,
	`name_en` text NOT NULL,
	`name_ru` text NOT NULL,
	`country_en` text NOT NULL,
	`country_ru` text NOT NULL,
	`role_en` text NOT NULL,
	`role_ru` text NOT NULL,
	`image` text,
	`is_active` integer DEFAULT true,
	`created` text DEFAULT CURRENT_TIMESTAMP,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` text PRIMARY KEY NOT NULL,
	`name_en` text NOT NULL,
	`name_ru` text NOT NULL,
	`flag` text,
	`created` text DEFAULT CURRENT_TIMESTAMP,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title_en` text NOT NULL,
	`title_ru` text NOT NULL,
	`date_day` text NOT NULL,
	`date_month_en` text NOT NULL,
	`date_month_ru` text NOT NULL,
	`time` text NOT NULL,
	`location_en` text NOT NULL,
	`location_ru` text NOT NULL,
	`description_en` text,
	`description_ru` text,
	`image` text,
	`created` text DEFAULT CURRENT_TIMESTAMP,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` text PRIMARY KEY NOT NULL,
	`category_en` text NOT NULL,
	`category_ru` text NOT NULL,
	`date` text NOT NULL,
	`title_en` text NOT NULL,
	`title_ru` text NOT NULL,
	`excerpt_en` text,
	`excerpt_ru` text,
	`image` text,
	`created` text DEFAULT CURRENT_TIMESTAMP,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`label_en` text NOT NULL,
	`label_ru` text NOT NULL,
	`icon` text,
	`created` text DEFAULT CURRENT_TIMESTAMP,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `tickers` (
	`id` text PRIMARY KEY NOT NULL,
	`text_en` text NOT NULL,
	`text_ru` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created` text DEFAULT CURRENT_TIMESTAMP,
	`updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);