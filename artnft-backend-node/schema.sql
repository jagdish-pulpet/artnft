
-- ArtNFT Marketplace - MySQL Schema
-- Version: 1.3
-- Description: Enhanced schema with indexes, unique constraints, and FK actions.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Drop tables if they exist (for development/reset)
DROP TABLE IF EXISTS `user_notification_preferences`;
DROP TABLE IF EXISTS `user_follows`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `admin_tasks`;
DROP TABLE IF EXISTS `admin_audit_log`;
DROP TABLE IF EXISTS `platform_settings`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `bids`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `nfts`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;


-- ================================================================================================
-- Users Table
-- Stores information about registered users (artists, collectors, admins).
-- ================================================================================================
CREATE TABLE `users` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the user',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'User''s email address',
  `username` VARCHAR(50) UNIQUE COMMENT 'User''s unique username (optional on signup, can be set later)',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  `avatar_url` VARCHAR(255) COMMENT 'URL to the user''s avatar image',
  `bio` TEXT COMMENT 'Short biography or description of the user',
  `wallet_address` VARCHAR(255) UNIQUE COMMENT 'User''s primary crypto wallet address',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT 'User role (user or admin)',
  `status` ENUM('active', 'suspended', 'pending_verification', 'deleted') NOT NULL DEFAULT 'pending_verification' COMMENT 'Account status',
  `last_login_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp of the last login',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_username` (`username`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user account information.';


-- ================================================================================================
-- Categories Table
-- Defines categories for NFTs (e.g., Digital Art, Photography, Music).
-- ================================================================================================
CREATE TABLE `categories` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the category',
  `name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Name of the category',
  `slug` VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL-friendly slug for the category',
  `description` TEXT COMMENT 'Description of the category',
  `icon` VARCHAR(100) COMMENT 'Identifier for an icon (e.g., Lucide icon name or image URL)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='NFT categories like Digital Art, Music, etc.';


-- ================================================================================================
-- Collections Table
-- Allows users to group their NFTs into collections.
-- ================================================================================================
CREATE TABLE `collections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL COMMENT 'Unique ID for the collection',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the user who created the collection',
  `name` VARCHAR(150) NOT NULL COMMENT 'Name of the collection',
  `slug` VARCHAR(150) NOT NULL UNIQUE COMMENT 'URL-friendly slug for the collection (globally unique)',
  `description` TEXT COMMENT 'Description of the collection',
  `cover_image_url` VARCHAR(255) COMMENT 'URL for the collection''s cover image',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE, -- If user is deleted, their collections are deleted
  INDEX `idx_collections_user_id` (`user_id`),
  INDEX `idx_collections_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-created NFT collections.';


-- ================================================================================================
-- NFTs Table
-- Stores information about each Non-Fungible Token.
-- ================================================================================================
CREATE TABLE `nfts` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the NFT',
  `creator_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the user who created the NFT',
  `owner_id` CHAR(36) COMMENT 'Foreign key referencing the current owner of the NFT (can be same as creator)',
  `category_id` CHAR(36) COMMENT 'Foreign key referencing the category this NFT belongs to',
  `collection_id` INT COMMENT 'Foreign key referencing the collection this NFT belongs to (optional)',
  `title` VARCHAR(255) NOT NULL COMMENT 'Title of the NFT',
  `description` TEXT COMMENT 'Detailed description of the NFT',
  `image_url` VARCHAR(255) NOT NULL COMMENT 'URL to the primary image/media of the NFT',
  `metadata_url` VARCHAR(255) COMMENT 'URL to the off-chain metadata JSON (following standards like EIP-721 or EIP-1155)',
  `price_eth` DECIMAL(18, 8) COMMENT 'Current price in ETH if for direct sale, or starting bid for auction',
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'ETH' COMMENT 'Cryptocurrency symbol for the price',
  `status` ENUM('draft', 'pending_moderation', 'listed', 'on_auction', 'sold', 'hidden') NOT NULL DEFAULT 'draft' COMMENT 'Status of the NFT listing',
  `is_auction` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'True if the NFT is currently part of an auction',
  `auction_ends_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp when the auction ends (if applicable)',
  `highest_bid_id` INT COMMENT 'Foreign key to the current highest bid in the bids table (if on auction)',
  `tags` JSON COMMENT 'JSON array of tags or keywords associated with the NFT',
  `royalty_percentage` DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Royalty percentage for secondary sales (e.g., 10.00 for 10%)',
  `unlockable_content_url` VARCHAR(255) COMMENT 'URL to unlockable content for the owner (optional)',
  `view_count` INT DEFAULT 0 COMMENT 'Number of times the NFT has been viewed',
  `like_count` INT DEFAULT 0 COMMENT 'Number of likes/favorites the NFT has received',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE, -- Prevent user deletion if they created NFTs
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- If owner deleted, NFT becomes unowned or reverts to marketplace
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- If category deleted, NFT loses category
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- If collection deleted, NFT removed from it
  -- FOREIGN KEY (`highest_bid_id`) REFERENCES `bids`(`id`) ON DELETE SET NULL, -- Circular dependency potential, manage via app logic or defer
  INDEX `idx_nfts_creator_id` (`creator_id`),
  INDEX `idx_nfts_owner_id` (`owner_id`),
  INDEX `idx_nfts_category_id` (`category_id`),
  INDEX `idx_nfts_collection_id` (`collection_id`),
  INDEX `idx_nfts_status` (`status`),
  INDEX `idx_nfts_auction_ends_at` (`auction_ends_at`),
  INDEX `idx_nfts_title` (`title`) -- For searching/sorting by title
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores all NFT details and their status.';


-- ================================================================================================
-- Bids Table
-- Tracks bids made on NFTs that are up for auction.
-- ================================================================================================
CREATE TABLE `bids` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL COMMENT 'Unique ID for the bid',
  `nft_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the NFT being bid on',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the user who placed the bid',
  `bid_amount_eth` DECIMAL(18, 8) NOT NULL COMMENT 'Amount of the bid in ETH',
  `bid_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the bid was placed',
  `status` ENUM('active', 'outbid', 'winning', 'cancelled', 'expired') NOT NULL DEFAULT 'active' COMMENT 'Status of the bid',
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE, -- If NFT deleted, its bids are deleted
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE, -- If user deleted, their bids are deleted
  INDEX `idx_bids_nft_id_amount` (`nft_id`, `bid_amount_eth` DESC), -- For finding highest bid per NFT
  INDEX `idx_bids_user_id` (`user_id`),
  INDEX `idx_bids_bid_time` (`bid_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks bids on auctionable NFTs.';


-- ================================================================================================
-- Favorites Table
-- Manages users' favorited NFTs.
-- ================================================================================================
CREATE TABLE `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL COMMENT 'Unique ID for the favorite entry',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the user who favorited the NFT',
  `nft_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the NFT that was favorited',
  `favorited_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the NFT was favorited',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `uk_favorites_user_nft` (`user_id`, `nft_id`),
  INDEX `idx_favorites_nft_id` (`nft_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user''s favorited NFTs.';


-- ================================================================================================
-- Transactions Table
-- Records all NFT sales, purchases, and possibly minting fees.
-- ================================================================================================
CREATE TABLE `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL COMMENT 'Unique ID for the transaction',
  `nft_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the NFT involved in the transaction',
  `buyer_id` CHAR(36) COMMENT 'Foreign key referencing the user who bought the NFT (null for mints)',
  `seller_id` CHAR(36) COMMENT 'Foreign key referencing the user who sold the NFT (null for mints, creator for primary sale)',
  `type` ENUM('mint', 'sale', 'transfer', 'royalty_payment') NOT NULL COMMENT 'Type of transaction',
  `amount_eth` DECIMAL(18, 8) NOT NULL COMMENT 'Transaction amount in ETH',
  `gas_fee_eth` DECIMAL(18, 9) COMMENT 'Gas fee paid for the transaction in ETH',
  `platform_fee_eth` DECIMAL(18, 9) COMMENT 'Platform fee collected in ETH',
  `transaction_hash` VARCHAR(255) UNIQUE COMMENT 'Blockchain transaction hash (if applicable)',
  `transaction_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the transaction occurred',
  `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending' COMMENT 'Status of the transaction',
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE, -- Prevent NFT deletion if transactions exist
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- Preserve transaction, anonymize user
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- Preserve transaction, anonymize user
  INDEX `idx_transactions_nft_id` (`nft_id`),
  INDEX `idx_transactions_buyer_id` (`buyer_id`),
  INDEX `idx_transactions_seller_id` (`seller_id`),
  INDEX `idx_transactions_type` (`type`),
  INDEX `idx_transactions_transaction_time` (`transaction_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Records all NFT financial transactions.';


-- ================================================================================================
-- Notifications Table
-- Stores notifications for users (e.g., new bids, sales, followed artist activity).
-- ================================================================================================
CREATE TABLE `notifications` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the notification',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the user who receives the notification',
  `type` ENUM('new_bid', 'bid_outbid', 'auction_won', 'auction_ending_soon', 'nft_sold', 'nft_purchased', 'new_follower', 'new_nft_from_followed_artist', 'platform_announcement', 'report_update') NOT NULL COMMENT 'Type of notification',
  `title` VARCHAR(255) NOT NULL COMMENT 'Brief title for the notification',
  `message` TEXT NOT NULL COMMENT 'Detailed message of the notification',
  `related_entity_type` VARCHAR(50) COMMENT 'Type of entity this notification relates to (e.g., NFT, User, Bid)',
  `related_entity_id` VARCHAR(36) COMMENT 'ID of the related entity',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'True if the user has read the notification',
  `read_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp when the notification was read',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_notifications_user_id_is_read_created_at` (`user_id`, `is_read`, `created_at` DESC) -- Efficiently fetch unread notifications for a user, sorted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User notifications for platform activities.';


-- ================================================================================================
-- User Follows Table
-- Manages relationships where one user follows another.
-- ================================================================================================
CREATE TABLE `user_follows` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `follower_id` CHAR(36) NOT NULL COMMENT 'User doing the following',
  `followed_id` CHAR(36) NOT NULL COMMENT 'User being followed',
  `followed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`followed_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `uk_user_follows_pair` (`follower_id`, `followed_id`),
  INDEX `idx_user_follows_followed_id` (`followed_id`) -- To quickly find all followers of a user
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks user follow relationships.';


-- ================================================================================================
-- User Notification Preferences Table
-- Stores user-specific settings for which notifications they want to receive.
-- ================================================================================================
CREATE TABLE `user_notification_preferences` (
  `id` CHAR(36) PRIMARY KEY NOT NULL,
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing the user',
  `email_new_bid` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_auction_won` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_nft_sold` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_platform_updates` BOOLEAN NOT NULL DEFAULT TRUE,
  `in_app_new_bid` BOOLEAN NOT NULL DEFAULT TRUE,
  `in_app_auction_won` BOOLEAN NOT NULL DEFAULT TRUE,
  -- Add more preference flags as needed
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `uk_user_notification_preferences_user_id` (`user_id`) -- Each user has one set of preferences
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User preferences for receiving notifications.';


-- ================================================================================================
-- Reports Table
-- For users to report content or users for violating platform policies.
-- ================================================================================================
CREATE TABLE `reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `reported_by_user_id` CHAR(36) NOT NULL COMMENT 'User who made the report',
  `content_type` ENUM('nft', 'user_profile', 'comment') NOT NULL COMMENT 'Type of content being reported',
  `content_id` VARCHAR(36) NOT NULL COMMENT 'ID of the reported content/user (generic ID as it can be NFT or User)',
  `reason` VARCHAR(255) NOT NULL COMMENT 'Reason for the report',
  `details` TEXT COMMENT 'Additional details provided by the reporter',
  `status` ENUM('pending_review', 'under_review', 'resolved_action_taken', 'resolved_no_action') NOT NULL DEFAULT 'pending_review',
  `moderator_id` CHAR(36) COMMENT 'Admin/Moderator who handled the report',
  `moderator_notes` TEXT COMMENT 'Notes from the moderator',
  `report_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_date` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`reported_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- Keep report if reporter deleted
  FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- Keep report if moderator deleted
  INDEX `idx_reports_reported_by_user_id` (`reported_by_user_id`),
  INDEX `idx_reports_content_id_content_type` (`content_id`, `content_type`),
  INDEX `idx_reports_status` (`status`),
  INDEX `idx_reports_moderator_id` (`moderator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks user-submitted reports for content/conduct.';


-- ================================================================================================
-- Admin Audit Log Table
-- Logs significant actions performed by administrators in the admin panel.
-- ================================================================================================
CREATE TABLE `admin_audit_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `admin_user_id` CHAR(36) NOT NULL COMMENT 'Admin who performed the action',
  `action_type` VARCHAR(100) NOT NULL COMMENT 'e.g., USER_SUSPENDED, NFT_HIDDEN, CATEGORY_CREATED',
  `target_entity_type` VARCHAR(50) COMMENT 'Type of entity affected (e.g., User, NFT, Category)',
  `target_entity_id` VARCHAR(36) COMMENT 'ID of the affected entity',
  `details` TEXT COMMENT 'JSON or text details about the action (e.g., old/new values)',
  `ip_address` VARCHAR(45) COMMENT 'IP address from which the action was performed',
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- Keep log if admin deleted, set user to NULL
  INDEX `idx_admin_audit_log_admin_user_id` (`admin_user_id`),
  INDEX `idx_admin_audit_log_action_type` (`action_type`),
  INDEX `idx_admin_audit_log_target_entity` (`target_entity_type`, `target_entity_id`),
  INDEX `idx_admin_audit_log_timestamp` (`timestamp` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs actions taken by administrators.';


-- ================================================================================================
-- Admin Tasks Table
-- A list of tasks for administrators, can be auto-generated or manually added.
-- ================================================================================================
CREATE TABLE `admin_tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('pending', 'in_progress', 'completed', 'archived') NOT NULL DEFAULT 'pending',
  `priority` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
  `assigned_to_admin_id` CHAR(36) COMMENT 'Admin responsible for the task',
  `created_by_admin_id` CHAR(36) COMMENT 'Admin who created the task (or system)',
  `due_date` DATETIME COMMENT 'When the task should be completed by',
  `related_entity_type` VARCHAR(50) COMMENT 'e.g., Report, UserVerification',
  `related_entity_id` VARCHAR(36) COMMENT 'ID of the related entity',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assigned_to_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`created_by_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_admin_tasks_assigned_to_admin_id` (`assigned_to_admin_id`),
  INDEX `idx_admin_tasks_status` (`status`),
  INDEX `idx_admin_tasks_priority` (`priority`),
  INDEX `idx_admin_tasks_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Administrative tasks and to-do items.';


-- ================================================================================================
-- Core Platform Settings Table
-- ================================================================================================
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
-- Mock Data Insertion
-- ================================================================================================

-- Users (ensure IDs match UUID format if changing for other tables)
-- For char(36) UUIDs, ensure they are actual UUIDs or properly formatted strings
SET @user_001_id = 'usr_00000000-0000-0000-0000-000000000001';
SET @user_002_id = 'usr_00000000-0000-0000-0000-000000000002';
SET @user_003_id = 'usr_00000000-0000-0000-0000-000000000003';
SET @user_004_id = 'usr_00000000-0000-0000-0000-000000000004';
SET @user_005_id = 'usr_00000000-0000-0000-0000-000000000005';
SET @user_006_id = 'usr_00000000-0000-0000-0000-000000000006'; -- Admin User
SET @user_007_id = 'usr_00000000-0000-0000-0000-000000000007'; -- Second Admin
SET @user_008_id = 'usr_00000000-0000-0000-0000-000000000008';
SET @user_009_id = 'usr_00000000-0000-0000-0000-000000000009'; -- SynthMusician
SET @user_010_id = 'usr_00000000-0000-0000-0000-000000000010'; -- PixelPioneer

INSERT INTO `users` (`id`, `email`, `username`, `password_hash`, `avatar_url`, `bio`, `wallet_address`, `role`, `status`) VALUES
(@user_001_id, 'testuser@artnft.com', 'TestUser01', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Just a test user exploring ArtNFT.', '0x123TestWalletAddressForUser01', 'user', 'active'),
(@user_002_id, 'artis_life@artnft.com', 'ArtIsLife', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Creating digital dreams.', '0xABCArtistWalletAddress123', 'user', 'active'),
(@user_003_id, 'collector@artnft.com', 'NFTCollectorGal', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Collecting rare and unique NFTs.', NULL, 'user', 'active'),
(@user_004_id, 'gallery@artnft.com', 'CryptoGallery', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Curating the future of digital art.', '0xXYZGalleryWalletAddress789', 'user', 'active'),
(@user_005_id, 'creatorpro@artnft.com', 'DigitalCreatorPro', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Professional digital artist.', NULL, 'user', 'suspended'),
(@user_006_id, 'admin@artnft.com', 'AdminUser01', '$2a$10$V9gqXv5K5e4fP3n2w0B.q.R2XqI/Zk6k7oJ9H0D9yB7pL4s1WdEaK', 'https://placehold.co/100x100.png', 'Platform Administrator.', NULL, 'admin', 'active'), -- pass: adminpass
(@user_007_id, 'admin2@artnft.com', 'AdminUser02', '$2a$10$V9gqXv5K5e4fP3n2w0B.q.R2XqI/Zk6k7oJ9H0D9yB7pL4s1WdEaK', 'https://placehold.co/100x100.png', 'Secondary Platform Administrator.', NULL, 'admin', 'active'), -- pass: adminpass
(@user_008_id, 'viewer@artnft.com', 'ArtViewer22', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Enthusiast of digital arts.', NULL, 'user', 'active'),
(@user_009_id, 'synth@artnft.com', 'SynthMusician', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Making beats for the metaverse.', '0xMusicWallet123', 'user', 'active'),
(@user_010_id, 'pixel@artnft.com', 'PixelPioneer', '$2a$10$GISM5x9Bw9f0xN3u0p7hF.ziz70DOX0sL5A0y7cR9Rj7P8k3xQ8vG', 'https://placehold.co/100x100.png', 'Retro vibes, modern art.', '0xPixelWallet456', 'user', 'pending_verification');

-- Categories (ensure IDs match UUID format)
SET @cat_digital_art_id = 'cat_00000000-0000-0000-0000-CATEGORY0001';
SET @cat_photography_id = 'cat_00000000-0000-0000-0000-CATEGORY0002';
SET @cat_music_id = 'cat_00000000-0000-0000-0000-CATEGORY0003';
SET @cat_collectibles_id = 'cat_00000000-0000-0000-0000-CATEGORY0004';
SET @cat_virtual_worlds_id = 'cat_00000000-0000-0000-0000-CATEGORY0005';
SET @cat_utility_tokens_id = 'cat_00000000-0000-0000-0000-CATEGORY0006';
SET @cat_generative_art_id = 'cat_00000000-0000-0000-0000-CATEGORY0007';
SET @cat_pixel_art_id = 'cat_00000000-0000-0000-0000-CATEGORY0008';

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`) VALUES
(@cat_digital_art_id, 'Digital Art', 'digital-art', 'Creations made with digital technologies.', 'Palette'),
(@cat_photography_id, 'Photography', 'photography', 'Art captured through the lens.', 'Camera'),
(@cat_music_id, 'Music', 'music', 'Audio NFTs and music-related collectibles.', 'Music2'),
(@cat_collectibles_id, 'Collectibles', 'collectibles', 'Unique digital items and memorabilia.', 'ToyBrick'),
(@cat_virtual_worlds_id, 'Virtual Worlds', 'virtual-worlds', 'Assets for virtual environments.', 'Globe'),
(@cat_utility_tokens_id, 'Utility Tokens', 'utility-tokens', 'NFTs with specific functionalities.', 'Bitcoin'),
(@cat_generative_art_id, 'Generative Art', 'generative-art', 'Art created using autonomous systems.', 'Sparkles'),
(@cat_pixel_art_id, 'Pixel Art', 'pixel-art', 'Digital art created on the pixel level.', 'Grid');

-- Collections
INSERT INTO `collections` (`user_id`, `name`, `slug`, `description`, `cover_image_url`) VALUES
(@user_001_id, 'My First Collection', 'my-first-collection-testuser01', 'A collection of my initial creations.', 'https://placehold.co/600x300.png'),
(@user_002_id, 'Dreamscapes', 'dreamscapes-artislife', 'Exploring the surreal and ethereal.', 'https://placehold.co/600x300.png'),
(@user_010_id, 'Pixel Perfect Picks', 'pixel-perfect-picks-pixelpioneer', 'A curated set of my best pixel art.', 'https://placehold.co/600x300.png'),
(@user_005_id, 'Cybernetic Visions', 'cybernetic-visions-creatorpro', 'Futuristic 3D models and concepts.', 'https://placehold.co/600x300.png');
SET @col_testuser01_id = LAST_INSERT_ID() - 3; -- Assuming these are IDs 1, 2, 3, 4 if auto-increment starts at 1
SET @col_artislife_id = LAST_INSERT_ID() - 2;
SET @col_pixelpioneer_id = LAST_INSERT_ID() -1;
SET @col_creatorpro_id = LAST_INSERT_ID();

-- NFTs (ensure IDs match UUID format)
SET @nft_001_id = 'nft_00000000-0000-0000-0000-MOCK00000001';
SET @nft_002_id = 'nft_00000000-0000-0000-0000-MOCK00000002';
SET @nft_003_id = 'nft_00000000-0000-0000-0000-MOCK00000003';
SET @nft_004_id = 'nft_00000000-0000-0000-0000-MOCK00000004';
SET @nft_005_id = 'nft_00000000-0000-0000-0000-MOCK00000005';
SET @nft_006_id = 'nft_00000000-0000-0000-0000-MOCK00000006';
SET @nft_007_id = 'nft_00000000-0000-0000-0000-MOCK00000007';
SET @nft_008_id = 'nft_00000000-0000-0000-0000-MOCK00000008';
SET @nft_009_id = 'nft_00000000-0000-0000-0000-MOCK00000009';
SET @nft_010_id = 'nft_00000000-0000-0000-0000-MOCK00000010';
SET @nft_011_id = 'nft_00000000-0000-0000-0000-MOCK00000011';
SET @nft_012_id = 'nft_00000000-0000-0000-0000-MOCK00000012';
SET @nft_013_id = 'nft_00000000-0000-0000-0000-MOCK00000013';
SET @nft_014_id = 'nft_00000000-0000-0000-0000-MOCK00000014';
SET @nft_015_id = 'nft_00000000-0000-0000-0000-MOCK00000015';
SET @nft_016_id = 'nft_00000000-0000-0000-0000-MOCK00000016';
SET @nft_017_id = 'nft_00000000-0000-0000-0000-MOCK00000017';
SET @nft_018_id = 'nft_00000000-0000-0000-0000-MOCK00000018';
SET @nft_019_id = 'nft_00000000-0000-0000-0000-MOCK00000019';
SET @nft_020_id = 'nft_00000000-0000-0000-0000-MOCK00000020';
SET @nft_021_id = 'nft_00000000-0000-0000-0000-MOCK00000021';
SET @nft_022_id = 'nft_00000000-0000-0000-0000-MOCK00000022';
SET @nft_023_id = 'nft_00000000-0000-0000-0000-MOCK00000023';
SET @nft_024_id = 'nft_00000000-0000-0000-0000-MOCK00000024';
SET @nft_025_id = 'nft_00000000-0000-0000-0000-MOCK00000025';

INSERT INTO `nfts` (`id`, `creator_id`, `owner_id`, `category_id`, `collection_id`, `title`, `description`, `image_url`, `price_eth`, `status`, `is_auction`, `auction_ends_at`, `tags`) VALUES
(@nft_001_id, @user_001_id, @user_001_id, @cat_digital_art_id, @col_testuser01_id, 'My First Abstract', 'An exploration of color and form.', 'https://placehold.co/400x400.png', 0.5, 'listed', FALSE, NULL, '["abstract", "colorful", "digital"]'),
(@nft_002_id, @user_001_id, @user_001_id, @cat_pixel_art_id, @col_testuser01_id, 'Pixel Pal', 'A friendly pixel character.', 'https://placehold.co/400x400.png', 0.2, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 3 DAY), '["pixel art", "character", "cute"]'),
(@nft_003_id, @user_002_id, @user_002_id, @cat_digital_art_id, @col_artislife_id, 'Dream Weaver #1', 'Journey into a surreal landscape.', 'https://placehold.co/400x400.png', 1.2, 'listed', FALSE, NULL, '["surreal", "dream", "landscape"]'),
(@nft_004_id, @user_002_id, @user_002_id, @cat_photography_id, @col_artislife_id, 'Ephemeral Light', 'A moment of light captured.', 'https://placehold.co/400x400.png', 0.8, 'listed', FALSE, NULL, '["light", "abstract photo", "moody"]'),
(@nft_005_id, @user_002_id, @user_003_id, @cat_digital_art_id, @col_artislife_id, 'Dream Weaver #2', 'Another piece from the Dream Weaver series.', 'https://placehold.co/400x400.png', 1.5, 'sold', FALSE, NULL, '["surreal", "dream", "landscape"]'),
(@nft_006_id, @user_003_id, @user_003_id, @cat_collectibles_id, NULL, 'Vintage Robot', 'A classic tin robot model.', 'https://placehold.co/400x400.png', 0.75, 'listed', FALSE, NULL, '["robot", "vintage", "collectible"]'),
(@nft_007_id, @user_005_id, @user_005_id, @cat_digital_art_id, @col_creatorpro_id, 'Cybernetic Orb', 'A futuristic 3D orb design.', 'https://placehold.co/400x400.png', 2.0, 'listed', FALSE, NULL, '["cyberpunk", "3d", "orb", "sci-fi"]'),
(@nft_008_id, @user_005_id, @user_005_id, @cat_digital_art_id, @col_creatorpro_id, 'Mech Suit Alpha', 'Concept art for a mech suit.', 'https://placehold.co/400x400.png', 3.5, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 5 DAY), '["mech", "sci-fi", "concept art", "3d model"]'),
(@nft_009_id, @user_009_id, @user_009_id, @cat_music_id, NULL, 'Retro Wave Loop', 'A synthwave audio loop.', 'https://placehold.co/400x400.png', 0.4, 'listed', FALSE, NULL, '["music", "synthwave", "loop", "80s"]'),
(@nft_010_id, @user_009_id, @user_009_id, @cat_music_id, NULL, '80s Nostalgia Beat', 'An instrumental beat with an 80s vibe.', 'https://placehold.co/400x400.png', 0.6, 'listed', FALSE, NULL, '["music", "beat", "instrumental", "80s", "nostalgia"]'),
(@nft_011_id, @user_010_id, @user_001_id, @cat_pixel_art_id, @col_pixelpioneer_id, 'Pixel Knight #001', 'The first knight in the pixel series.', 'https://placehold.co/400x400.png', 0.3, 'sold', FALSE, NULL, '["pixel art", "knight", "character", "fantasy"]'),
(@nft_012_id, @user_010_id, @user_010_id, @cat_pixel_art_id, @col_pixelpioneer_id, 'Pixel Forest Scene', 'A serene forest rendered in pixel art.', 'https://placehold.co/400x400.png', 0.5, 'listed', FALSE, NULL, '["pixel art", "landscape", "forest", "nature"]'),
(@nft_013_id, @user_010_id, @user_010_id, @cat_pixel_art_id, @col_pixelpioneer_id, 'Pixel Dragonling', 'A small, cute pixel dragon.', 'https://placehold.co/400x400.png', 0.7, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 2 DAY), '["pixel art", "dragon", "cute", "fantasy"]'),
(@nft_014_id, @user_004_id, @user_004_id, @cat_generative_art_id, NULL, 'Generative Swirls #7', 'Unique patterns generated by code.', 'https://placehold.co/400x400.png', 1.0, 'listed', FALSE, NULL, '["generative", "abstract", "code art", "patterns"]'),
(@nft_015_id, @user_008_id, @user_008_id, @cat_photography_id, NULL, 'Mountain Vista Photo', 'A stunning mountain landscape.', 'https://placehold.co/400x400.png', 0.9, 'listed', FALSE, NULL, '["photography", "landscape", "mountains", "nature"]'),
(@nft_016_id, @user_001_id, @user_001_id, @cat_utility_tokens_id, NULL, 'VR Gallery Access Key', 'Grants access to a private VR gallery.', 'https://placehold.co/400x400.png', 2.5, 'listed', FALSE, NULL, '["utility", "vr", "access key", "metaverse"]'),
(@nft_017_id, @user_002_id, @user_002_id, @cat_virtual_worlds_id, @col_artislife_id, 'Lost Temple - Game Asset', 'A 3D model of a temple for game development.', 'https://placehold.co/400x400.png', 1.8, 'listed', FALSE, NULL, '["3d model", "game asset", "virtual world", "temple"]'),
(@nft_018_id, @user_002_id, @user_002_id, @cat_digital_art_id, @col_artislife_id, 'Cosmic Abstract #42', 'Abstract representation of cosmic energy.', 'https://placehold.co/400x400.png', 0.65, 'hidden', FALSE, NULL, '["abstract", "cosmic", "space", "digital"]'),
(@nft_019_id, @user_010_id, @user_010_id, @cat_pixel_art_id, @col_pixelpioneer_id, 'Pixel Mage Character', 'A powerful mage in pixel form.', 'https://placehold.co/400x400.png', 0.4, 'listed', FALSE, NULL, '["pixel art", "mage", "character", "fantasy"]'),
(@nft_020_id, @user_008_id, @user_008_id, @cat_photography_id, NULL, 'Serene Lake Photograph', 'Calm waters reflecting the sky.', 'https://placehold.co/400x400.png', 0.7, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 4 DAY), '["photography", "lake", "nature", "serene"]'),
(@nft_021_id, @user_009_id, @user_009_id, @cat_music_id, NULL, 'Chillhop Beat "Sunset"', 'A relaxing chillhop track.', 'https://placehold.co/400x400.png', 0.25, 'listed', FALSE, NULL, '["music", "chillhop", "beat", "lofi", "instrumental"]'),
(@nft_022_id, @user_005_id, @user_005_id, @cat_digital_art_id, @col_creatorpro_id, 'Cyberpunk Alleyway 3D', 'A detailed cyberpunk scene.', 'https://placehold.co/400x400.png', 2.2, 'listed', FALSE, NULL, '["cyberpunk", "3d", "cityscape", "sci-fi"]'),
(@nft_023_id, @user_004_id, @user_004_id, @cat_generative_art_id, NULL, 'Generative Patterns Alpha', 'Early explorations in generative patterns.', 'https://placehold.co/400x400.png', 0.9, 'draft', FALSE, NULL, '["generative", "patterns", "abstract", "code art"]'),
(@nft_024_id, @user_001_id, @user_001_id, @cat_utility_tokens_id, NULL, 'Utility Key - Beta Access', 'Get beta access to our new game.', 'https://placehold.co/400x400.png', 1.1, 'pending_moderation', FALSE, NULL, '["utility", "beta access", "game key"]'),
(@nft_025_id, @user_003_id, @user_003_id, @cat_collectibles_id, NULL, 'Collectible Card #007', 'A rare collectible trading card.', 'https://placehold.co/400x400.png', 0.35, 'listed', FALSE, NULL, '["collectible", "card", "trading card", "rare"]');

