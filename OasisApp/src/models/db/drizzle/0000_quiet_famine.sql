CREATE TABLE `cart_items` (
	`item_id` text NOT NULL,
	`stall_id` text NOT NULL,
	`stall_name` text NOT NULL,
	`item_name` text NOT NULL,
	`price` real NOT NULL,
	`is_veg` integer NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`item_id`, `stall_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`date_time` text NOT NULL,
	`description` text DEFAULT '',
	`categories` text DEFAULT 'null',
	`venue_name` text NOT NULL,
	`organiser` text NOT NULL,
	`bookmark` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`stall_id` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`is_veg` integer NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`image_url` text,
	`image_background_color` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`stall_id`) REFERENCES `stalls`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `merch` (
	`ID` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`merch_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`back_image_url` text NOT NULL,
	`blur_hash` text NOT NULL,
	`price` real NOT NULL,
	`in_cart_quantity` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `merch_merch_id_unique` ON `merch` (`merch_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text DEFAULT 'general' NOT NULL,
	`order_id` integer,
	`new_status` integer,
	`old_status` integer,
	`is_read` integer DEFAULT false NOT NULL,
	`url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer NOT NULL,
	`order_id` integer NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`is_veg` integer NOT NULL,
	PRIMARY KEY(`id`, `order_id`),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY NOT NULL,
	`vendor_name` text NOT NULL,
	`vendor_image` text,
	`vendor_image_background_color` text,
	`status` integer NOT NULL,
	`price` real NOT NULL,
	`otp` integer,
	`otp_seen` integer DEFAULT false NOT NULL,
	`timestamp` text NOT NULL,
	`is_split` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stall_totals` (
	`stall_id` text PRIMARY KEY NOT NULL,
	`stall_name` text NOT NULL,
	`total_items` integer DEFAULT 0 NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `stalls` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image_url` text,
	`image_background_color` text,
	`location` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
