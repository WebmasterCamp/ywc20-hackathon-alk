ALTER TABLE `temple` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `temple` ADD `rating` float DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `temple` ADD `reviewCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `temple` ADD `openTime` varchar(10) DEFAULT '06:00' NOT NULL;--> statement-breakpoint
ALTER TABLE `temple` ADD `closeTime` varchar(10) DEFAULT '18:00' NOT NULL;