
-- ArtNFT Marketplace Schema
-- Version 1.0
-- For MySQL / MariaDB (XAMPP compatible)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================================================================
-- Users Table
-- Stores information about registered users, including their roles and credentials.
-- ================================================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `avatar_url` VARCHAR(512) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `wallet_address` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('active', 'suspended', 'pending_verification', 'deleted') NOT NULL DEFAULT 'active' COMMENT 'User account status',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX `uk_users_email` (`email`),
  UNIQUE INDEX `uk_users_username` (`username`),
  UNIQUE INDEX `uk_users_wallet_address` (`wallet_address`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user accounts and profile information.';


-- ================================================================================================
-- Categories Table
-- Defines different categories for NFTs (e.g., Digital Art, Photography).
-- ================================================================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL COMMENT 'Lucide icon name or image URL for category representation',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX `uk_categories_name` (`name`),
  UNIQUE INDEX `uk_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores NFT categories.';


-- ================================================================================================
-- Collections Table
-- Allows users to group their NFTs into named collections.
-- ================================================================================================
DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT 'The user who created this collection',
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `cover_image_url` VARCHAR(512) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE INDEX `uk_collections_user_slug` (`user_id`, `slug`),
  INDEX `idx_collections_user_id` (`user_id`),
  INDEX `idx_collections_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-created collections for NFTs.';


-- ================================================================================================
-- NFTs Table
-- Stores information about each Non-Fungible Token.
-- ================================================================================================
DROP TABLE IF EXISTS `nfts`;
CREATE TABLE `nfts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(512) NOT NULL COMMENT 'URL to the primary image of the NFT',
  `price_eth` DECIMAL(18,8) DEFAULT NULL COMMENT 'Current price in ETH if for sale, or starting bid',
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'ETH',
  `status` ENUM('pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft', 'rejected') NOT NULL DEFAULT 'draft',
  `is_auction` BOOLEAN NOT NULL DEFAULT FALSE,
  `auction_ends_at` TIMESTAMP NULL DEFAULT NULL,
  `creator_id` INT UNSIGNED NOT NULL COMMENT 'The user who originally created the NFT',
  `owner_id` INT UNSIGNED DEFAULT NULL COMMENT 'The current owner of the NFT',
  `category_id` INT UNSIGNED DEFAULT NULL,
  `collection_id` INT UNSIGNED DEFAULT NULL COMMENT 'Collection this NFT belongs to, if any',
  `tags` JSON DEFAULT NULL COMMENT 'JSON array of strings representing tags',
  `traits` JSON DEFAULT NULL COMMENT 'JSON array of objects {type: string, name: string} for NFT properties',
  `royalty_percentage` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Royalty percentage for secondary sales (e.g., 10.00 for 10%)',
  `unlockable_content` TEXT DEFAULT NULL COMMENT 'Content visible only to the owner',
  `unlockable_content_revealed` BOOLEAN NOT NULL DEFAULT FALSE,
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `favorite_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_nfts_title` (`title`),
  INDEX `idx_nfts_status` (`status`),
  INDEX `idx_nfts_creator_id` (`creator_id`),
  INDEX `idx_nfts_owner_id` (`owner_id`),
  INDEX `idx_nfts_category_id` (`category_id`),
  INDEX `idx_nfts_collection_id` (`collection_id`),
  INDEX `idx_nfts_price_eth` (`price_eth`),
  INDEX `idx_nfts_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores details of each NFT.';


-- ================================================================================================
-- Bids Table
-- Tracks bids placed on NFTs that are up for auction.
-- ================================================================================================
DROP TABLE IF EXISTS `bids`;
CREATE TABLE `bids` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nft_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `bid_amount_eth` DECIMAL(18,8) NOT NULL,
  `bid_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_winning_bid` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_bids_nft_id_amount_desc` (`nft_id`, `bid_amount_eth` DESC),
  INDEX `idx_bids_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores bids made on auctionable NFTs.';


-- ================================================================================================
-- Favorites Table
-- Allows users to mark NFTs as their favorites for easy tracking.
-- ================================================================================================
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `nft_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE INDEX `uk_favorites_user_nft` (`user_id`, `nft_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks NFTs favorited by users.';


-- ================================================================================================
-- Transactions Table
-- Records all significant financial transactions on the platform (mints, sales, etc.).
-- ================================================================================================
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nft_id` INT UNSIGNED NOT NULL,
  `seller_id` INT UNSIGNED DEFAULT NULL,
  `buyer_id` INT UNSIGNED DEFAULT NULL,
  `transaction_type` ENUM('mint', 'sale', 'transfer', 'royalty_payment') NOT NULL,
  `price_eth` DECIMAL(18,8) NOT NULL,
  `platform_fee_eth` DECIMAL(18,8) DEFAULT NULL,
  `creator_royalty_eth` DECIMAL(18,8) DEFAULT NULL,
  `transaction_hash` VARCHAR(255) DEFAULT NULL COMMENT 'Blockchain transaction hash, if applicable',
  `transaction_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE INDEX `uk_transactions_hash` (`transaction_hash`),
  INDEX `idx_transactions_nft_id` (`nft_id`),
  INDEX `idx_transactions_seller_id` (`seller_id`),
  INDEX `idx_transactions_buyer_id` (`buyer_id`),
  INDEX `idx_transactions_type_status` (`transaction_type`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Records financial transactions related to NFTs.';


-- ================================================================================================
-- Notifications Table
-- Stores notifications for users regarding platform activity or their items.
-- ================================================================================================
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('new_listing_followed', 'price_drop_favorited', 'auction_update', 'bid_placed_own', 'bid_outbid_own', 'sale_own', 'purchase_own', 'system_announcement', 'mention', 'content_report_update') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `related_nft_id` INT UNSIGNED DEFAULT NULL,
  `related_user_id` INT UNSIGNED DEFAULT NULL,
  `related_report_id` INT UNSIGNED DEFAULT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`related_nft_id`) REFERENCES `nfts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`related_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_notifications_user_read_created` (`user_id`, `is_read`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User notifications for platform activities.';


-- ================================================================================================
-- User Follows Table
-- Manages relationships where users follow other users (typically artists).
-- ================================================================================================
DROP TABLE IF EXISTS `user_follows`;
CREATE TABLE `user_follows` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `follower_id` INT UNSIGNED NOT NULL COMMENT 'The user who is performing the follow action',
  `followed_id` INT UNSIGNED NOT NULL COMMENT 'The user who is being followed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`followed_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE INDEX `uk_user_follows_pair` (`follower_id`, `followed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks user-to-user follow relationships.';


-- ================================================================================================
-- User Notification Preferences Table
-- Stores individual user settings for various types of notifications.
-- ================================================================================================
DROP TABLE IF EXISTS `user_notification_preferences`;
CREATE TABLE `user_notification_preferences` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `notify_new_listing_followed` BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_price_drop_favorited` BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_auction_update` BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_bid_placed_own` BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_bid_outbid_own` BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_sale_own` BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_purchase_own` BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_system_announcements` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_notifications_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE INDEX `uk_user_notification_preferences_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-specific notification preferences.';


-- ================================================================================================
-- Reports Table
-- For content moderation: users reporting NFTs, other users, or comments.
-- ================================================================================================
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `reporter_user_id` INT UNSIGNED DEFAULT NULL COMMENT 'User who submitted the report',
  `reported_nft_id` INT UNSIGNED DEFAULT NULL COMMENT 'NFT being reported',
  `reported_user_id` INT UNSIGNED DEFAULT NULL COMMENT 'User being reported',
  `reported_comment_id` VARCHAR(255) DEFAULT NULL COMMENT 'ID of comment being reported (if applicable)',
  `content_type` ENUM('nft', 'user_profile', 'comment') NOT NULL,
  `reason` VARCHAR(255) NOT NULL COMMENT 'Predefined reason or short summary',
  `details` TEXT DEFAULT NULL COMMENT 'Additional details provided by the reporter',
  `status` ENUM('pending_review', 'action_taken', 'dismissed') NOT NULL DEFAULT 'pending_review',
  `admin_notes` TEXT DEFAULT NULL COMMENT 'Notes from admin who reviewed the report',
  `reviewed_by_admin_id` INT UNSIGNED DEFAULT NULL COMMENT 'Admin who handled the report',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`reporter_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`reported_nft_id`) REFERENCES `nfts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`reported_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`reviewed_by_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_reports_status_type` (`status`, `content_type`),
  INDEX `idx_reports_reported_nft_id` (`reported_nft_id`),
  INDEX `idx_reports_reported_user_id` (`reported_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores content moderation reports.';


-- ================================================================================================
-- Admin Audit Log Table
-- Tracks significant actions performed by administrators in the admin panel.
-- ================================================================================================
DROP TABLE IF EXISTS `admin_audit_log`;
CREATE TABLE `admin_audit_log` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `admin_user_id` INT UNSIGNED DEFAULT NULL,
  `action_type` VARCHAR(255) NOT NULL COMMENT 'e.g., USER_SUSPENDED, NFT_HIDDEN',
  `target_type` VARCHAR(100) DEFAULT NULL COMMENT 'e.g., USER, NFT, CATEGORY',
  `target_id` VARCHAR(255) DEFAULT NULL COMMENT 'ID of the entity affected',
  `description` TEXT DEFAULT NULL COMMENT 'Detailed description of the action',
  `old_value` JSON DEFAULT NULL COMMENT 'Previous state of data, if applicable',
  `new_value` JSON DEFAULT NULL COMMENT 'New state of data, if applicable',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_admin_audit_log_admin_id` (`admin_user_id`),
  INDEX `idx_admin_audit_log_action_type` (`action_type`),
  INDEX `idx_admin_audit_log_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs actions performed by administrators.';


-- ================================================================================================
-- Platform Settings Table
-- Stores global configuration settings for the platform, manageable by admins.
-- ================================================================================================
DROP TABLE IF EXISTS `platform_settings`;
CREATE TABLE `platform_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY NOT NULL COMMENT 'Unique key for the setting (e.g., site_name, maintenance_mode)',
  `setting_value` TEXT COMMENT 'Value of the setting (can be JSON for complex settings)',
  `description` VARCHAR(255) COMMENT 'Description of what the setting controls',
  `type` ENUM('string', 'number', 'boolean', 'json', 'theme_color') NOT NULL DEFAULT 'string' COMMENT 'Data type of the setting_value',
  `is_public` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'If true, this setting might be exposed to frontend (use with caution)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores global configuration settings for the platform, manageable by admins.';


-- ================================================================================================
-- Promotions Table
-- Manages featured NFTs, artist spotlights, or other promotional content.
-- ================================================================================================
DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `promotion_type` ENUM('featured_nft', 'artist_spotlight', 'collection_spotlight', 'banner') NOT NULL,
  `target_nft_id` INT UNSIGNED DEFAULT NULL,
  `target_user_id` INT UNSIGNED DEFAULT NULL COMMENT 'For artist spotlight',
  `target_collection_id` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(255) DEFAULT NULL COMMENT 'Optional title for the promotion itself',
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(512) DEFAULT NULL COMMENT 'Custom image for the promotion if needed',
  `link_url` VARCHAR(512) DEFAULT NULL COMMENT 'URL the promotion links to',
  `start_date` TIMESTAMP NULL DEFAULT NULL,
  `end_date` TIMESTAMP NULL DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_by_admin_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`target_nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`target_collection_id`) REFERENCES `collections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`created_by_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_promotions_type_active_dates` (`promotion_type`, `is_active`, `start_date`, `end_date`),
  INDEX `idx_promotions_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Manages featured content and promotions.';


-- ================================================================================================
-- Mock Data Insertion
-- ================================================================================================

-- Default Admin User
-- Password for 'admin@artnft.com' is 'adminpass' (BCrypt hash generated for this password)
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`, `status`) VALUES
('AdminUser', 'admin@artnft.com', '$2a$10$gPhA6j3gHJc8sATEj92Nl.07iPksJU0GL1fCCARGrH40nQc3L5sQK', 'admin', 'active'),
('TestUser01', 'testuser@artnft.com', '$2a$10$gPhA6j3gHJc8sATEj92Nl.07iPksJU0GL1fCCARGrH40nQc3L5sQK', 'user', 'active'), -- Same password 'adminpass' for testing ease
('ArtIsLife', 'artist@example.com', '$2a$10$V.Wq9tY5G.sXf2y/iS17x.ePzVnK6l4gP/lSg/y1o9o9zCqRjG3mC', 'user', 'active'), -- Pwd: 'artistpass'
('NFTCollectorGal', 'collector@example.com', '$2a$10$9yXwE.0VlR8w3o4P.L5N8e.kXjD7qE.pL9sQ/rT0o9zCfXrYg2iW', 'user', 'active'); -- Pwd: 'collectorpass'


-- Default Categories
INSERT INTO `categories` (`name`, `slug`, `description`, `icon`) VALUES
('Digital Art', 'digital-art', 'Creations made with digital technologies.', 'Palette'),
('Photography', 'photography', 'Art captured through the lens.', 'Camera'),
('Music', 'music', 'Audio NFTs and music-related collectibles.', 'Music2'),
('Collectibles', 'collectibles', 'Unique digital items and memorabilia.', 'ToyBrick'),
('Virtual Worlds', 'virtual-worlds', 'Assets for metaverses and virtual environments.', 'Globe'),
('Utility Tokens', 'utility-tokens', 'NFTs that grant access, perks, or functionalities.', 'Bitcoin'),
('Generative Art', 'generative-art', 'Art created using autonomous systems and algorithms.', 'Sparkles'),
('Pixel Art', 'pixel-art', 'Digital art created on the pixel level.', 'Grid');


-- Example NFT (can be expanded)
INSERT INTO `nfts` (`title`, `description`, `image_url`, `price_eth`, `status`, `creator_id`, `owner_id`, `category_id`)
SELECT
    'My First Abstract',
    'An exploration of color and form by TestUser01.',
    'https://placehold.co/600x600.png',
    0.5,
    'listed',
    (SELECT id FROM users WHERE email = 'testuser@artnft.com'),
    (SELECT id FROM users WHERE email = 'testuser@artnft.com'),
    (SELECT id FROM categories WHERE slug = 'digital-art')
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'testuser@artnft.com') AND EXISTS (SELECT 1 FROM categories WHERE slug = 'digital-art');

