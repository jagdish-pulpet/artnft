
-- ArtNFT Marketplace Database Schema
-- Version 1.3 - Enhanced with more tables and comprehensive mock data

-- Drop existing tables in reverse order of dependency to avoid foreign key errors
DROP TABLE IF EXISTS `api_keys`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `login_attempts`;
DROP TABLE IF EXISTS `moderation_actions`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `nft_history`;
DROP TABLE IF EXISTS `user_social_links`;
DROP TABLE IF EXISTS `user_wallets`;
DROP TABLE IF EXISTS `admin_tasks`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `admin_audit_log`;
DROP TABLE IF EXISTS `user_notification_preferences`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `promotions`;
DROP TABLE IF EXISTS `user_follows`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `bids`;
DROP TABLE IF EXISTS `nft_tags`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `nft_attributes`;
DROP TABLE IF EXISTS `nfts`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `platform_settings`;
DROP TABLE IF EXISTS `users`;


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
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  COMMENT 'Stores global configuration settings for the platform, manageable by admins.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Users Table
-- ================================================================================================
CREATE TABLE `users` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique user identification (e.g., usr_uuid)',
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT 'User''s email address, used for login and notifications',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password for security',
  `username` VARCHAR(100) UNIQUE COMMENT 'Optional unique username for display and profile URL',
  `avatar_url` VARCHAR(2048) COMMENT 'URL to the user''s profile picture',
  `profile_banner_url` VARCHAR(2048) COMMENT 'URL for user''s profile banner image',
  `bio` TEXT COMMENT 'A short biography or description about the user',
  `location` VARCHAR(255) COMMENT 'User''s stated location',
  `website_url` VARCHAR(2048) COMMENT 'User''s personal or portfolio website URL',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT 'User''s role on the platform (user or administrator)',
  `is_verified_artist` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Flag indicating if the user is verified as an artist',
  `status` ENUM('active', 'suspended', 'pending_verification', 'deactivated') NOT NULL DEFAULT 'active' COMMENT 'Account status',
  `last_login_at` TIMESTAMP NULL COMMENT 'Timestamp of the user''s last login',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of account creation',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp of last profile update',
  KEY `IX_users_email` (`email`),
  KEY `IX_users_username` (`username`),
  KEY `IX_users_status` (`status`),
  COMMENT 'Stores information about all registered users and administrators.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- User Social Links Table
-- ================================================================================================
CREATE TABLE `user_social_links` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique social link identification',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing users.id',
  `platform` VARCHAR(50) NOT NULL COMMENT 'Social media platform (e.g., Twitter, Instagram, GitHub)',
  `url` VARCHAR(2048) NOT NULL COMMENT 'URL to the user''s profile on the social platform',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_user_social_links_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `UQ_user_platform` (`user_id`, `platform`),
  COMMENT 'Stores social media links for user profiles.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- User Wallets Table (if users can link multiple wallets)
-- ================================================================================================
CREATE TABLE `user_wallets` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique wallet link identification',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing users.id',
  `wallet_address` VARCHAR(42) UNIQUE NOT NULL COMMENT 'Cryptocurrency wallet address (e.g., Ethereum address)',
  `blockchain` VARCHAR(50) NOT NULL DEFAULT 'Ethereum' COMMENT 'Blockchain the wallet belongs to',
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indicates if this is the user''s primary wallet',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_user_wallets_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  COMMENT 'Stores multiple cryptocurrency wallets linked by a user.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Categories Table
-- ================================================================================================
CREATE TABLE `categories` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique category identification (e.g., cat_uuid)',
  `name` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Name of the category (e.g., Digital Art)',
  `slug` VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL-friendly version of the name (e.g., digital-art)',
  `description` TEXT COMMENT 'A brief description of the category content',
  `icon` VARCHAR(255) COMMENT 'Optional: Name of a Lucide icon or URL to an image representing the category',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `IX_categories_slug` (`slug`),
  COMMENT 'Defines different categories for grouping NFTs.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Collections Table
-- ================================================================================================
CREATE TABLE `collections` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique collection identification (e.g., col_uuid)',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing users.id, indicating the creator/owner of this collection',
  `name` VARCHAR(255) NOT NULL COMMENT 'Name of the collection, chosen by the user',
  `slug` VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly version of the collection name',
  `description` TEXT COMMENT 'Optional description for the collection',
  `cover_image_url` VARCHAR(2048) COMMENT 'URL for a custom cover image for the collection display',
  `is_public` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Flag indicating if the collection is visible to others',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_collections_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `IX_collections_user_id` (`user_id`),
  KEY `IX_collections_slug` (`slug`),
  COMMENT 'Allows users to group their NFTs into named collections.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Tags Table
-- ================================================================================================
CREATE TABLE `tags` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique tag identification',
  `name` VARCHAR(50) UNIQUE NOT NULL COMMENT 'The tag name (e.g., abstract, pixelart)',
  `slug` VARCHAR(50) UNIQUE NOT NULL COMMENT 'URL-friendly version of the tag name',
  `description` TEXT COMMENT 'Optional description for the tag',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `IX_tags_slug` (`slug`),
  COMMENT 'Stores unique tags that can be applied to NFTs.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- NFTs Table
-- ================================================================================================
CREATE TABLE `nfts` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique NFT identification (e.g., nft_uuid)',
  `title` VARCHAR(255) NOT NULL COMMENT 'Title of the NFT',
  `description` TEXT COMMENT 'Detailed description of the NFT artwork or item',
  `image_url` VARCHAR(2048) NOT NULL COMMENT 'URL to the primary image/media of the NFT (e.g., IPFS, S3)',
  `token_id` VARCHAR(255) COMMENT 'Unique token ID on the blockchain (if applicable)',
  `contract_address` VARCHAR(42) COMMENT 'Blockchain contract address where the NFT is minted',
  `blockchain` VARCHAR(50) DEFAULT 'Ethereum' COMMENT 'The blockchain on which the NFT exists (e.g., Ethereum, Polygon)',
  `metadata_url` VARCHAR(2048) COMMENT 'URL to the NFT''s metadata JSON (often IPFS)',
  `file_type` VARCHAR(50) COMMENT 'Type of the media file (e.g., image/png, video/mp4, audio/mpeg)',
  `file_size_bytes` BIGINT COMMENT 'Size of the media file in bytes',
  `price_eth` DECIMAL(18, 8) COMMENT 'Current price in ETH if for direct sale, or starting bid if an auction',
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'ETH' COMMENT 'Cryptocurrency symbol used for pricing (e.g., ETH, MATIC)',
  `status` ENUM('pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft') NOT NULL DEFAULT 'draft' COMMENT 'Current status of the NFT listing',
  `is_auction` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Flag indicating if the NFT is currently up for auction',
  `auction_ends_at` TIMESTAMP NULL COMMENT 'If is_auction is true, this stores the auction''s scheduled end time',
  `royalty_percentage` DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Percentage of secondary sales to be paid to the creator (e.g., 10.00 for 10%)',
  `is_unlockable_content_enabled` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Flag indicating if there is unlockable content for the owner',
  `unlockable_content_description` TEXT COMMENT 'A public description of what the unlockable content might be',
  `unlockable_content_data` TEXT COMMENT 'The actual unlockable content (e.g., a link, a code, a message) - store encrypted if sensitive',
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Number of times the NFT detail page has been viewed',
  `creator_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing users.id, the original creator of the NFT',
  `owner_id` CHAR(36) NULL COMMENT 'Foreign key referencing users.id, the current owner. Can be NULL if newly minted or still owned by creator.',
  `category_id` CHAR(36) NULL COMMENT 'Foreign key referencing categories.id. If a category is deleted, this becomes NULL.',
  `collection_id` CHAR(36) NULL COMMENT 'Foreign key referencing collections.id. If a collection is deleted, this becomes NULL.',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_nfts_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_nfts_owner_id` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_nfts_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_nfts_collection_id` FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  KEY `IX_nfts_creator_id` (`creator_id`),
  KEY `IX_nfts_owner_id` (`owner_id`),
  KEY `IX_nfts_category_id` (`category_id`),
  KEY `IX_nfts_collection_id` (`collection_id`),
  KEY `IX_nfts_status` (`status`),
  FULLTEXT KEY `FT_nfts_title_description` (`title`, `description`),
  COMMENT 'Core table storing metadata for each Non-Fungible Token listed on the marketplace.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- NFT Attributes Table (for structured traits)
-- ================================================================================================
CREATE TABLE `nft_attributes` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique attribute identification',
  `nft_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing nfts.id',
  `trait_type` VARCHAR(100) NOT NULL COMMENT 'The type of trait (e.g., Background, Eyes, Color)',
  `value` VARCHAR(255) NOT NULL COMMENT 'The value of the trait (e.g., Red, Laser, Blue)',
  `display_type` ENUM('string', 'number', 'date', 'boost_percentage', 'boost_number') DEFAULT 'string' COMMENT 'How this attribute might be displayed or interpreted',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `FK_nft_attributes_nft_id` FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `IX_nft_attributes_nft_id` (`nft_id`),
  KEY `IX_nft_attributes_trait_type_value` (`trait_type`, `value`),
  COMMENT 'Stores structured key-value attributes or traits for NFTs, allowing for detailed filtering.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- NFT Tags (Junction Table)
