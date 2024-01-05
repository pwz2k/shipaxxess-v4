CREATE TABLE `adminSettings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`setting_id` text NOT NULL,
	`setting_value` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