INSERT INTO `nfts` (`title`, `description`, `image_url`, `price_eth`, `status`, `is_auction`, `auction_ends_at`, `creator_id`, `owner_id`, `category_id`)
SELECT
    'Pixel Pal',
    'A friendly pixel character, ready for adventure!',
    'https://placehold.co/600x600.png',
    0.2, -- Starting bid
    'on_auction',
    TRUE,
    DATE_ADD(NOW(), INTERVAL 3 DAY), -- Auction ends in 3 days
    (SELECT id FROM users WHERE email = 'testuser@artnft.com'),
    (SELECT id FROM users WHERE email = 'testuser@artnft.com'),
    (SELECT id FROM categories WHERE slug = 'pixel-art')
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'testuser@artnft.com') AND EXISTS (SELECT 1 FROM categories WHERE slug = 'pixel-art');

-- Example Favorite
INSERT INTO `favorites` (`user_id`, `nft_id`)
SELECT
    (SELECT id FROM users WHERE email = 'testuser@artnft.com'),
    (SELECT id FROM nfts WHERE title = 'Pixel Pal' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'testuser@artnft.com') AND EXISTS (SELECT 1 FROM nfts WHERE title = 'Pixel Pal');

-- Example User Follow
INSERT INTO `user_follows` (`follower_id`, `followed_id`)
SELECT
    (SELECT id FROM users WHERE email = 'testuser@artnft.com'),
    (SELECT id FROM users WHERE email = 'artist@example.com')
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'testuser@artnft.com') AND EXISTS (SELECT 1 FROM users WHERE email = 'artist@example.com');


-- Default Platform Settings
INSERT INTO `platform_settings` (`setting_key`, `setting_value`, `description`, `type`) VALUES
('site_name', 'ArtNFT Marketplace', 'The public name of the marketplace.', 'string'),
('tagline', 'Discover, Create, and Trade Digital Art & NFTs', 'The main tagline for the marketplace.', 'string'),
('maintenance_mode', 'false', 'Puts the site into maintenance mode if true.', 'boolean'),
('default_royalty_percentage', '10', 'Default royalty percentage for new NFTs.', 'number'),
('theme_primary_color', '#3B69CC', 'Primary theme color (hex).', 'theme_color'),
('theme_accent_color', '#FF66B3', 'Accent theme color (hex).', 'theme_color');


SET FOREIGN_KEY_CHECKS = 1;

-- End of schema.sql
    