-- ================================================================================================
CREATE TABLE `nft_tags` (
  `nft_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing nfts.id',
  `tag_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing tags.id',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nft_id`, `tag_id`),
  CONSTRAINT `FK_nft_tags_nft_id` FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_nft_tags_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  COMMENT 'Junction table for the many-to-many relationship between NFTs and Tags.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Bids Table
-- ================================================================================================
CREATE TABLE `bids` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique bid identification (e.g., bid_uuid)',
  `nft_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing nfts.id (the NFT being bid on)',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing users.id (the user who placed the bid)',
  `bid_amount_eth` DECIMAL(18, 8) NOT NULL COMMENT 'The amount of the bid in ETH',
  `bid_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of when the bid was placed',
  `status` ENUM('active', 'outbid', 'won', 'cancelled') NOT NULL DEFAULT 'active' COMMENT 'Status of the bid',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_bids_nft_id` FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bids_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `IX_bids_nft_id_bid_time` (`nft_id`, `bid_time` DESC),
  KEY `IX_bids_user_id` (`user_id`),
  COMMENT 'Records bids placed by users on NFTs that are up for auction.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Favorites Table (Junction Table)
-- ================================================================================================
CREATE TABLE `favorites` (
  `user_id` CHAR(36) NOT NULL COMMENT 'Part of the composite primary key, references users.id',
  `nft_id` CHAR(36) NOT NULL COMMENT 'Part of the composite primary key, references nfts.id',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the NFT was favorited',
  PRIMARY KEY (`user_id`, `nft_id`),
  CONSTRAINT `FK_favorites_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_favorites_nft_id` FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  COMMENT 'Junction table for users to mark their favorite NFTs (many-to-many relationship).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- User Follows Table (Junction Table)
-- ================================================================================================
CREATE TABLE `user_follows` (
  `follower_id` CHAR(36) NOT NULL COMMENT 'User who is following',
  `following_id` CHAR(36) NOT NULL COMMENT 'User who is being followed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`, `following_id`),
  CONSTRAINT `FK_user_follows_follower_id` FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_follows_following_id` FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CHK_user_follows_no_self_follow` CHECK (`follower_id` <> `following_id`),
  COMMENT 'Tracks users following other users (e.g., artists).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Promotions Table
-- ================================================================================================
CREATE TABLE `promotions` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique promotion',
  `promotion_type` ENUM('featured_nft', 'artist_spotlight', 'collection_highlight', 'banner') NOT NULL COMMENT 'Type of promotion',
  `target_id` CHAR(36) COMMENT 'ID of the item being promoted (e.g., nft_id, user_id for artist, collection_id)',
  `title` VARCHAR(255) COMMENT 'Title for the promotion display',
  `description` TEXT COMMENT 'Description or tagline for the promotion',
  `image_url` VARCHAR(2048) COMMENT 'Image URL for the promotion banner/card',
  `cta_link` VARCHAR(2048) COMMENT 'Call-to-action link',
  `cta_text` VARCHAR(100) COMMENT 'Call-to-action button text',
  `start_date` TIMESTAMP NULL COMMENT 'When the promotion becomes active',
  `end_date` TIMESTAMP NULL COMMENT 'When the promotion expires',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `sort_order` INT DEFAULT 0 COMMENT 'Order for displaying multiple promotions',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `IX_promotions_type_active_dates` (`promotion_type`, `is_active`, `start_date`, `end_date`),
  COMMENT 'Manages featured content, artist spotlights, and other platform promotions.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Announcements Table
-- ================================================================================================
CREATE TABLE `announcements` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique announcement',
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `type` ENUM('platform_update', 'community_news', 'event') NOT NULL DEFAULT 'platform_update',
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `published_at` TIMESTAMP NULL,
  `created_by_admin_id` CHAR(36) NULL COMMENT 'Admin user who created the announcement',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_announcements_admin_id` FOREIGN KEY (`created_by_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  KEY `IX_announcements_published_type` (`is_published`, `type`, `published_at` DESC),
  COMMENT 'Stores platform news, updates, and community highlights managed by admins.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Transactions Table
-- ================================================================================================
CREATE TABLE `transactions` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique transaction record',
  `transaction_type` ENUM('sale', 'purchase', 'mint_fee', 'royalty_payment', 'gas_fee', 'platform_fee', 'refund') NOT NULL,
  `nft_id` CHAR(36) NULL COMMENT 'Associated NFT, if applicable',
  `from_user_id` CHAR(36) NULL COMMENT 'User sending funds/NFT',
  `to_user_id` CHAR(36) NULL COMMENT 'User receiving funds/NFT (e.g., seller, artist for royalty)',
  `amount_eth` DECIMAL(18, 8) NOT NULL,
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'ETH',
  `platform_fee_eth` DECIMAL(18, 8) DEFAULT 0.00,
  `royalty_fee_eth` DECIMAL(18, 8) DEFAULT 0.00,
  `blockchain_transaction_hash` VARCHAR(255) UNIQUE COMMENT 'Hash of the on-chain transaction, if applicable',
  `status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `notes` TEXT COMMENT 'Additional notes about the transaction',
  `transaction_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_transactions_nft_id` FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_transactions_from_user_id` FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_transactions_to_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  KEY `IX_transactions_user_nft_type` (`from_user_id`, `to_user_id`, `nft_id`, `transaction_type`),
  KEY `IX_transactions_blockchain_hash` (`blockchain_transaction_hash`),
  COMMENT 'Logs financial transactions like sales, purchases, fees, and royalties.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Notifications Table
