CREATE TABLE `test_suggestions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idea` text NOT NULL,
	`target` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
