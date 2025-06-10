
-- ArtNFT Marketplace - Database Schema
-- Version 1.1

-- This schema defines the tables for users, NFTs, categories, collections,
-- bids, favorites, transactions, notifications, platform settings, and admin audit logs.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in reverse order of dependency if they exist
DROP TABLE IF EXISTS `admin_audit_log`;
DROP TABLE IF EXISTS `platform_settings`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `bids`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `nfts`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `user_follows`;
DROP TABLE IF EXISTS `users`;


-- ================================================================================================
-- Users Table
-- Stores information about registered users and administrators.
-- ================================================================================================
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the user',
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT 'User_s email address',
  `username` VARCHAR(50) UNIQUE DEFAULT NULL COMMENT 'User_s unique username',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  `avatar_url` VARCHAR(255) DEFAULT NULL COMMENT 'URL to user_s avatar image',
  `bio` TEXT DEFAULT NULL COMMENT 'Short biography of the user',
  `wallet_address` VARCHAR(255) UNIQUE DEFAULT NULL COMMENT 'User_s crypto wallet address',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT 'Role of the user (user or admin)',
  `status` ENUM('active', 'suspended', 'pending_verification', 'deleted') NOT NULL DEFAULT 'active' COMMENT 'Account status',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp of the last login'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user account information and credentials.';