-- Bids
INSERT INTO `bids` (`nft_id`, `user_id`, `bid_amount_eth`, `status`) VALUES
(@nft_002_id, @user_003_id, 0.25, 'outbid'), -- NFTCollectorGal bids on Pixel Pal
(@nft_002_id, @user_004_id, 0.30, 'winning'), -- CryptoGallery outbids on Pixel Pal
(@nft_008_id, @user_001_id, 3.6, 'winning'), -- TestUser01 bids on Mech Suit Alpha
(@nft_013_id, @user_001_id, 0.75, 'winning'); -- TestUser01 bids on Pixel Dragonling

-- Favorites
INSERT INTO `favorites` (`user_id`, `nft_id`) VALUES
(@user_001_id, @nft_003_id), -- TestUser01 favorites Dream Weaver #1
(@user_001_id, @nft_007_id), -- TestUser01 favorites Cybernetic Orb
(@user_002_id, @nft_001_id), -- ArtIsLife favorites My First Abstract
(@user_003_id, @nft_002_id); -- NFTCollectorGal favorites Pixel Pal

-- Transactions
INSERT INTO `transactions` (`nft_id`, `buyer_id`, `seller_id`, `type`, `amount_eth`, `status`) VALUES
(@nft_005_id, @user_003_id, @user_002_id, 'sale', 1.5, 'completed'), -- Dream Weaver #2 sold to NFTCollectorGal
(@nft_011_id, @user_001_id, @user_010_id, 'sale', 0.3, 'completed'); -- Pixel Knight #001 sold to TestUser01

