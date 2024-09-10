CREATE TABLE `jettons_meta` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jetton_id` integer NOT NULL,
	`website` text,
	`twitter` text,
	`telegram` text,
	FOREIGN KEY (`jetton_id`) REFERENCES `jettons`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `jettons` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `jettons` ADD `symbol` text NOT NULL;--> statement-breakpoint
ALTER TABLE `jettons` ADD `description` text;