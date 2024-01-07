CREATE TABLE `adminWeights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`type_id` integer NOT NULL,
	`from_weight` integer NOT NULL,
	`to_weight` integer NOT NULL,
	`user_cost` integer NOT NULL,
	`reseller_cost` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`type_id`) REFERENCES `types`(`id`) ON UPDATE no action ON DELETE no action
);