-- User Follows
INSERT INTO `user_follows` (`follower_id`, `followed_id`) VALUES
(@user_001_id, @user_002_id), -- TestUser01 follows ArtIsLife
(@user_001_id, @user_010_id), -- TestUser01 follows PixelPioneer
(@user_002_id, @user_001_id), -- ArtIsLife follows TestUser01
(@user_003_id, @user_002_id); -- NFTCollectorGal follows ArtIsLife

-- User Notification Preferences (ensure IDs match UUID format)
SET @pref_user001_id = 'pref_00000000-0000-0000-0000-PREF00000001';
SET @pref_user002_id = 'pref_00000000-0000-0000-0000-PREF00000002';

INSERT INTO `user_notification_preferences` (`id`, `user_id`, `email_new_bid`, `email_auction_won`, `email_nft_sold`, `email_platform_updates`, `in_app_new_bid`) VALUES
(@pref_user001_id, @user_001_id, TRUE, TRUE, TRUE, FALSE, TRUE),
(@pref_user002_id, @user_002_id, TRUE, FALSE, TRUE, TRUE, TRUE);

-- Platform Settings
INSERT INTO `platform_settings` (`setting_key`, `setting_value`, `description`, `type`) VALUES
('site_name', 'ArtNFT Marketplace', 'The official name of the platform.', 'string'),
('maintenance_mode', 'false', 'Set to true to enable maintenance mode.', 'boolean'),
('default_royalty_percentage', '5.0', 'Default royalty percentage for new NFTs.', 'number'),
('theme_colors', '{"primary": "#3B69CC", "accent": "#FF66B3"}', 'Platform theme colors.', 'json');