-- ================================================================================================
CREATE TABLE `notifications` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique notification',
  `user_id` CHAR(36) NOT NULL COMMENT 'User to whom the notification is addressed',
  `notification_type` ENUM('new_listing_followed_artist', 'price_drop_favorited', 'auction_ending_soon', 'bid_outbid', 'bid_won', 'sale_successful', 'new_follower', 'comment_reply', 'system_update', 'admin_message') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `related_entity_type` ENUM('nft', 'user', 'collection', 'url') NULL,
  `related_entity_id` VARCHAR(255) NULL COMMENT 'ID of the related NFT, User, Collection, or a URL path',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `read_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `FK_notifications_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `IX_notifications_user_read_created` (`user_id`, `is_read`, `created_at` DESC),
  COMMENT 'Stores notifications for users about platform activities and events.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- User Notification Preferences Table
-- ================================================================================================
CREATE TABLE `user_notification_preferences` (
  `user_id` CHAR(36) PRIMARY KEY NOT NULL,
  `email_new_listing_followed_artist` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_price_drop_favorited` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_auction_ending_soon` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_bid_outbid` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_bid_won` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_sale_successful` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_new_follower` BOOLEAN NOT NULL DEFAULT FALSE,
  `email_comment_reply` BOOLEAN NOT NULL DEFAULT FALSE,
  `email_system_update` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_new_listing_followed_artist` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_price_drop_favorited` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_auction_ending_soon` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_bid_outbid` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_bid_won` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_sale_successful` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_new_follower` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_comment_reply` BOOLEAN NOT NULL DEFAULT TRUE,
  `app_system_update` BOOLEAN NOT NULL DEFAULT TRUE,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_user_notification_preferences_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  COMMENT 'Allows users to customize their notification settings for different event types and channels (email/app).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Admin Audit Log Table
-- ================================================================================================
CREATE TABLE `admin_audit_log` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique audit log entry',
  `admin_user_id` CHAR(36) NOT NULL COMMENT 'Admin user who performed the action',
  `action_type` VARCHAR(100) NOT NULL COMMENT 'e.g., USER_SUSPENDED, NFT_HIDDEN, CATEGORY_CREATED',
  `target_entity_type` VARCHAR(50) COMMENT 'e.g., User, NFT, Category',
  `target_entity_id` VARCHAR(255) COMMENT 'ID of the entity affected by the action',
  `description` TEXT COMMENT 'Detailed description of the action performed',
  `ip_address` VARCHAR(45) COMMENT 'IP address of the admin when performing action',
  `user_agent` TEXT COMMENT 'User agent string of the admin''s browser/client',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `FK_admin_audit_log_admin_user_id` FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  KEY `IX_admin_audit_log_admin_action_time` (`admin_user_id`, `action_type`, `created_at` DESC),
  KEY `IX_admin_audit_log_target` (`target_entity_type`, `target_entity_id`),
  COMMENT 'Tracks significant actions performed by administrators in the admin panel.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Reports Table (for content/user reporting)
-- ================================================================================================
CREATE TABLE `reports` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique report',
  `reporter_user_id` CHAR(36) NOT NULL COMMENT 'User who submitted the report',
  `reported_entity_type` ENUM('nft', 'user', 'collection', 'comment') NOT NULL COMMENT 'Type of entity being reported',
  `reported_entity_id` CHAR(36) NOT NULL COMMENT 'ID of the NFT, User, Collection, or Comment being reported',
  `reason_category` VARCHAR(100) NOT NULL COMMENT 'Predefined category of report (e.g., Spam, Inappropriate, Copyright)',
  `reason_details` TEXT COMMENT 'Additional details provided by the reporter',
  `status` ENUM('pending_review', 'under_investigation', 'action_taken', 'dismissed') NOT NULL DEFAULT 'pending_review',
  `admin_reviewer_id` CHAR(36) NULL COMMENT 'Admin who reviewed/is reviewing the report',
  `review_notes` TEXT COMMENT 'Notes from the admin reviewer',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_reports_reporter_user_id` FOREIGN KEY (`reporter_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_reports_admin_reviewer_id` FOREIGN KEY (`admin_reviewer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  KEY `IX_reports_status_created` (`status`, `created_at` DESC),
  KEY `IX_reports_reported_entity` (`reported_entity_type`, `reported_entity_id`),
  COMMENT 'Stores user-submitted reports against content or other users, for admin moderation.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Admin Tasks Table
-- ================================================================================================
CREATE TABLE `admin_tasks` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique admin task',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `assigned_to_admin_id` CHAR(36) NULL COMMENT 'Admin user this task is assigned to',
  `priority` ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Blocked') NOT NULL DEFAULT 'Pending',
  `due_date` DATE NULL,
  `related_entity_type` VARCHAR(50) COMMENT 'e.g., Report, User, NFT',
  `related_entity_id` VARCHAR(255) COMMENT 'ID of the entity related to this task',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_admin_tasks_assigned_to_admin_id` FOREIGN KEY (`assigned_to_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  KEY `IX_admin_tasks_status_priority_due` (`status`, `priority`, `due_date`),
  COMMENT 'Allows administrators to manage internal tasks and assignments.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- NFT History Table
-- ================================================================================================
CREATE TABLE `nft_history` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique history event',
  `nft_id` CHAR(36) NOT NULL COMMENT 'Foreign key referencing nfts.id',
  `event_type` ENUM('minted', 'listed', 'delisted', 'price_changed', 'bid_placed', 'bid_accepted', 'sold', 'transferred', 'auction_started', 'auction_ended') NOT NULL,
  `user_id` CHAR(36) NULL COMMENT 'User associated with the event (e.g., minter, seller, buyer, bidder)',
  `details` JSON COMMENT 'JSON object containing event-specific details (e.g., price, bid amount, to/from addresses for transfer)',
  `event_timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `FK_nft_history_nft_id` FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_nft_history_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  KEY `IX_nft_history_nft_id_timestamp` (`nft_id`, `event_timestamp` DESC),
  COMMENT 'Tracks significant events in the lifecycle of an NFT for provenance.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Comments Table
-- ================================================================================================
CREATE TABLE `comments` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique comment',
  `nft_id` CHAR(36) NOT NULL COMMENT 'NFT the comment is associated with',
  `user_id` CHAR(36) NOT NULL COMMENT 'User who wrote the comment',
  `parent_comment_id` CHAR(36) NULL COMMENT 'If this is a reply, references the parent comment''s id',
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_comments_nft_id` FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comments_parent_comment_id` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `IX_comments_nft_id_created` (`nft_id`, `created_at` DESC),
  COMMENT 'Stores user comments on NFTs, supporting threaded replies.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Login Attempts Table
-- ================================================================================================
CREATE TABLE `login_attempts` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY NOT NULL COMMENT 'Auto-incrementing ID for log entry',
  `email_attempted` VARCHAR(255) COMMENT 'Email address used in the login attempt',
  `user_id_attempted` CHAR(36) NULL COMMENT 'User ID if email matched an account',
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` TEXT,
  `is_successful` BOOLEAN NOT NULL,
  `attempt_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `IX_login_attempts_email_time` (`email_attempted`, `attempt_time` DESC),
  KEY `IX_login_attempts_ip_time` (`ip_address`, `attempt_time` DESC),
  COMMENT 'Logs login attempts for security monitoring (e.g., rate limiting, brute-force detection).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- Password Resets Table
-- ================================================================================================
CREATE TABLE `password_resets` (
  `email` VARCHAR(255) PRIMARY KEY NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `token_expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `IX_password_resets_token` (`token`),
  COMMENT 'Stores tokens for password reset requests.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================================
-- API Keys Table (for external API access if offered)
-- ================================================================================================
CREATE TABLE `api_keys` (
  `id` CHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for unique API key record',
  `user_id` CHAR(36) NOT NULL COMMENT 'User to whom this API key belongs',
  `key_hash` VARCHAR(255) UNIQUE NOT NULL COMMENT 'Hashed version of the API key',
  `prefix` VARCHAR(8) UNIQUE NOT NULL COMMENT 'Short non-secret prefix of the key for identification',
  `label` VARCHAR(100) COMMENT 'User-defined label for the API key',
  `scopes` JSON COMMENT 'JSON array of permissions/scopes granted to this key',
  `last_used_at` TIMESTAMP NULL,
  `expires_at` TIMESTAMP NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_api_keys_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  COMMENT 'Stores API keys for users or third-party services if the platform offers an API.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================================
-- MOCK DATA INSERTION
-- ================================================================================================

-- Generate UUIDs for mock data for easier referencing. In a real app, these are generated by the app.
SET @user_001_id = 'usr_00000000-0000-0000-0000-000000000001';
SET @user_002_id = 'usr_00000000-0000-0000-0000-000000000002';
SET @user_003_id = 'usr_00000000-0000-0000-0000-000000000003';
SET @user_004_id = 'usr_00000000-0000-0000-0000-000000000004';
SET @user_005_id = 'usr_00000000-0000-0000-0000-000000000005';
SET @user_006_id = 'usr_00000000-0000-0000-0000-000000000006';
SET @user_007_id = 'usr_00000000-0000-0000-0000-000000000007';
SET @user_008_id = 'usr_00000000-0000-0000-0000-000000000008';
SET @user_009_id = 'usr_00000000-0000-0000-0000-000000000009';
SET @user_010_id = 'usr_00000000-0000-0000-0000-000000000010';
SET @admin_user_id_001 = 'usr_00000000-0000-0000-0000-000000000ADMIN';

SET @cat_digital_art_id = 'cat_00000000-0000-0000-0000-000000000DA1';
SET @cat_photography_id = 'cat_00000000-0000-0000-0000-000000000PH2';
SET @cat_music_id = 'cat_00000000-0000-0000-0000-000000000MU3';
SET @cat_collectibles_id = 'cat_00000000-0000-0000-0000-000000000CO4';
SET @cat_virtual_worlds_id = 'cat_00000000-0000-0000-0000-000000000VW5';
SET @cat_utility_tokens_id = 'cat_00000000-0000-0000-0000-000000000UT6';
SET @cat_generative_art_id = 'cat_00000000-0000-0000-0000-000000000GA7';
SET @cat_pixel_art_id = 'cat_00000000-0000-0000-0000-000000000PA8';

SET @tag_abstract_id = 'tag_00000000-0000-0000-0000-ABSTRACT0001';
SET @tag_pixel_id = 'tag_00000000-0000-0000-0000-PIXELART0002';
SET @tag_landscape_id = 'tag_00000000-0000-0000-0000-LANDSCAPE003';
SET @tag_music_id = 'tag_00000000-0000-0000-0000-MUSIC0000004';
SET @tag_collectible_id = 'tag_00000000-0000-0000-0000-COLLECTIBLE5';
SET @tag_3d_id = 'tag_00000000-0000-0000-0000-THREED000006';
SET @tag_retro_id = 'tag_00000000-0000-0000-0000-RETRO0000007';
SET @tag_sci_fi_id = 'tag_00000000-0000-0000-0000-SCIFI0000008';
SET @tag_fantasy_id = 'tag_00000000-0000-0000-0000-FANTASY00009';
SET @tag_utility_id = 'tag_00000000-0000-0000-0000-UTILITY00010';


-- Mock Platform Settings
INSERT INTO `platform_settings` (`setting_key`, `setting_value`, `description`, `type`, `is_public`) VALUES
('site_name', 'ArtNFT Marketplace', 'The official name of the platform.', 'string', TRUE),
('site_tagline', 'Discover, Create, and Trade Digital Art & NFTs', 'The main tagline for the platform.', 'string', TRUE),
('maintenance_mode', 'false', 'Set to "true" to enable maintenance mode for the main site.', 'boolean', TRUE),
('default_listing_duration_days', '30', 'Default duration for new NFT listings (if applicable).', 'number', FALSE),
('max_royalty_percentage', '25.00', 'Maximum royalty percentage an artist can set.', 'number', TRUE),
('allow_user_to_user_messaging', 'false', 'Enable or disable direct user-to-user messaging feature.', 'boolean', TRUE),
('platform_contact_email', 'support@artnft.com', 'Official support email address.', 'string', TRUE);

-- Mock Users (hashed passwords for 'password123' and 'adminpass')
-- testuser@artnft.com / password123
INSERT INTO `users` (`id`, `email`, `password_hash`, `username`, `avatar_url`, `bio`, `location`, `website_url`, `profile_banner_url`, `role`, `is_verified_artist`, `status`) VALUES
(@user_001_id, 'testuser@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'TestUser01', 'https://placehold.co/100x100.png', 'Just a test user exploring ArtNFT.', 'Metaverse City', 'https://artnft.com/testuser01', 'https://placehold.co/1500x500.png', 'user', FALSE, 'active'),
-- artist@artnft.com / password123
(@user_002_id, 'artist@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'ArtIsLife', 'https://placehold.co/100x100.png', 'Creating digital dreams and exploring new artistic frontiers. Verified Artist.', 'New York, USA', 'https://artislife.example.com', 'https://placehold.co/1500x500.png', 'user', TRUE, 'active'),
-- collector@artnft.com / password123
(@user_003_id, 'collector@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'NFTCollectorGal', 'https://placehold.co/100x100.png', 'Passionate about collecting unique and rare digital art pieces.', 'London, UK', NULL, NULL, 'user', FALSE, 'active'),
-- gallery@artnft.com / password123
(@user_004_id, 'gallery@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'CryptoGallery', 'https://placehold.co/100x100.png', 'Curating the finest digital art for the discerning collector.', 'Paris, France', 'https://cryptogallery.example.com', 'https://placehold.co/1500x500.png', 'user', TRUE, 'active'),
-- creator@artnft.com / password123
(@user_005_id, 'creator@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'DigitalCreatorPro', 'https://placehold.co/100x100.png', 'Professional digital artist specializing in 3D and motion graphics.', 'Tokyo, Japan', 'https://digitalcreator.pro', 'https://placehold.co/1500x500.png', 'user', TRUE, 'active'),
-- viewer@artnft.com / password123
(@user_006_id, 'viewer@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'ArtViewer22', 'https://placehold.co/100x100.png', 'Enthusiast exploring the world of NFTs.', 'Berlin, Germany', NULL, NULL, 'user', FALSE, 'active'),
-- investor@artnft.com / password123
(@user_007_id, 'investor@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'NFTInvestorX', 'https://placehold.co/100x100.png', 'Investing in the future of digital assets and art.', 'Singapore', 'https://nftinvestorx.com', 'https://placehold.co/1500x500.png', 'user', FALSE, 'active'),
-- designer@artnft.com / password123
(@user_008_id, 'designer@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'UXDesignerArt', 'https://placehold.co/100x100.png', 'UX Designer with a passion for art and blockchain technology.', 'San Francisco, USA', NULL, NULL, 'user', FALSE, 'active'),
-- musician@artnft.com / password123
(@user_009_id, 'musician@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'SynthMusician', 'https://placehold.co/100x100.png', 'Creating unique soundscapes and music NFTs. Verified Artist.', 'Austin, USA', 'https://synthmusician.bandcamp.com', 'https://placehold.co/1500x500.png', 'user', TRUE, 'active'),
-- pixelartist@artnft.com / password123
(@user_010_id, 'pixelartist@artnft.com', '$2a$10$FURESCeT7QxU8gA13eTjLu2P0UeN4iH9EaVcGk40qZ62d5Q7WlKnS', 'PixelPioneer', 'https://placehold.co/100x100.png', 'Mastering the art of pixels, one block at a time. Verified Artist.', 'Retro City', 'https://pixelpioneer.art', 'https://placehold.co/1500x500.png', 'user', TRUE, 'active'),
-- admin@artnft.com / adminpass
(@admin_user_id_001, 'admin@artnft.com', '$2a$10$0jL.8t3n7mO9pY9uFjN.gOFjOq0.oK4lDo.jP/n7E9FzJ2vW.8yHq', 'AdminUser', 'https://placehold.co/100x100.png', 'ArtNFT Platform Administrator.', 'ArtNFT HQ', NULL, NULL, 'admin', FALSE, 'active');

-- Mock User Social Links
INSERT INTO `user_social_links` (`id`, `user_id`, `platform`, `url`) VALUES
(UUID(), @user_002_id, 'Twitter', 'https://twitter.com/ArtIsLifeNFT'),
(UUID(), @user_002_id, 'Instagram', 'https://instagram.com/ArtIsLife_Official'),
(UUID(), @user_005_id, 'ArtStation', 'https://www.artstation.com/digitalcreatorpro'),
(UUID(), @user_010_id, 'Behance', 'https://www.behance.net/PixelPioneer');

-- Mock User Wallets (One per user for now)
INSERT INTO `user_wallets` (`id`, `user_id`, `wallet_address`, `is_primary`) VALUES
(UUID(), @user_001_id, '0x1234567890123456789012345678901234567890', TRUE),
(UUID(), @user_002_id, '0xABCDEF0123456789ABCDEF0123456789ABCDEF01', TRUE),
(UUID(), @user_003_id, '0x2222222222222222222222222222222222222222', TRUE);
-- ... add for other users if needed

-- Mock Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`) VALUES
(@cat_digital_art_id, 'Digital Art', 'digital-art', 'Creations made with digital technologies, from 2D illustrations to 3D sculptures.', 'Palette'),
(@cat_photography_id, 'Photography', 'photography', 'Art captured through the lens, including landscapes, portraits, and conceptual photos.', 'Camera'),
(@cat_music_id, 'Music', 'music', 'Audio NFTs, from individual tracks and albums to soundscapes and generative music.', 'Music2'),
(@cat_collectibles_id, 'Collectibles', 'collectibles', 'Unique digital items, characters, and memorabilia, often part of a larger set.', 'ToyBrick'),
(@cat_virtual_worlds_id, 'Virtual Worlds', 'virtual-worlds', 'Assets for metaverses and virtual environments, like land, wearables, and items.', 'Globe'),
(@cat_utility_tokens_id, 'Utility Tokens', 'utility-tokens', 'NFTs that grant access, perks, or functionalities within digital ecosystems or communities.', 'Bitcoin'),
(@cat_generative_art_id, 'Generative Art', 'generative-art', 'Art created using autonomous systems, often involving algorithms and code.', 'Sparkles'),
(@cat_pixel_art_id, 'Pixel Art', 'pixel-art', 'Digital art created using raster graphics software, where images are edited on the pixel level.', 'Grid');

-- Mock Collections
-- User 2 (ArtIsLife)
SET @col_user002_id_1 = 'col_00000000-0000-0000-0000-USER002COLL1';
INSERT INTO `collections` (`id`, `user_id`, `name`, `slug`, `description`, `cover_image_url`) VALUES
(@col_user002_id_1, @user_002_id, 'Dream Weavers', 'dream-weavers-by-artislife', 'A collection of surreal and dreamlike digital paintings.', 'https://placehold.co/600x300.png');
-- User 5 (DigitalCreatorPro)
SET @col_user005_id_1 = 'col_00000000-0000-0000-0000-USER005COLL1';
INSERT INTO `collections` (`id`, `user_id`, `name`, `slug`, `description`, `cover_image_url`) VALUES
(@col_user005_id_1, @user_005_id, 'Cybernetic Visions', 'cybernetic-visions-by-dcpro', 'Exploring the intersection of humanity and technology through 3D art.', 'https://placehold.co/600x300.png');
-- User 10 (PixelPioneer)
SET @col_user010_id_1 = 'col_00000000-0000-0000-0000-USER010COLL1';
INSERT INTO `collections` (`id`, `user_id`, `name`, `slug`, `description`, `cover_image_url`) VALUES
(@col_user010_id_1, @user_010_id, 'Retro Pixel Adventures', 'retro-pixel-adventures-by-pioneer', 'A series of pixel art characters and scenes from forgotten games.', 'https://placehold.co/600x300.png');
-- User 1 (TestUser01)
SET @col_user001_id_1 = 'col_00000000-0000-0000-0000-USER001COLL1';
INSERT INTO `collections` (`id`, `user_id`, `name`, `slug`, `description`, `cover_image_url`) VALUES
(@col_user001_id_1, @user_001_id, 'My First Collection', 'my-first-collection-by-testuser', 'A place for my amazing creations!', 'https://placehold.co/600x300.png');


-- Mock Tags
INSERT INTO `tags` (`id`, `name`, `slug`, `description`) VALUES
(@tag_abstract_id, 'Abstract', 'abstract', 'Art that does not attempt to represent external reality.'),
(@tag_pixel_id, 'Pixel Art', 'pixel-art', 'Digital art created at the pixel level.'),
(@tag_landscape_id, 'Landscape', 'landscape', 'Art depicting natural scenery.'),
(@tag_music_id, 'Music', 'music', 'Related to audio or musical compositions.'),
(@tag_collectible_id, 'Collectible', 'collectible', 'Items intended for collection.'),
(@tag_3d_id, '3D', '3d', 'Art created in three-dimensional space.'),
(@tag_retro_id, 'Retro', 'retro', 'Art inspired by styles from the past.'),
(@tag_sci_fi_id, 'Sci-Fi', 'sci-fi', 'Art depicting futuristic or science fiction themes.'),
(@tag_fantasy_id, 'Fantasy', 'fantasy', 'Art depicting magical or mythological themes.'),
(@tag_utility_id, 'Utility', 'utility', 'NFTs that provide some form of utility or access.');

-- Mock NFTs (approx 20-30)
-- Assigning IDs for later reference in bids, favorites, etc.
SET @nft_id_001 = 'nft_00000000-0000-0000-0000-MOCK00000001';
SET @nft_id_002 = 'nft_00000000-0000-0000-0000-MOCK00000002';
SET @nft_id_003 = 'nft_00000000-0000-0000-0000-MOCK00000003';
SET @nft_id_004 = 'nft_00000000-0000-0000-0000-MOCK00000004';
SET @nft_id_005 = 'nft_00000000-0000-0000-0000-MOCK00000005';
SET @nft_id_006 = 'nft_00000000-0000-0000-0000-MOCK00000006';
SET @nft_id_007 = 'nft_00000000-0000-0000-0000-MOCK00000007';
SET @nft_id_008 = 'nft_00000000-0000-0000-0000-MOCK00000008';
SET @nft_id_009 = 'nft_00000000-0000-0000-0000-MOCK00000009';
SET @nft_id_010 = 'nft_00000000-0000-0000-0000-MOCK00000010';
SET @nft_id_011 = 'nft_00000000-0000-0000-0000-MOCK00000011';
SET @nft_id_012 = 'nft_00000000-0000-0000-0000-MOCK00000012';
SET @nft_id_013 = 'nft_00000000-0000-0000-0000-MOCK00000013';
SET @nft_id_014 = 'nft_00000000-0000-0000-0000-MOCK00000014';
SET @nft_id_015 = 'nft_00000000-0000-0000-0000-MOCK00000015';
SET @nft_id_016 = 'nft_00000000-0000-0000-0000-MOCK00000016';
SET @nft_id_017 = 'nft_00000000-0000-0000-0000-MOCK00000017';
SET @nft_id_018 = 'nft_00000000-0000-0000-0000-MOCK00000018';
SET @nft_id_019 = 'nft_00000000-0000-0000-0000-MOCK00000019';
SET @nft_id_020 = 'nft_00000000-0000-0000-0000-MOCK00000020';
SET @nft_id_021 = 'nft_00000000-0000-0000-0000-MOCK00000021';
SET @nft_id_022 = 'nft_00000000-0000-0000-0000-MOCK00000022';
SET @nft_id_023 = 'nft_00000000-0000-0000-0000-MOCK00000023';
SET @nft_id_024 = 'nft_00000000-0000-0000-0000-MOCK00000024';
SET @nft_id_025 = 'nft_00000000-0000-0000-0000-MOCK00000025';


INSERT INTO `nfts` (`id`, `title`, `description`, `image_url`, `token_id`, `contract_address`, `blockchain`, `price_eth`, `status`, `is_auction`, `auction_ends_at`, `royalty_percentage`, `creator_id`, `owner_id`, `category_id`, `collection_id`, `created_at`) VALUES
-- User 1 (TestUser01)
(@nft_id_001, 'My First Abstract', 'An exploration of color and form. My first NFT!', 'https://placehold.co/400x400.png', 'TK001', '0xContract1', 'Ethereum', 0.5, 'listed', FALSE, NULL, 5.00, @user_001_id, @user_001_id, @cat_digital_art_id, @col_user001_id_1, NOW() - INTERVAL 7 DAY),
(@nft_id_002, 'Pixel Pal', 'A friendly pixel character.', 'https://placehold.co/400x400.png', 'TK002', '0xContract1', 'Ethereum', 0.2, 'on_auction', TRUE, NOW() + INTERVAL 3 DAY, 10.00, @user_001_id, @user_001_id, @cat_pixel_art_id, @col_user001_id_1, NOW() - INTERVAL 6 DAY),
-- User 2 (ArtIsLife) - Verified Artist
(@nft_id_003, 'Dream Weaver #1', 'The first piece in the Dream Weavers series. Surreal landscape.', 'https://placehold.co/400x400.png', 'TK003', '0xContract2', 'Ethereum', 1.2, 'listed', FALSE, NULL, 10.00, @user_002_id, @user_002_id, @cat_digital_art_id, @col_user002_id_1, NOW() - INTERVAL 10 DAY),
(@nft_id_004, 'Ephemeral Light', 'Capturing fleeting moments of light and shadow.', 'https://placehold.co/400x400.png', 'TK004', '0xContract2', 'Ethereum', 0.8, 'listed', FALSE, NULL, 10.00, @user_002_id, @user_002_id, @cat_photography_id, NULL, NOW() - INTERVAL 9 DAY),
(@nft_id_005, 'Dream Weaver #2', 'Continuing the journey into dreamlike vistas.', 'https://placehold.co/400x400.png', 'TK005', '0xContract2', 'Ethereum', 1.5, 'sold', FALSE, NULL, 10.00, @user_002_id, @user_003_id, @cat_digital_art_id, @col_user002_id_1, NOW() - INTERVAL 8 DAY), -- Sold to User 3
-- User 3 (NFTCollectorGal)
(@nft_id_006, 'Vintage Robot', 'A classic collectible robot from a bygone era.', 'https://placehold.co/400x400.png', 'TK006', '0xContract3', 'Ethereum', 0.75, 'listed', FALSE, NULL, 0.00, @user_003_id, @user_003_id, @cat_collectibles_id, NULL, NOW() - INTERVAL 5 DAY),
-- User 5 (DigitalCreatorPro) - Verified Artist
(@nft_id_007, 'Cybernetic Orb', 'A mysterious 3D orb pulsating with digital energy.', 'https://placehold.co/400x400.png', 'TK007', '0xContract4', 'Polygon', 2.0, 'listed', FALSE, NULL, 12.50, @user_005_id, @user_005_id, @cat_digital_art_id, @col_user005_id_1, NOW() - INTERVAL 12 DAY),
(@nft_id_008, 'Mech Suit Alpha', 'Concept art for a futuristic mech suit.', 'https://placehold.co/400x400.png', 'TK008', '0xContract4', 'Polygon', 3.5, 'on_auction', TRUE, NOW() + INTERVAL 5 DAY, 12.50, @user_005_id, @user_005_id, @cat_digital_art_id, @col_user005_id_1, NOW() - INTERVAL 11 DAY),
-- User 9 (SynthMusician) - Verified Artist
(@nft_id_009, 'Retro Wave Loop', 'An endlessly looping synthwave track with accompanying visualizer.', 'https://placehold.co/400x400.png', 'TK009', '0xContract5', 'Ethereum', 0.4, 'listed', FALSE, NULL, 15.00, @user_009_id, @user_009_id, @cat_music_id, NULL, NOW() - INTERVAL 15 DAY),
(@nft_id_010, '80s Nostalgia Beat', 'A beat that takes you back to the 80s. Perfect for chill vibes.', 'https://placehold.co/400x400.png', 'TK010', '0xContract5', 'Ethereum', 0.6, 'listed', FALSE, NULL, 15.00, @user_009_id, @user_009_id, @cat_music_id, NULL, NOW() - INTERVAL 14 DAY),
-- User 10 (PixelPioneer) - Verified Artist
(@nft_id_011, 'Pixel Knight #001', 'The first knight in the Retro Pixel Adventures series.', 'https://placehold.co/400x400.png', 'TK011', '0xContract6', 'Polygon', 0.3, 'sold', FALSE, NULL, 8.00, @user_010_id, @user_001_id, @cat_pixel_art_id, @col_user010_id_1, NOW() - INTERVAL 20 DAY), -- Sold to User 1
(@nft_id_012, 'Pixel Forest Scene', 'A lush pixel art forest with hidden secrets.', 'https://placehold.co/400x400.png', 'TK012', '0xContract6', 'Polygon', 0.5, 'listed', FALSE, NULL, 8.00, @user_010_id, @user_010_id, @cat_pixel_art_id, @col_user010_id_1, NOW() - INTERVAL 18 DAY),
(@nft_id_013, 'Pixel Dragonling', 'A cute but feisty pixel dragon.', 'https://placehold.co/400x400.png', 'TK013', '0xContract6', 'Polygon', 0.7, 'on_auction', TRUE, NOW() + INTERVAL 2 DAY, 8.00, @user_010_id, @user_010_id, @cat_pixel_art_id, @col_user010_id_1, NOW() - INTERVAL 17 DAY),
-- More Diverse NFTs
(@nft_id_014, 'Generative Swirls #7', 'Unique algorithmic art piece.', 'https://placehold.co/400x400.png', 'TK014', '0xContract7', 'Ethereum', 1.0, 'listed', FALSE, NULL, 7.50, @user_004_id, @user_004_id, @cat_generative_art_id, NULL, NOW() - INTERVAL 25 DAY),
(@nft_id_015, 'Mountain Vista Photo', 'Breathtaking photograph of the Rockies.', 'https://placehold.co/400x400.png', 'TK015', '0xContract8', 'Ethereum', 0.9, 'listed', FALSE, NULL, 5.00, @user_006_id, @user_006_id, @cat_photography_id, NULL, NOW() - INTERVAL 22 DAY),
(@nft_id_016, 'VR Gallery Access Key', 'A utility token granting access to an exclusive VR gallery.', 'https://placehold.co/400x400.png', 'TK016', '0xContract9', 'Polygon', 2.5, 'listed', FALSE, NULL, 2.00, @user_007_id, @user_007_id, @cat_utility_tokens_id, NULL, NOW() - INTERVAL 30 DAY),
(@nft_id_017, 'Lost Temple - Game Asset', 'A 3D model of a temple for use in virtual worlds.', 'https://placehold.co/400x400.png', 'TK017', '0xContractA', 'Ethereum', 1.8, 'listed', FALSE, NULL, 10.00, @user_008_id, @user_008_id, @cat_virtual_worlds_id, NULL, NOW() - INTERVAL 28 DAY),
(@nft_id_018, 'Cosmic Abstract #42', 'Abstract digital painting of cosmic phenomena.', 'https://placehold.co/400x400.png', 'TK018', '0xContract2', 'Ethereum', 0.65, 'hidden', FALSE, NULL, 10.00, @user_002_id, @user_002_id, @cat_digital_art_id, @col_user002_id_1, NOW() - INTERVAL 5 DAY),
(@nft_id_019, 'Pixel Mage Character', 'A powerful mage rendered in pixel art.', 'https://placehold.co/400x400.png', 'TK019', '0xContract6', 'Polygon', 0.4, 'listed', FALSE, NULL, 8.00, @user_010_id, @user_010_id, @cat_pixel_art_id, @col_user010_id_1, NOW() - INTERVAL 3 DAY),
(@nft_id_020, 'Serene Lake Photograph', 'A calming photo of a lake at dawn.', 'https://placehold.co/400x400.png', 'TK020', '0xContract8', 'Ethereum', 0.7, 'on_auction', TRUE, NOW() + INTERVAL 10 HOUR, 5.00, @user_006_id, @user_006_id, @cat_photography_id, NULL, NOW() - INTERVAL 2 DAY),
(@nft_id_021, 'Chillhop Beat "Sunset"', 'A relaxing chillhop track.', 'https://placehold.co/400x400.png', 'TK021', '0xContract5', 'Ethereum', 0.25, 'listed', FALSE, NULL, 15.00, @user_009_id, @user_009_id, @cat_music_id, NULL, NOW() - INTERVAL 1 DAY),
(@nft_id_022, 'Cyberpunk Alleyway 3D', 'Detailed 3D render of a futuristic alley.', 'https://placehold.co/400x400.png', 'TK022', '0xContract4', 'Polygon', 2.2, 'listed', FALSE, NULL, 12.50, @user_005_id, @user_005_id, @cat_digital_art_id, @col_user005_id_1, NOW() - INTERVAL 4 DAY),
(@nft_id_023, 'Generative Patterns Alpha', 'An early piece from a generative art series.', 'https://placehold.co/400x400.png', 'TK023', '0xContract7', 'Ethereum', 0.9, 'draft', FALSE, NULL, 7.50, @user_004_id, @user_004_id, @cat_generative_art_id, NULL, NOW() - INTERVAL 16 DAY),
(@nft_id_024, 'Utility Key - Beta Access', 'A utility NFT granting beta access to a new platform.', 'https://placehold.co/400x400.png', 'TK024', '0xContract9', 'Polygon', 1.1, 'pending_moderation', FALSE, NULL, 2.00, @user_007_id, @user_007_id, @cat_utility_tokens_id, NULL, NOW() - INTERVAL 19 DAY),
(@nft_id_025, 'Collectible Card #007', 'A rare collectible digital card.', 'https://placehold.co/400x400.png', 'TK025', '0xContract3', 'Ethereum', 0.35, 'listed', FALSE, NULL, 0.00, @user_003_id, @user_003_id, @cat_collectibles_id, NULL, NOW() - INTERVAL 21 DAY);

-- Mock NFT Attributes
INSERT INTO `nft_attributes` (`id`, `nft_id`, `trait_type`, `value`) VALUES
(UUID(), @nft_id_001, 'Style', 'Abstract'), (UUID(), @nft_id_001, 'Color', 'Vibrant'),
(UUID(), @nft_id_002, 'Character Type', 'Pal'), (UUID(), @nft_id_002, 'Style', 'Pixel Art'),
(UUID(), @nft_id_007, 'Material', 'Metallic'), (UUID(), @nft_id_007, 'Energy', 'Pulsating'),
(UUID(), @nft_id_011, 'Class', 'Knight'), (UUID(), @nft_id_011, 'Weapon', 'Sword'),
(UUID(), @nft_id_013, 'Creature', 'Dragon'), (UUID(), @nft_id_013, 'Element', 'Fire');

-- Mock NFT Tags
INSERT INTO `nft_tags` (`nft_id`, `tag_id`) VALUES
(@nft_id_001, @tag_abstract_id), (@nft_id_001, @tag_3d_id),
(@nft_id_002, @tag_pixel_id), (@nft_id_002, @tag_collectible_id), (@nft_id_002, @tag_retro_id),
(@nft_id_003, @tag_abstract_id), (@nft_id_003, @tag_fantasy_id),
(@nft_id_004, @tag_landscape_id),
(@nft_id_007, @tag_3d_id), (@nft_id_007, @tag_sci_fi_id),
(@nft_id_009, @tag_music_id), (@nft_id_009, @tag_retro_id),
(@nft_id_011, @tag_pixel_id), (@nft_id_011, @tag_fantasy_id), (@nft_id_011, @tag_collectible_id),
(@nft_id_012, @tag_pixel_id), (@nft_id_012, @tag_landscape_id),
(@nft_id_014, @tag_abstract_id),
(@nft_id_016, @tag_utility_id);

-- Mock Bids
INSERT INTO `bids` (`id`, `nft_id`, `user_id`, `bid_amount_eth`, `status`) VALUES
(UUID(), @nft_id_002, @user_003_id, 0.25, 'active'), -- Pixel Pal (starting 0.2)
(UUID(), @nft_id_002, @user_004_id, 0.30, 'active'),
(UUID(), @nft_id_008, @user_007_id, 3.6, 'active'), -- Mech Suit Alpha (starting 3.5)
(UUID(), @nft_id_013, @user_001_id, 0.75, 'active'); -- Pixel Dragonling (starting 0.7)

-- Mock Favorites
INSERT INTO `favorites` (`user_id`, `nft_id`) VALUES
(@user_001_id, @nft_id_003), (@user_001_id, @nft_id_007),
(@user_003_id, @nft_id_002), (@user_003_id, @nft_id_011), (@user_003_id, @nft_id_009);

-- Mock User Follows
INSERT INTO `user_follows` (`follower_id`, `following_id`) VALUES
(@user_001_id, @user_002_id), -- TestUser01 follows ArtIsLife
(@user_001_id, @user_010_id), -- TestUser01 follows PixelPioneer
(@user_003_id, @user_002_id), -- NFTCollectorGal follows ArtIsLife
(@user_003_id, @user_005_id), -- NFTCollectorGal follows DigitalCreatorPro
(@user_002_id, @user_005_id); -- ArtIsLife follows DigitalCreatorPro

-- Mock NFT History (Basic)
INSERT INTO `nft_history` (`id`, `nft_id`, `event_type`, `user_id`, `details`) VALUES
(UUID(), @nft_id_001, 'minted', @user_001_id, JSON_OBJECT('notes', 'Initial minting by TestUser01')),
(UUID(), @nft_id_001, 'listed', @user_001_id, JSON_OBJECT('price_eth', 0.5)),
(UUID(), @nft_id_003, 'minted', @user_002_id, JSON_OBJECT('notes', 'Created by ArtIsLife')),
(UUID(), @nft_id_003, 'listed', @user_002_id, JSON_OBJECT('price_eth', 1.2)),
(UUID(), @nft_id_005, 'minted', @user_002_id, JSON_OBJECT('notes', 'Created by ArtIsLife')),
(UUID(), @nft_id_005, 'listed', @user_002_id, JSON_OBJECT('price_eth', 1.5)),
(UUID(), @nft_id_005, 'sold', @user_002_id, JSON_OBJECT('price_eth', 1.5, 'buyer_id', @user_003_id)),
(UUID(), @nft_id_011, 'minted', @user_010_id, JSON_OBJECT('notes', 'PixelPioneer creation')),
(UUID(), @nft_id_011, 'listed', @user_010_id, JSON_OBJECT('price_eth', 0.3)),
(UUID(), @nft_id_011, 'sold', @user_010_id, JSON_OBJECT('price_eth', 0.3, 'buyer_id', @user_001_id));

-- Mock Comments
INSERT INTO `comments` (`id`, `nft_id`, `user_id`, `content`) VALUES
(UUID(), @nft_id_001, @user_002_id, 'Love the colors on this one!'),
(UUID(), @nft_id_001, @user_003_id, 'Great first piece! Keep it up.'),
(UUID(), @nft_id_003, @user_001_id, 'This is amazing, ArtIsLife! So surreal.');

-- Mock Promotions (Example: Feature one NFT and one Artist)
INSERT INTO `promotions` (`id`, `promotion_type`, `target_id`, `title`, `description`, `image_url`, `cta_link`, `cta_text`, `start_date`, `end_date`, `is_active`) VALUES
(UUID(), 'featured_nft', @nft_id_007, 'Spotlight: Cybernetic Orb', 'A mesmerizing 3D creation by DigitalCreatorPro. Explore the future!', 'https://placehold.co/800x400.png', CONCAT('/nft/', @nft_id_007), 'View NFT', NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 6 DAY, TRUE),
(UUID(), 'artist_spotlight', @user_002_id, 'Artist Spotlight: ArtIsLife', 'Discover the surreal and captivating digital art of ArtIsLife.', 'https://placehold.co/800x400.png', CONCAT('/profile/', @user_002_id), 'View Profile', NOW(), NOW() + INTERVAL 14 DAY, TRUE);

-- Mock Announcements
INSERT INTO `announcements` (`id`, `title`, `content`, `type`, `is_published`, `published_at`, `created_by_admin_id`) VALUES
(UUID(), 'Welcome to the New ArtNFT Marketplace!', 'We are thrilled to launch our new platform. Explore, create, and trade amazing digital art!', 'platform_update', TRUE, NOW() - INTERVAL 2 DAY, @admin_user_id_001),
(UUID(), 'Community AMA with PixelPioneer', 'Join us next Friday for a live Ask-Me-Anything session with renowned pixel artist PixelPioneer!', 'event', TRUE, NOW() - INTERVAL 1 DAY, @admin_user_id_001);

-- Mock Transactions (Simplified)
INSERT INTO `transactions` (`id`, `transaction_type`, `nft_id`, `from_user_id`, `to_user_id`, `amount_eth`, `status`) VALUES
(UUID(), 'sale', @nft_id_005, @user_002_id, @user_003_id, 1.5, 'completed'), -- ArtIsLife sold to NFTCollectorGal
(UUID(), 'purchase', @nft_id_005, @user_003_id, @user_002_id, 1.5, 'completed'), -- NFTCollectorGal purchased from ArtIsLife
(UUID(), 'sale', @nft_id_011, @user_010_id, @user_001_id, 0.3, 'completed'), -- PixelPioneer sold to TestUser01
(UUID(), 'purchase', @nft_id_011, @user_001_id, @user_010_id, 0.3, 'completed'); -- TestUser01 purchased from PixelPioneer

-- Mock Admin Audit Log
INSERT INTO `admin_audit_log` (`id`, `admin_user_id`, `action_type`, `target_entity_type`, `target_entity_id`, `description`) VALUES
(UUID(), @admin_user_id_001, 'USER_ROLE_CHANGED', 'User', @user_002_id, 'Changed role of ArtIsLife to Verified Artist (simulated).'),
(UUID(), @admin_user_id_001, 'NFT_STATUS_CHANGED', 'NFT', @nft_id_018, 'Changed status of Cosmic Abstract #42 to Hidden.');

-- Mock Reports
INSERT INTO `reports` (`id`, `reporter_user_id`, `reported_entity_type`, `reported_entity_id`, `reason_category`, `reason_details`, `status`) VALUES
(UUID(), @user_001_id, 'nft', @nft_id_004, 'Misleading Information', 'The description does not match the artwork provided.', 'pending_review');

-- Mock Notifications (For User 1)
INSERT INTO `notifications` (`id`, `user_id`, `notification_type`, `title`, `message`, `related_entity_type`, `related_entity_id`) VALUES
(UUID(), @user_001_id, 'new_listing_followed_artist', 'New from ArtIsLife!', 'ArtIsLife listed "Dream Weaver #1".', 'nft', @nft_id_003),
(UUID(), @user_001_id, 'auction_ending_soon', 'Auction Ending: Pixel Pal', 'The auction for Pixel Pal by you is ending in 3 days!', 'nft', @nft_id_002);

-- Mock User Notification Preferences (For User 1)
INSERT INTO `user_notification_preferences` (`user_id`) VALUES (@user_001_id);
-- Other users will use default TRUE values from table definition

SELECT 'Mock data insertion complete.' AS `Status`;
    