-- ================================================================================================
-- User Follows Table (for "follow artist" feature)
-- ================================================================================================
CREATE TABLE `user_follows` (
  `follower_id` VARCHAR(36) NOT NULL COMMENT 'ID of the user who is following',
  `following_id` VARCHAR(36) NOT NULL COMMENT 'ID of the user being followed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`, `following_id`),
  FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks user follow relationships.';


-- ================================================================================================
-- Categories Table
-- Defines categories for NFTs (e.g., Digital Art, Photography, Music).
-- ================================================================================================
CREATE TABLE `categories` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the category',
  `name` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Name of the category',
  `slug` VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL-friendly slug for the category',
  `description` TEXT DEFAULT NULL COMMENT 'Description of the category',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT 'Lucide icon name or path to custom icon',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Defines NFT categories for organization.';


-- ================================================================================================
-- Collections Table
-- Allows users to group their NFTs into collections.
-- ================================================================================================
CREATE TABLE `collections` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the collection',
  `user_id` VARCHAR(36) NOT NULL COMMENT 'Owner of the collection',
  `name` VARCHAR(150) NOT NULL COMMENT 'Name of the collection',
  `description` TEXT DEFAULT NULL COMMENT 'Description of the collection',
  `cover_image_url` VARCHAR(255) DEFAULT NULL COMMENT 'URL for the collection_s cover image',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Allows users to group their NFTs.';


-- ================================================================================================
-- NFTs Table
-- Stores detailed information about each Non-Fungible Token.
-- ================================================================================================
CREATE TABLE `nfts` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the NFT',
  `title` VARCHAR(255) NOT NULL COMMENT 'Title of the NFT',
  `description` TEXT DEFAULT NULL COMMENT 'Description of the NFT',
  `image_url` VARCHAR(255) NOT NULL COMMENT 'URL to the NFT_s image/media file',
  `token_id` VARCHAR(255) DEFAULT NULL COMMENT 'Blockchain token ID (if applicable)',
  `contract_address` VARCHAR(255) DEFAULT NULL COMMENT 'Blockchain contract address (if applicable)',
  `creator_id` VARCHAR(36) NOT NULL COMMENT 'User ID of the NFT creator',
  `owner_id` VARCHAR(36) DEFAULT NULL COMMENT 'User ID of the current NFT owner',
  `category_id` VARCHAR(36) DEFAULT NULL COMMENT 'Category of the NFT',
  `collection_id` VARCHAR(36) DEFAULT NULL COMMENT 'Collection this NFT belongs to (optional)',
  `price_eth` DECIMAL(18, 8) DEFAULT NULL COMMENT 'Price in ETH if for direct sale',
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'ETH',
  `status` ENUM('pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft') NOT NULL DEFAULT 'pending_moderation',
  `is_auction` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'True if the NFT is currently up for auction',
  `auction_ends_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp when the auction ends',
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Number of times the NFT has been viewed',
  `tags` JSON DEFAULT NULL COMMENT 'JSON array of tags/keywords',
  `attributes` JSON DEFAULT NULL COMMENT 'JSON object for custom properties/traits',
  `royalty_percentage` DECIMAL(5,2) DEFAULT NULL COMMENT 'Royalty percentage for secondary sales (e.g. 10.00 for 10%)',
  `unlockable_content_url` VARCHAR(255) DEFAULT NULL COMMENT 'URL to content only visible to the owner',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE SET NULL,
  INDEX `idx_nfts_title` (`title`),
  INDEX `idx_nfts_status` (`status`),
  INDEX `idx_nfts_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores all Non-Fungible Tokens information.';


-- ================================================================================================
-- Favorites Table
-- Tracks which users have favorited which NFTs.
-- ================================================================================================
CREATE TABLE `favorites` (
  `user_id` VARCHAR(36) NOT NULL,
  `nft_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `nft_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks user favorites for NFTs.';


-- ================================================================================================
-- Bids Table
-- Records bids made on auctionable NFTs.
-- ================================================================================================
CREATE TABLE `bids` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the bid',
  `nft_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL COMMENT 'User who placed the bid',
  `bid_amount_eth` DECIMAL(18, 8) NOT NULL COMMENT 'Amount of the bid in ETH',
  `bid_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Records bids placed on NFTs during auctions.';


-- ================================================================================================
-- Transactions Table
-- Logs all significant financial transactions (purchases, sales, minting fees).
-- ================================================================================================
CREATE TABLE `transactions` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the transaction',
  `nft_id` VARCHAR(36) DEFAULT NULL COMMENT 'Associated NFT (if applicable)',
  `buyer_id` VARCHAR(36) DEFAULT NULL COMMENT 'User who bought the NFT',
  `seller_id` VARCHAR(36) DEFAULT NULL COMMENT 'User who sold the NFT or minted',
  `transaction_type` ENUM('purchase', 'sale', 'mint_fee', 'royalty_payment', 'bid_payment') NOT NULL,
  `amount_eth` DECIMAL(18, 8) NOT NULL COMMENT 'Transaction amount in ETH',
  `platform_fee_eth` DECIMAL(18, 8) DEFAULT NULL COMMENT 'Platform fee collected',
  `blockchain_tx_hash` VARCHAR(255) UNIQUE DEFAULT NULL COMMENT 'Blockchain transaction hash',
  `status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs financial transactions on the platform.';


-- ================================================================================================
-- Notifications Table
-- Stores notifications for users (e.g., new listings, price drops, sales).
-- ================================================================================================
CREATE TABLE `notifications` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the notification',
  `user_id` VARCHAR(36) NOT NULL COMMENT 'User to whom the notification belongs',
  `type` ENUM('new_listing_followed_artist', 'price_drop_favorited', 'auction_update', 'sale_success', 'purchase_success', 'bid_outbid', 'bid_won', 'platform_announcement', 'profile_update_followed') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `related_entity_id` VARCHAR(36) DEFAULT NULL COMMENT 'ID of related entity (e.g., NFT ID, User ID)',
  `related_entity_type` VARCHAR(50) DEFAULT NULL COMMENT 'Type of related entity (e.g., "nft", "user")',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user notifications for various platform events.';


-- ================================================================================================
-- Platform Settings Table
-- Stores global configuration settings for the platform, manageable by admins.
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
-- Admin Audit Log Table
-- Tracks significant actions performed by administrators.
-- ================================================================================================
CREATE TABLE `admin_audit_log` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the audit log entry',
  `admin_user_id` VARCHAR(36) NOT NULL COMMENT 'Admin user who performed the action',
  `action_type` VARCHAR(100) NOT NULL COMMENT 'Type of action (e.g., USER_SUSPENDED, NFT_HIDDEN, CATEGORY_CREATED)',
  `target_entity_id` VARCHAR(36) DEFAULT NULL COMMENT 'ID of the entity affected (e.g., User ID, NFT ID)',
  `target_entity_type` VARCHAR(50) DEFAULT NULL COMMENT 'Type of entity affected',
  `details` JSON DEFAULT NULL COMMENT 'JSON object with details about the action (e.g., old and new values)',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP address from which the action was performed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs significant administrative actions for auditing.';

SET FOREIGN_KEY_CHECKS = 1;

-- ================================================================================================
-- Mock Data Insertion
-- ================================================================================================

-- Users (Admin and Regular Users)
INSERT INTO `users` (`id`, `email`, `username`, `password_hash`, `role`, `status`, `bio`, `avatar_url`) VALUES
('usr_00000000-0000-0000-0000-000000000000', 'admin@artnft.com', 'AdminUser', '$2a$10$E.MvwLtkD9.V2b.gXcLsB.6jUeJ7jB0L55u0y3N3D2.rdXp8cOz5q', 'admin', 'active', 'Platform Administrator', 'https://placehold.co/100x100.png'), -- Password: adminpass
('usr_00000000-0000-0000-0000-000000000001', 'testuser@artnft.com', 'TestUser01', '$2a$10$ZcXHnS5xSnfmz1n.j/rJ0Oq7Xw2sWkHk8X6j.kK/b3C6qJ5q.yJ.K', 'user', 'active', 'Just a test user exploring ArtNFT.', 'https://placehold.co/100x100.png'), -- Password: password123
('usr_00000000-0000-0000-0000-000000000002', 'artist@artnft.com', 'ArtIsLife', '$2a$10$yO3k/ZUq2Ld2Kj8g9hN4C.ACd2fN1sX.qU4rLhN3gOqf/Fv7g.P7W', 'user', 'active', 'Creating digital dreams.', 'https://placehold.co/100x100.png'), -- Password: artistpass
('usr_00000000-0000-0000-0000-000000000003', 'collector@artnft.com', 'NFTCollectorGal', '$2a$10$rV9xKjB.tXz5dJ8sU3bB.eYnZm5g.J/w.C3pP9s.L4fJ7oR2e.T8q', 'user', 'active', 'Loves collecting unique digital art!', 'https://placehold.co/100x100.png'), -- Password: collectpass
('usr_00000000-0000-0000-0000-000000000004', 'gallery@artnft.com', 'CryptoGallery', '$2a$10$bN9y.Lp3wD.Sj2oR.xG7k.FzXv1.K/r.H9tU4nL.wQjE6oP3d.D2i', 'user', 'active', 'Curating the finest NFTs.', 'https://placehold.co/100x100.png'), -- Password: gallerypass
('usr_00000000-0000-0000-0000-000000000005', 'creator@artnft.com', 'DigitalCreatorPro', '$2a$10$vF3g.A2kL.Mh5rR.dF8sJ.WzXk9.L/o.P7tU1nJ.sQjE2oP6c.N3o', 'user', 'active', 'Professional digital artist.', 'https://placehold.co/100x100.png'), -- Password: creatorpass
('usr_00000000-0000-0000-0000-000000000006', 'viewer@artnft.com', 'ArtViewer22', '$2a$10$sE7h.Rj4kD.Mn1vQ.xL9p.GxWz8.N/t.J2uK5mL.vYjF1oP0a.B4q', 'user', 'active', 'Enjoys viewing beautiful art.', 'https://placehold.co/100x100.png'), -- Password: viewerpass
('usr_00000000-0000-0000-0000-000000000007', 'investor@artnft.com', 'NFTInvestorX', '$2a$10$wR1o.Pq5sD.Vm6xS.yB0l.ExTz3.M/k.J7vU8nO.zYjG4oP9e.C5r', 'user', 'active', 'Investing in the future of digital assets.', 'https://placehold.co/100x100.png'), -- Password: investorpass
('usr_00000000-0000-0000-0000-000000000008', 'designer@artnft.com', 'UXDesignerArt', '$2a$10$uC5j.Xm2pB.Qk7vR.zF1m.NsYv6.O/p.K9wT0nI.sXjE3oP7d.E6t', 'user', 'active', 'Designer passionate about web3 UX.', 'https://placehold.co/100x100.png'), -- Password: designerpass
('usr_00000000-0000-0000-0000-000000000009', 'synth@artnft.com', 'SynthMusician', '$2a$10$aO8l.Bq6xC.Vn0zS.wA2n.DvUz4.P/q.L8xU1oJ.tZjH5oP1e.F7u', 'user', 'active', 'Making synth waves and music NFTs.', 'https://placehold.co/100x100.png'), -- Password: synthpass
('usr_00000000-0000-0000-0000-000000000010', 'pixel@artnft.com', 'PixelPioneer', '$2a$10$zK3o.Cn7yD.Rm9wT.vB3o.QwXz2.R/s.K0yV2nM.uXjI6oP4f.G8v', 'user', 'active', 'Pioneering the world of pixel art NFTs.', 'https://placehold.co/100x100.png'); -- Password: pixelpass


-- User Follows
INSERT INTO `user_follows` (`follower_id`, `following_id`) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000002'), -- TestUser01 follows ArtIsLife
('usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000010'), -- TestUser01 follows PixelPioneer
('usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000005'); -- ArtIsLife follows DigitalCreatorPro


-- Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`) VALUES
('cat_00000000-0000-0000-0000-CATEGORY0001', 'Digital Art', 'digital-art', 'Creations made with digital technologies.', 'Palette'),
('cat_00000000-0000-0000-0000-CATEGORY0002', 'Photography', 'photography', 'Art captured through the lens.', 'Camera'),
('cat_00000000-0000-0000-0000-CATEGORY0003', 'Music', 'music', 'Audio NFTs and music-related collectibles.', 'Music2'),
('cat_00000000-0000-0000-0000-CATEGORY0004', 'Collectibles', 'collectibles', 'Unique digital items and memorabilia.', 'ToyBrick'),
('cat_00000000-0000-0000-0000-CATEGORY0005', 'Virtual Worlds', 'virtual-worlds', 'Assets for metaverses and virtual environments.', 'Globe'),
('cat_00000000-0000-0000-0000-CATEGORY0006', 'Utility Tokens', 'utility-tokens', 'NFTs that grant access, perks, or functionalities.', 'Bitcoin'),
('cat_00000000-0000-0000-0000-CATEGORY0007', 'Generative Art', 'generative-art', 'Art created using autonomous systems, often involving algorithms and code.', 'Sparkles'),
('cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Art', 'pixel-art', 'Digital art created using raster graphics software, where images are edited on the pixel level.', 'Grid');

-- Collections
INSERT INTO `collections` (`id`, `user_id`, `name`, `description`) VALUES
('col_00000000-0000-0000-0000-COLLECTION01', 'usr_00000000-0000-0000-0000-000000000001', 'My Abstract Dreams', 'A collection of my first abstract pieces.'),
('col_00000000-0000-0000-0000-COLLECTION02', 'usr_00000000-0000-0000-0000-000000000002', 'Nature_s Beauty', 'Photographs capturing the essence of nature.'),
('col_00000000-0000-0000-0000-COLLECTION03', 'usr_00000000-0000-0000-0000-000000000010', 'Pixel Perfect Picks', 'Curated collection of pixel art.');


-- NFTs
INSERT INTO `nfts` (`id`, `title`, `description`, `image_url`, `creator_id`, `owner_id`, `category_id`, `collection_id`, `price_eth`, `status`, `is_auction`, `auction_ends_at`, `tags`, `attributes`) VALUES
('nft_00000000-0000-0000-0000-MOCK00000001', 'My First Abstract', 'An exploration of color and form.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'col_00000000-0000-0000-0000-COLLECTION01', 0.5, 'listed', FALSE, NULL, '["abstract", "colorful", "digital"]', '{"style": "geometric", "mood": "vibrant"}'),
('nft_00000000-0000-0000-0000-MOCK00000002', 'Pixel Pal', 'A friendly pixel character.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0008', NULL, 0.2, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 3 DAY), '["pixel", "character", "cute"]', '{"eyes": "blue", "type": "pal"}'),
('nft_00000000-0000-0000-0000-MOCK00000003', 'Dream Weaver #1', 'Surreal landscape from another dimension.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0001', NULL, 1.2, 'listed', FALSE, NULL, '["surreal", "landscape", "dream"]', '{"dominant_color": "purple", "time_of_day": "twilight"}'),
('nft_00000000-0000-0000-0000-MOCK00000004', 'Ephemeral Light', 'A moment of light captured.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000002', 'cat_00000000-0000-0000-0000-CATEGORY0002', 'col_00000000-0000-0000-0000-COLLECTION02', 0.8, 'listed', FALSE, NULL, '["light", "abstract", "photography"]', '{"camera_type": "DSLR", "filter": "long_exposure"}'),
('nft_00000000-0000-0000-0000-MOCK00000005', 'Dream Weaver #2', 'Another surreal landscape, deeper into the dream.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0001', NULL, 1.5, 'sold', FALSE, NULL, '["surreal", "landscape", "dream", "ethereal"]', '{"dominant_color": "blue", "time_of_day": "midnight"}'),
('nft_00000000-0000-0000-0000-MOCK00000006', 'Vintage Robot', 'A collectible retro robot figurine.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000003', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0004', NULL, 0.75, 'listed', FALSE, NULL, '["robot", "vintage", "collectible"]', '{"material": "tin", "era": "1950s"}'),
('nft_00000000-0000-0000-0000-MOCK00000007', 'Cybernetic Orb', 'A floating orb from a cyberpunk future.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', NULL, 2.0, 'listed', FALSE, NULL, '["cyberpunk", "orb", "3d", "sci-fi"]', '{"texture": "metallic", "glow_color": "neon_blue"}'),
('nft_00000000-0000-0000-0000-MOCK00000008', 'Mech Suit Alpha', 'Concept art for a futuristic mech suit.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000005', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0001', NULL, 3.5, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 5 DAY), '["mech", "sci-fi", "concept_art", "robot"]', '{"weaponry": "laser_cannon", "class": "heavy_assault"}'),
('nft_00000000-0000-0000-0000-MOCK00000009', 'Retro Wave Loop', 'An 80s inspired synthwave music loop.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000009', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0003', NULL, 0.4, 'listed', FALSE, NULL, '["music", "synthwave", "retro", "80s", "loop"]', '{"bpm": "120", "key": "C_minor", "duration_sec": "60"}'),
('nft_00000000-0000-0000-0000-MOCK00000010', '80s Nostalgia Beat', 'A catchy beat with pure 80s vibes.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', NULL, 0.6, 'listed', FALSE, NULL, '["music", "beat", "80s", "nostalgia"]', '{"genre": "synth-pop", "mood": "upbeat"}'),
('nft_00000000-0000-0000-0000-MOCK00000011', 'Pixel Knight #001', 'The first knight in the Pixel Kingdom series.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'col_00000000-0000-0000-0000-COLLECTION03', 0.3, 'sold', FALSE, NULL, '["pixel_art", "knight", "collectible", "series_1"]', '{"weapon": "sword", "armor": "steel"}'),
('nft_00000000-0000-0000-0000-MOCK00000012', 'Pixel Forest Scene', 'A serene forest rendered in pixel art.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000010', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0008', 'col_00000000-0000-0000-0000-COLLECTION03', 0.5, 'listed', FALSE, NULL, '["pixel_art", "forest", "landscape", "serene"]', '{"time_of_day": "dusk", "season": "autumn"}'),
('nft_00000000-0000-0000-0000-MOCK00000013', 'Pixel Dragonling', 'A cute baby dragon in pixel form.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000010', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0008', NULL, 0.7, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 7 DAY), '["pixel_art", "dragon", "cute", "fantasy"]', '{"element": "fire", "rarity": "rare"}'),
('nft_00000000-0000-0000-0000-MOCK00000014', 'Generative Swirls #7', 'Unique patterns generated by code.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000004', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0007', NULL, 1.0, 'listed', FALSE, NULL, '["generative_art", "abstract", "swirls", "unique"]', '{"algorithm": "perlin_noise", "color_palette": "oceanic"}'),
('nft_00000000-0000-0000-0000-MOCK00000015', 'Mountain Vista Photo', 'A stunning photograph of a mountain range.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000006', 'usr_00000000-0000-0000-0000-000000000006', 'cat_00000000-0000-0000-0000-CATEGORY0002', 'col_00000000-0000-0000-0000-COLLECTION02', 0.9, 'listed', FALSE, NULL, '["photography", "mountains", "landscape", "nature"]', '{"location": "Andes", "time_shot": "golden_hour"}'),
('nft_00000000-0000-0000-0000-MOCK00000016', 'VR Gallery Access Key', 'Grants access to an exclusive VR art gallery.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000007', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0006', NULL, 2.5, 'listed', FALSE, NULL, '["utility", "access_key", "vr_gallery", "exclusive"]', '{"utility_type": "access", "platform": "Decentraland"}'),
('nft_00000000-0000-0000-0000-MOCK00000017', 'Lost Temple - Game Asset', 'A 3D model of a temple for game development.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000008', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0005', NULL, 1.8, 'listed', FALSE, NULL, '["game_asset", "3d_model", "temple", "virtual_world"]', '{"poly_count": "15000", "engine_compatibility": "Unreal_Unity"}'),
('nft_00000000-0000-0000-0000-MOCK00000018', 'Cosmic Abstract #42', 'Another exploration of cosmic themes.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'col_00000000-0000-0000-0000-COLLECTION01', 0.65, 'hidden', FALSE, NULL, '["abstract", "cosmic", "digital"]', '{"style": "fluid", "mood": "mysterious"}'),
('nft_00000000-0000-0000-0000-MOCK00000019', 'Pixel Mage Character', 'A powerful mage rendered in pixel art.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000010', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'col_00000000-0000-0000-0000-COLLECTION03', 0.4, 'listed', FALSE, NULL, '["pixel_art", "mage", "fantasy", "character"]', '{"spell_type": "fireball", "level": "15"}'),
('nft_00000000-0000-0000-0000-MOCK00000020', 'Serene Lake Photograph', 'Peaceful lake reflecting the sky.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000006', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0002', 'col_00000000-0000-0000-0000-COLLECTION02', 0.7, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 2 DAY), '["photography", "lake", "serene", "reflection", "nature"]', '{"camera_type": "Mirrorless", "lens": "50mm"}'),
('nft_00000000-0000-0000-0000-MOCK00000021', 'Chillhop Beat "Sunset"', 'A relaxing chillhop track perfect for sunsets.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', NULL, 0.25, 'listed', FALSE, NULL, '["music", "chillhop", "lofi", "beat", "sunset"]', '{"bpm": "80", "mood": "relaxed"}'),
('nft_00000000-0000-0000-0000-MOCK00000022', 'Cyberpunk Alleyway 3D', 'A detailed 3D render of a futuristic alley.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', NULL, 2.2, 'listed', FALSE, NULL, '["cyberpunk", "3d_render", "sci-fi", "cityscape", "futuristic"]', '{"time_of_day": "night", "weather": "rainy"}'),
('nft_00000000-0000-0000-0000-MOCK00000023', 'Generative Patterns Alpha', 'Early series of unique generative patterns.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000004', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0007', NULL, 0.9, 'draft', FALSE, NULL, '["generative_art", "patterns", "code_art", "monochrome"]', '{"complexity": "medium", "series": "Alpha"}'),
('nft_00000000-0000-0000-0000-MOCK00000024', 'Utility Key - Beta Access', 'Exclusive key for beta testing a new dApp.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000007', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0006', NULL, 1.1, 'pending_moderation', FALSE, NULL, '["utility", "beta_access", "key", "dapp", "exclusive"]', '{"utility_type": "software_access", "version": "0.1"}'),
('nft_00000000-0000-0000-0000-MOCK00000025', 'Collectible Card #007', 'Rare collectible trading card - Series 1.', 'https://placehold.co/600x600.png', 'usr_00000000-0000-0000-0000-000000000003', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0004', NULL, 0.35, 'listed', FALSE, NULL, '["collectible", "trading_card", "rare", "series_1"]', '{"card_type": "character", "power_level": "85"}');


-- Favorites
INSERT INTO `favorites` (`user_id`, `nft_id`) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000003'), -- TestUser01 favorites Dream Weaver #1
('usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000007'), -- TestUser01 favorites Cybernetic Orb
('usr_00000000-0000-0000-0000-000000000002', 'nft_00000000-0000-0000-0000-MOCK00000001'); -- ArtIsLife favorites My First Abstract

-- Bids
INSERT INTO `bids` (`id`, `nft_id`, `user_id`, `bid_amount_eth`) VALUES
('bid_00000000-0000-0000-0000-MOCKBID00001', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000004', 0.25), -- CryptoGallery bids on Pixel Pal
('bid_00000000-0000-0000-0000-MOCKBID00002', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000003', 0.30), -- NFTCollectorGal outbids on Pixel Pal
('bid_00000000-0000-0000-0000-MOCKBID00003', 'nft_00000000-0000-0000-0000-MOCK00000013', 'usr_00000000-0000-0000-0000-000000000001', 0.75); -- TestUser01 bids on Pixel Dragonling


-- Transactions
INSERT INTO `transactions` (`id`, `nft_id`, `buyer_id`, `seller_id`, `transaction_type`, `amount_eth`, `status`) VALUES
('txn_00000000-0000-0000-0000-MOCKTXN00001', 'nft_00000000-0000-0000-0000-MOCK00000011', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000010', 'purchase', 0.3, 'completed'), -- TestUser01 buys Pixel Knight from PixelPioneer
('txn_00000000-0000-0000-0000-MOCKTXN00002', 'nft_00000000-0000-0000-0000-MOCK00000005', 'usr_00000000-0000-0000-0000-000000000004', 'usr_00000000-0000-0000-0000-000000000002', 'sale', 1.5, 'completed'); -- ArtIsLife sells Dream Weaver #2 to CryptoGallery


-- Platform Settings
INSERT INTO `platform_settings` (`setting_key`, `setting_value`, `description`, `type`, `is_public`) VALUES
('site_name', 'ArtNFT Marketplace', 'The official name of the platform.', 'string', TRUE),
('maintenance_mode', 'false', 'Controls whether the site is in maintenance mode.', 'boolean', TRUE),
('default_royalty_percentage', '10', 'Default royalty percentage for new NFTs.', 'number', FALSE),
('max_file_upload_size_mb', '10', 'Maximum file size for NFT image uploads in MB.', 'number', FALSE),
('theme_primary_color', '#7DF9FF', 'Primary theme color (Electric Blue).', 'theme_color', TRUE),
('theme_accent_color', '#FF69B4', 'Accent theme color (Soft Pink).', 'theme_color', TRUE);


-- Admin Audit Log
INSERT INTO `admin_audit_log` (`id`, `admin_user_id`, `action_type`, `target_entity_id`, `target_entity_type`, `details`) VALUES
('audit_00000000-0000-0000-MOCKAUDIT0001', 'usr_00000000-0000-0000-0000-000000000000', 'USER_STATUS_CHANGED', 'usr_00000000-0000-0000-0000-000000000002', 'user', '{"old_status": "active", "new_status": "suspended", "reason": "Policy violation review"}'),
('audit_00000000-0000-0000-MOCKAUDIT0002', 'usr_00000000-0000-0000-0000-000000000000', 'PLATFORM_SETTING_UPDATED', 'maintenance_mode', 'platform_setting', '{"old_value": "false", "new_value": "true"}');


-- Notifications
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `related_entity_id`, `related_entity_type`) VALUES
('notif_00000000-0000-0000-MOCKNOTIF0001', 'usr_00000000-0000-0000-0000-000000000001', 'bid_outbid', 'You_ve been outbid!', 'Your bid on "Pixel Pal" was outbid by NFTCollectorGal.', 'nft_00000000-0000-0000-0000-MOCK00000002', 'nft'),
('notif_00000000-0000-0000-MOCKNOTIF0002', 'usr_00000000-0000-0000-0000-000000000002', 'sale_success', 'NFT Sold!', '"Dream Weaver #2" has been sold to CryptoGallery.', 'nft_00000000-0000-0000-0000-MOCK00000005', 'nft'),
('notif_00000000-0000-0000-MOCKNOTIF0003', 'usr_00000000-0000-0000-0000-000000000004', 'purchase_success', 'Purchase Confirmed!', 'You successfully purchased "Dream Weaver #2".', 'nft_00000000-0000-0000-0000-MOCK00000005', 'nft');