-- Notifications (ensure IDs match UUID format)
SET @notif_001_id = 'notif_00000000-0000-0000-0000-NOTIF000001';
SET @notif_002_id = 'notif_00000000-0000-0000-0000-NOTIF000002';
SET @notif_003_id = 'notif_00000000-0000-0000-0000-NOTIF000003';

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `related_entity_type`, `related_entity_id`) VALUES
(@notif_001_id, @user_001_id, 'new_nft_from_followed_artist', 'New Art from ArtIsLife!', 'ArtIsLife just listed "Ephemeral Light".', 'NFT', @nft_004_id),
(@notif_002_id, @user_002_id, 'new_bid', 'New Bid on "Dream Weaver #1"', 'TestUser01 placed a bid of 1.3 ETH.', 'NFT', @nft_003_id), -- Hypothetical bid if it were on auction
(@notif_003_id, @user_001_id, 'auction_ending_soon', 'Auction for "Pixel Pal" ending soon!', 'Your auction for Pixel Pal is ending in less than 24 hours.', 'NFT', @nft_002_id);

-- Admin Audit Log Example
INSERT INTO `admin_audit_log` (`admin_user_id`, `action_type`, `target_entity_type`, `target_entity_id`, `details`) VALUES
(@user_006_id, 'USER_STATUS_CHANGED', 'User', @user_005_id, '{"old_status": "active", "new_status": "suspended", "reason": "Violation of platform policy."}');

-- Reports Example
INSERT INTO `reports` (`reported_by_user_id`, `content_type`, `content_id`, `reason`, `details`, `status`) VALUES
(@user_001_id, 'nft', @nft_007_id, 'Suspected copyright infringement', 'This artwork looks very similar to another artist''s work.', 'pending_review');
    
-- Admin Tasks Example
INSERT INTO `admin_tasks` (`title`, `description`, `status`, `priority`, `assigned_to_admin_id`, `related_entity_type`, `related_entity_id`) VALUES
('Review Reported NFT', 'Investigate copyright claim for NFT ID: ' || @nft_007_id, 'pending', 'high', @user_007_id, 'Report', (SELECT id FROM reports WHERE content_id = @nft_007_id LIMIT 1));

COMMIT;
    
    