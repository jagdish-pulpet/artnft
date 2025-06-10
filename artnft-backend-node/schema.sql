
-- ArtNFT Marketplace Database Schema
-- Version: 1.0.0
-- Target Database: MySQL (MariaDB compatible for XAMPP)

SET FOREIGN_KEY_CHECKS=0; -- Disable FK checks temporarily

-- Drop tables if they exist (for easy re-creation during development)
DROP TABLE IF EXISTS `user_notification_preferences`;
DROP TABLE IF EXISTS `admin_audit_log`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `promotions`;
DROP TABLE IF EXISTS `platform_settings`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `bids`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `user_follows`;
DROP TABLE IF EXISTS `nfts`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;


-- ================================================================================================
-- Core Tables
-- ================================================================================================

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the user',
  `username` VARCHAR(50) UNIQUE COMMENT 'Public username, can be null initially',
  `email` VARCHAR(100) UNIQUE NOT NULL COMMENT 'User email, used for login',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  `avatar_url` VARCHAR(255) COMMENT 'URL to user avatar image',
  `bio` TEXT COMMENT 'User biography',
  `wallet_address` VARCHAR(255) UNIQUE COMMENT 'User crypto wallet address',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT 'User role (user or admin)',
  `status` ENUM('active', 'suspended', 'pending_verification', 'deleted') NOT NULL DEFAULT 'active' COMMENT 'User account status',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user account information, credentials, and profile details.';

-- Default Admin User (Password: adminpass)
-- BCrypt hash for 'adminpass': $2a$10$vQvN7.xpbvXMLFZ4d8x.7.N.x89X2L.r/uT.Z9.JjK.dKjZ.jK4zK
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `status`) VALUES
('usr_00000000-0000-0000-0000-000000000000', 'AdminUser', 'admin@artnft.com', '$2a$10$vQvN7.xpbvXMLFZ4d8x.7.N.x89X2L.r/uT.Z9.JjK.dKjZ.jK4zK', 'admin', 'active'),
('usr_00000000-0000-0000-0000-000000000001', 'TestUser01', 'testuser@artnft.com', '$2a$10$vQvN7.xpbvXMLFZ4d8x.7.N.x89X2L.r/uT.Z9.JjK.dKjZ.jK4zK', 'user', 'active'),
('usr_00000000-0000-0000-0000-000000000002', 'ArtIsLife', 'artist@example.com', '$2a$10$5y02H8jZLFYF6mXo6U7vne2j4j0N2sD6Y04zF1K8u2mX8t6Y8rF0a', 'user', 'active'), -- artistpass
('usr_00000000-0000-0000-0000-000000000003', 'NFTCollectorGal', 'collector@example.com', '$2a$10$WbL0zG2n6x8s0N2lD9rJ8uP0sV4kF7uB6jY1mX0zR9k2L5tO8pQ2a', 'user', 'active'), -- collectorpass
('usr_00000000-0000-0000-0000-000000000004', 'CryptoGallery', 'gallery@example.com', '$2a$10$SjP8zF3mQ1nL0xR7kY5vB2oU6tG9jV4b0N2sD1K8u2mX8t6Y8rF0a', 'user', 'active'), -- gallerypass
('usr_00000000-0000-0000-0000-000000000005', 'DigitalCreatorPro', 'creator@example.com', '$2a$10$VnK7zQ0jR9sX4mB1lP8oT6uG2dY5vF3k0N2sD1K8u2mX8t6Y8rF0a', 'user', 'active'), -- creatorpass
('usr_00000000-0000-0000-0000-000000000006', 'ArtViewer22', 'viewer@example.com', '$2a$10$M0nL8kP2qX5vB1jR7tG9oU6zF3dY0sV4k2N1sD8u2mX8t6Y8rF0a', 'user', 'active'), -- viewerpass
('usr_00000000-0000-0000-0000-000000000007', 'NFTInvestorX', 'investor@example.com', '$2a$10$PqR0sV4kF7uB6jY1mX0zR9k2L5tO8pQ2a3N2sD1K8u2mX8t6Y8rF0a', 'user', 'active'), -- investorpass
('usr_00000000-0000-0000-0000-000000000008', 'UXDesignerArt', 'designer@example.com', '$2a$10$X5vB1jR7tG9oU6zF3dY0sV4k2N1sD8u2mX8t6Y8rF0aM0nL8kP2q', 'user', 'active'), -- designerpass
('usr_00000000-0000-0000-0000-000000000009', 'SynthMusician', 'musician@example.com', '$2a$10$jR7tG9oU6zF3dY0sV4k2N1sD8u2mX8t6Y8rF0aM0nL8kP2qX5vB1', 'user', 'active'), -- musicianpass
('usr_00000000-0000-0000-0000-000000000010', 'PixelPioneer', 'pixel@example.com', '$2a$10$oU6zF3dY0sV4k2N1sD8u2mX8t6Y8rF0aM0nL8kP2qX5vB1jR7tG9', 'user', 'active'); -- pixelpass


-- -----------------------------------------------------
-- Table `categories`
-- -----------------------------------------------------
CREATE TABLE `categories` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the category',
  `name` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Category name (e.g., Digital Art, Photography)',
  `slug` VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL-friendly slug for the category',
  `description` TEXT COMMENT 'Optional description of the category',
  `icon` VARCHAR(50) COMMENT 'Lucide icon name or path to custom icon (optional)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores NFT categories for organization and discovery.';

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`) VALUES
('cat_00000000-0000-0000-0000-CATEGORY0001', 'Digital Art', 'digital-art', 'Creations made with digital technologies.', 'Palette'),
('cat_00000000-0000-0000-0000-CATEGORY0002', 'Photography', 'photography', 'Art captured through the lens.', 'Camera'),
('cat_00000000-0000-0000-0000-CATEGORY0003', 'Music', 'music', 'Audio NFTs and music-related collectibles.', 'Music2'),
('cat_00000000-0000-0000-0000-CATEGORY0004', 'Collectibles', 'collectibles', 'Unique digital items and memorabilia.', 'ToyBrick'),
('cat_00000000-0000-0000-0000-CATEGORY0005', 'Virtual Worlds', 'virtual-worlds', 'Assets for metaverses and virtual environments.', 'Globe'),
('cat_00000000-0000-0000-0000-CATEGORY0006', 'Utility Tokens', 'utility-tokens', 'NFTs that provide specific functionalities or access.', 'Bitcoin'),
('cat_00000000-0000-0000-0000-CATEGORY0007', 'Generative Art', 'generative-art', 'Art created algorithmically.', 'Sparkles'),
('cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Art', 'pixel-art', 'Art created at the pixel level.', 'Grid');


-- -----------------------------------------------------
-- Table `collections`
-- -----------------------------------------------------
CREATE TABLE `collections` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the collection',
  `user_id` VARCHAR(36) NOT NULL COMMENT 'Creator/owner of the collection',
  `name` VARCHAR(150) NOT NULL COMMENT 'Name of the collection',
  `slug` VARCHAR(150) UNIQUE NOT NULL COMMENT 'URL-friendly slug for the collection',
  `description` TEXT COMMENT 'Description of the collection',
  `cover_image_url` VARCHAR(255) COMMENT 'URL for the collection cover image',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_collections_user_id` (`user_id`),
  INDEX `idx_collections_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Allows users to group their NFTs into named collections.';

INSERT INTO `collections` (`id`, `user_id`, `name`, `slug`, `description`, `cover_image_url`) VALUES
('col_00000000-0000-0000-0000-COLLECTION01', 'usr_00000000-0000-0000-0000-000000000001', 'My First Abstracts', 'my-first-abstracts', 'A collection of my initial abstract digital art pieces.', 'https://placehold.co/600x300.png'),
('col_00000000-0000-0000-0000-COLLECTION02', 'usr_00000000-0000-0000-0000-000000000001', 'Pixel Pals Series 1', 'pixel-pals-s1', 'The first series of unique Pixel Pal characters.', 'https://placehold.co/600x300.png'),
('col_00000000-0000-0000-0000-COLLECTION03', 'usr_00000000-0000-0000-0000-000000000010', 'Pixel Perfect Picks', 'pixel-perfect-picks', 'A curated collection of pixel art.', 'https://placehold.co/600x300.png'),
('col_00000000-0000-0000-0000-COLLECTION04', 'usr_00000000-0000-0000-0000-000000000002', 'Ephemeral Captures', 'ephemeral-captures', 'Moments in light and time.', 'https://placehold.co/600x300.png'),
('col_00000000-0000-0000-0000-COLLECTION05', 'usr_00000000-0000-0000-0000-000000000005', 'Cybernetic Visions', 'cybernetic-visions', 'Explorations of a digital future.', 'https://placehold.co/600x300.png');


-- -----------------------------------------------------
-- Table `nfts`
-- -----------------------------------------------------
CREATE TABLE `nfts` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the NFT',
  `creator_id` VARCHAR(36) NOT NULL COMMENT 'User ID of the NFT creator',
  `owner_id` VARCHAR(36) COMMENT 'User ID of the current NFT owner (can be same as creator, or null if platform owned initially)',
  `category_id` VARCHAR(36) COMMENT 'Category ID this NFT belongs to',
  `collection_id` VARCHAR(36) COMMENT 'Collection ID this NFT belongs to (optional)',
  `title` VARCHAR(255) NOT NULL COMMENT 'Title of the NFT',
  `description` TEXT COMMENT 'Detailed description of the NFT',
  `image_url` VARCHAR(255) NOT NULL COMMENT 'URL to the primary image of the NFT',
  `metadata_url` VARCHAR(255) COMMENT 'URL to the off-chain metadata JSON (optional)',
  `price_eth` DECIMAL(18,8) COMMENT 'Current price in ETH if for sale, or starting bid',
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'ETH',
  `status` ENUM('pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft') NOT NULL DEFAULT 'draft' COMMENT 'Current status of the NFT',
  `is_auction` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'True if the NFT is currently up for auction',
  `auction_ends_at` TIMESTAMP NULL COMMENT 'Timestamp when the auction ends',
  `tags` JSON COMMENT 'JSON array of tags/keywords for discoverability',
  `attributes` JSON COMMENT 'JSON object for custom properties/traits (e.g., {"trait_type": "Color", "value": "Red"})',
  `royalty_percentage` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Royalty percentage for secondary sales (0-100)',
  `unlockable_content_url` VARCHAR(255) COMMENT 'URL to unlockable content (visible only to owner)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_nfts_creator_id` (`creator_id`),
  INDEX `idx_nfts_owner_id` (`owner_id`),
  INDEX `idx_nfts_category_id` (`category_id`),
  INDEX `idx_nfts_collection_id` (`collection_id`),
  INDEX `idx_nfts_status` (`status`),
  INDEX `idx_nfts_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores all NFT details, including metadata, ownership, and sale status.';

INSERT INTO `nfts` (`id`, `creator_id`, `owner_id`, `category_id`, `collection_id`, `title`, `description`, `image_url`, `price_eth`, `status`, `is_auction`, `auction_ends_at`, `tags`, `attributes`, `royalty_percentage`) VALUES
('nft_00000000-0000-0000-0000-MOCK00000001', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'col_00000000-0000-0000-0000-COLLECTION01', 'My First Abstract', 'An exploration of color and form.', 'https://placehold.co/400x400.png', 0.5, 'listed', FALSE, NULL, '["abstract", "colorful", "digital"]', '[{"trait_type": "Style", "value": "Abstract"}, {"trait_type": "Mood", "value": "Vibrant"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'col_00000000-0000-0000-0000-COLLECTION02', 'Pixel Pal', 'A friendly pixel character.', 'https://placehold.co/400x400.png', 0.2, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 7 DAY), '["pixel art", "character", "cute"]', '[{"trait_type": "Type", "value": "Character"}, {"trait_type": "Style", "value": "Pixel"}]', 10.00),
('nft_00000000-0000-0000-0000-MOCK00000003', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000002', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'col_00000000-0000-0000-0000-COLLECTION04', 'Dream Weaver #1', 'Surreal landscape from the Dream Weaver series.', 'https://placehold.co/400x400.png', 1.2, 'listed', FALSE, NULL, '["surreal", "landscape", "dream"]', '[{"trait_type": "Series", "value": "Dream Weaver"}, {"trait_type": "Edition", "value": "1/10"}]', 7.50),
('nft_00000000-0000-0000-0000-MOCK00000004', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000002', 'cat_00000000-0000-0000-0000-CATEGORY0002', NULL, 'Ephemeral Light', 'Capturing a fleeting moment of light.', 'https://placehold.co/400x400.png', 0.8, 'listed', FALSE, NULL, '["photography", "light", "abstract"]', '[{"trait_type": "Medium", "value": "Photography"}, {"trait_type": "Subject", "value": "Light Study"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000005', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0001', NULL, 'Dream Weaver #2', 'Another piece from the popular Dream Weaver series.', 'https://placehold.co/400x400.png', 1.5, 'sold', FALSE, NULL, '["surreal", "landscape", "dream"]', '[{"trait_type": "Series", "value": "Dream Weaver"}, {"trait_type": "Edition", "value": "2/10"}]', 7.50),
('nft_00000000-0000-0000-0000-MOCK00000006', 'usr_00000000-0000-0000-0000-000000000003', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0004', NULL, 'Vintage Robot', 'A classic collectible robot design.', 'https://placehold.co/400x400.png', 0.75, 'listed', FALSE, NULL, '["collectible", "robot", "vintage"]', '[{"trait_type": "Type", "value": "Robot"}, {"trait_type": "Era", "value": "Vintage"}]', 10.00),
('nft_00000000-0000-0000-0000-MOCK00000007', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'col_00000000-0000-0000-0000-COLLECTION05', 'Cybernetic Orb', 'A mesmerizing 3D orb from a cybernetic future.', 'https://placehold.co/400x400.png', 2.0, 'listed', FALSE, NULL, '["3d", "orb", "cyberpunk", "sci-fi"]', '[{"trait_type": "Material", "value": "Chrome"}, {"trait_type": "Energy", "value": "High"}]', 7.50),
('nft_00000000-0000-0000-0000-MOCK00000008', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'col_00000000-0000-0000-0000-COLLECTION05', 'Mech Suit Alpha', 'Concept art for a futuristic mech suit.', 'https://placehold.co/400x400.png', 3.5, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 5 DAY), '["concept art", "mech", "sci-fi", "robot"]', '[{"trait_type": "Class", "value": "Heavy Assault"}, {"trait_type": "Status", "value": "Prototype"}]', 10.00),
('nft_00000000-0000-0000-0000-MOCK00000009', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', NULL, 'Retro Wave Loop', 'An 8-bit inspired synthwave music loop.', 'https://placehold.co/400x400.png', 0.4, 'listed', FALSE, NULL, '["music", "synthwave", "8-bit", "loop"]', '[{"trait_type": "Genre", "value": "Synthwave"}, {"trait_type": "Duration", "value": "30s Loop"}]', 12.00),
('nft_00000000-0000-0000-0000-MOCK00000010', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', NULL, '80s Nostalgia Beat', 'A beat reminiscent of classic 80s tracks.', 'https://placehold.co/400x400.png', 0.6, 'listed', FALSE, NULL, '["music", "80s", "beat", "retro"]', '[{"trait_type": "Genre", "value": "Electronic"}, {"trait_type": "BPM", "value": "120"}]', 10.00),
('nft_00000000-0000-0000-0000-MOCK00000011', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0008', NULL, 'Pixel Knight #001', 'The first knight in the Pixel Heroes series.', 'https://placehold.co/400x400.png', 0.3, 'sold', FALSE, NULL, '["pixel art", "knight", "collectible", "hero"]', '[{"trait_type": "Series", "value": "Pixel Heroes"}, {"trait_type": "Class", "value": "Knight"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000012', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000010', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'col_00000000-0000-0000-0000-COLLECTION03', 'Pixel Forest Scene', 'A serene forest scene rendered in pixel art.', 'https://placehold.co/400x400.png', 0.5, 'listed', FALSE, NULL, '["pixel art", "landscape", "forest", "nature"]', '[{"trait_type": "Environment", "value": "Forest"}, {"trait_type": "Time of Day", "value": "Day"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000013', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000010', 'cat_00000000-0000-0000-0000-CATEGORY0008', NULL, 'Pixel Dragonling', 'A cute baby dragon in pixel form.', 'https://placehold.co/400x400.png', 0.7, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 3 DAY), '["pixel art", "dragon", "cute", "fantasy"]', '[{"trait_type": "Creature", "value": "Dragon"}, {"trait_type": "Age", "value": "Young"}]', 8.00),
('nft_00000000-0000-0000-0000-MOCK00000014', 'usr_00000000-0000-0000-0000-000000000004', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0007', NULL, 'Generative Swirls #7', 'Unique patterns generated by an algorithm.', 'https://placehold.co/400x400.png', 1.0, 'listed', FALSE, NULL, '["generative art", "abstract", "patterns", "algorithmic"]', '[{"trait_type": "Algorithm", "value": "SwirlMaster v2"}, {"trait_type": "Iteration", "value": "7"}]', 10.00),
('nft_00000000-0000-0000-0000-MOCK00000015', 'usr_00000000-0000-0000-0000-000000000006', 'usr_00000000-0000-0000-0000-000000000006', 'cat_00000000-0000-0000-0000-CATEGORY0002', NULL, 'Mountain Vista Photo', 'A stunning photograph of a mountain range at dawn.', 'https://placehold.co/400x400.png', 0.9, 'listed', FALSE, NULL, '["photography", "landscape", "mountains", "nature", "dawn"]', '[{"trait_type": "Location", "value": "Andes"}, {"trait_type": "Time", "value": "Sunrise"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000016', 'usr_00000000-0000-0000-0000-000000000007', 'usr_00000000-0000-0000-0000-000000000007', 'cat_00000000-0000-0000-0000-CATEGORY0006', NULL, 'VR Gallery Access Key', 'Grants exclusive access to a virtual reality art gallery.', 'https://placehold.co/400x400.png', 2.5, 'listed', FALSE, NULL, '["utility", "vr", "access key", "gallery"]', '[{"trait_type": "Utility", "value": "Gallery Access"}, {"trait_type": "Tier", "value": "VIP"}]', 0.00),
('nft_00000000-0000-0000-0000-MOCK00000017', 'usr_00000000-0000-0000-0000-000000000008', 'usr_00000000-0000-0000-0000-000000000008', 'cat_00000000-0000-0000-0000-CATEGORY0005', NULL, 'Lost Temple - Game Asset', 'A 3D model of a lost temple, ready for use in virtual worlds.', 'https://placehold.co/400x400.png', 1.8, 'listed', FALSE, NULL, '["virtual world", "game asset", "3d model", "temple"]', '[{"trait_type": "Type", "value": "Environment Asset"}, {"trait_type": "Polygons", "value": "15000"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000018', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000002', 'cat_00000000-0000-0000-0000-CATEGORY0001', NULL, 'Cosmic Abstract #42', 'Deep space abstract painting.', 'https://placehold.co/400x400.png', 0.65, 'hidden', FALSE, NULL, '["abstract", "space", "cosmic"]', '[{"trait_type": "Style", "value": "Abstract"}, {"trait_type": "Dominant Color", "value": "Deep Blue"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000019', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000010', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'col_00000000-0000-0000-0000-COLLECTION03', 'Pixel Mage Character', 'A powerful mage in pixel art form.', 'https://placehold.co/400x400.png', 0.4, 'listed', FALSE, NULL, '["pixel art", "mage", "character", "fantasy"]', '[{"trait_type": "Class", "value": "Mage"}, {"trait_type": "Element", "value": "Fire"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000020', 'usr_00000000-0000-0000-0000-000000000006', 'usr_00000000-0000-0000-0000-000000000006', 'cat_00000000-0000-0000-0000-CATEGORY0002', NULL, 'Serene Lake Photograph', 'A peaceful lake scene captured at sunset.', 'https://placehold.co/400x400.png', 0.7, 'on_auction', TRUE, DATE_ADD(NOW(), INTERVAL 2 DAY), '["photography", "landscape", "lake", "sunset"]', '[{"trait_type": "Location", "value": "Lake Serenity"}, {"trait_type": "Time", "value": "Sunset"}]', 5.00),
('nft_00000000-0000-0000-0000-MOCK00000021', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', NULL, 'Chillhop Beat "Sunset"', 'A relaxing chillhop beat perfect for studying or relaxing.', 'https://placehold.co/400x400.png', 0.25, 'listed', FALSE, NULL, '["music", "chillhop", "lofi", "beat"]', '[{"trait_type": "Genre", "value": "Chillhop"}, {"trait_type": "Mood", "value": "Relaxing"}]', 15.00),
('nft_00000000-0000-0000-0000-MOCK00000022', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'col_00000000-0000-0000-0000-COLLECTION05', 'Cyberpunk Alleyway 3D', 'A detailed 3D render of a futuristic cyberpunk alley.', 'https://placehold.co/400x400.png', 2.2, 'listed', FALSE, NULL, '["3d", "cyberpunk", "cityscape", "sci-fi"]', '[{"trait_type": "Setting", "value": "Urban Night"}, {"trait_type": "Atmosphere", "value": "Gritty"}]', 7.50),
('nft_00000000-0000-0000-0000-MOCK00000023', 'usr_00000000-0000-0000-0000-000000000004', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0007', NULL, 'Generative Patterns Alpha', 'Early series of unique generative patterns.', 'https://placehold.co/400x400.png', 0.9, 'draft', FALSE, NULL, '["generative art", "patterns", "monochrome"]', '[{"trait_type": "Series", "value": "Alpha Patterns"}, {"trait_type": "Complexity", "value": "Medium"}]', 10.00),
('nft_00000000-0000-0000-0000-MOCK00000024', 'usr_00000000-0000-0000-0000-000000000007', 'usr_00000000-0000-0000-0000-000000000007', 'cat_00000000-0000-0000-0000-CATEGORY0006', NULL, 'Utility Key - Beta Access', 'Grants beta access to an upcoming DApp.', 'https://placehold.co/400x400.png', 1.1, 'pending_moderation', FALSE, NULL, '["utility", "beta access", "dapp", "key"]', '[{"trait_type": "Utility", "value": "Beta Access"}, {"trait_type": "Project", "value": "Project Chimera"}]', 0.00),
('nft_00000000-0000-0000-0000-MOCK00000025', 'usr_00000000-0000-0000-0000-000000000003', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0004', NULL, 'Collectible Card #007', 'A rare collectible trading card from Series Alpha.', 'https://placehold.co/400x400.png', 0.35, 'listed', FALSE, NULL, '["collectible", "card", "trading card", "rare"]', '[{"trait_type": "Series", "value": "Alpha"}, {"trait_type": "Number", "value": "#007"}]', 8.00);


-- ================================================================================================
-- Interaction & Supporting Tables
-- ================================================================================================

-- -----------------------------------------------------
-- Table `bids`
-- -----------------------------------------------------
CREATE TABLE `bids` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the bid',
  `nft_id` VARCHAR(36) NOT NULL COMMENT 'NFT being bid on',
  `user_id` VARCHAR(36) NOT NULL COMMENT 'User who placed the bid',
  `bid_amount_eth` DECIMAL(18,8) NOT NULL COMMENT 'Amount of the bid in ETH',
  `bid_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when bid was placed',
  `status` ENUM('active', 'outbid', 'won', 'cancelled') NOT NULL DEFAULT 'active',
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_bids_nft_id` (`nft_id`),
  INDEX `idx_bids_user_id` (`user_id`),
  INDEX `idx_bids_nft_amount_desc` (`nft_id`, `bid_amount_eth` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores bids made on NFTs during auctions.';

INSERT INTO `bids` (`id`, `nft_id`, `user_id`, `bid_amount_eth`, `status`) VALUES
('bid_00000000-0000-0000-0000-MOCKBID00001', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000003', 0.30, 'active'), -- NFTCollectorGal bids on Pixel Pal
('bid_00000000-0000-0000-0000-MOCKBID00002', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000004', 0.25, 'outbid'); -- CryptoGallery bid earlier on Pixel Pal

-- -----------------------------------------------------
-- Table `favorites`
-- -----------------------------------------------------
CREATE TABLE `favorites` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the favorite entry',
  `user_id` VARCHAR(36) NOT NULL COMMENT 'User who favorited the NFT',
  `nft_id` VARCHAR(36) NOT NULL COMMENT 'NFT that was favorited',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `uk_favorites_user_nft` (`user_id`, `nft_id`),
  INDEX `idx_favorites_user_id` (`user_id`),
  INDEX `idx_favorites_nft_id` (`nft_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks NFTs favorited by users.';

INSERT INTO `favorites` (`id`, `user_id`, `nft_id`) VALUES
('fav_00000000-0000-0000-0000-MOCKFAV00001', 'usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000003'), -- TestUser01 favorites Dream Weaver #1
('fav_00000000-0000-0000-0000-MOCKFAV00002', 'usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000007'); -- TestUser01 favorites Cybernetic Orb

-- -----------------------------------------------------
-- Table `transactions`
-- -----------------------------------------------------
CREATE TABLE `transactions` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the transaction',
  `nft_id` VARCHAR(36) COMMENT 'Associated NFT (can be null for platform fees or other non-NFT tx)',
  `buyer_id` VARCHAR(36) COMMENT 'User ID of the buyer (if applicable)',
  `seller_id` VARCHAR(36) COMMENT 'User ID of the seller (if applicable)',
  `transaction_type` ENUM('mint', 'sale', 'transfer', 'royalty_payment', 'platform_fee') NOT NULL,
  `amount_eth` DECIMAL(18,8) NOT NULL,
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'ETH',
  `transaction_hash` VARCHAR(255) UNIQUE COMMENT 'Blockchain transaction hash (if applicable)',
  `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  `transaction_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`nft_id`) REFERENCES `nfts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_transactions_nft_id` (`nft_id`),
  INDEX `idx_transactions_buyer_id` (`buyer_id`),
  INDEX `idx_transactions_seller_id` (`seller_id`),
  INDEX `idx_transactions_type` (`transaction_type`),
  INDEX `idx_transactions_time` (`transaction_time` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Records all financial transactions on the platform.';

INSERT INTO `transactions` (`id`, `nft_id`, `buyer_id`, `seller_id`, `transaction_type`, `amount_eth`, `status`) VALUES
('trx_00000000-0000-0000-0000-MOCKTRX0001', 'nft_00000000-0000-0000-0000-MOCK00000001', NULL, 'usr_00000000-0000-0000-0000-000000000001', 'mint', 0.02, 'completed'), -- Minting "My First Abstract"
('trx_00000000-0000-0000-0000-MOCKTRX0002', 'nft_00000000-0000-0000-0000-MOCK00000011', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000010', 'sale', 0.3, 'completed'); -- TestUser01 buys Pixel Knight #001 from PixelPioneer


-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
CREATE TABLE `notifications` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL COMMENT 'UUID for the notification',
  `user_id` VARCHAR(36) NOT NULL COMMENT 'User to receive the notification',
  `type` ENUM('new_listing', 'price_drop', 'bid_placed', 'bid_received', 'auction_ending', 'sale_success', 'purchase_success', 'platform_update', 'follow_activity') NOT NULL,
  `message` TEXT NOT NULL COMMENT 'Notification content',
  `related_entity_type` ENUM('nft', 'user', 'collection', 'system') COMMENT 'Type of related entity (NFT, user, etc.)',
  `related_entity_id` VARCHAR(36) COMMENT 'ID of the related entity (e.g., NFT ID, User ID)',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_notifications_user_id_read_created` (`user_id`, `is_read`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores notifications for users.';

INSERT INTO `notifications` (`id`, `user_id`, `type`, `message`, `related_entity_type`, `related_entity_id`, `is_read`) VALUES
('notif_00000000-0000-0000-MOCKNOTIF00001', 'usr_00000000-0000-0000-0000-000000000001', 'bid_received', 'NFTCollectorGal placed a bid of 0.3 ETH on your NFT Pixel Pal!', 'nft', 'nft_00000000-0000-0000-0000-MOCK00000002', FALSE),
('notif_00000000-0000-0000-MOCKNOTIF00002', 'usr_00000000-0000-0000-0000-000000000003', 'bid_placed', 'Your bid of 0.3 ETH on Pixel Pal is currently the highest!', 'nft', 'nft_00000000-0000-0000-0000-MOCK00000002', FALSE),
('notif_00000000-0000-0000-MOCKNOTIF00003', 'usr_00000000-0000-0000-0000-000000000001', 'purchase_success', 'You successfully purchased Pixel Knight #001 for 0.3 ETH.', 'nft', 'nft_00000000-0000-0000-0000-MOCK00000011', TRUE);

-- -----------------------------------------------------
-- Table `user_follows`
-- -----------------------------------------------------
CREATE TABLE `user_follows` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL,
  `follower_id` VARCHAR(36) NOT NULL COMMENT 'User doing the following',
  `followed_id` VARCHAR(36) NOT NULL COMMENT 'User being followed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`followed_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `uk_user_follows_pair` (`follower_id`, `followed_id`),
  INDEX `idx_user_follows_follower` (`follower_id`),
  INDEX `idx_user_follows_followed` (`followed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks user following relationships.';

INSERT INTO `user_follows` (`id`, `follower_id`, `followed_id`) VALUES
('follow_0000000-MOCK00001', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000002'), -- TestUser01 follows ArtIsLife
('follow_0000000-MOCK00002', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000010'); -- TestUser01 follows PixelPioneer

-- ================================================================================================
-- Admin & Platform Specific Tables
-- ================================================================================================

-- -----------------------------------------------------
-- Table `user_notification_preferences`
-- -----------------------------------------------------
CREATE TABLE `user_notification_preferences` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL,
  `user_id` VARCHAR(36) UNIQUE NOT NULL,
  `new_listing_alerts` BOOLEAN NOT NULL DEFAULT TRUE,
  `price_drop_alerts` BOOLEAN NOT NULL DEFAULT TRUE,
  `bid_updates` BOOLEAN NOT NULL DEFAULT TRUE,
  `auction_updates` BOOLEAN NOT NULL DEFAULT TRUE,
  `platform_news` BOOLEAN NOT NULL DEFAULT TRUE,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_user_notif_pref_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User preferences for receiving different types of notifications.';

INSERT INTO `user_notification_preferences` (`id`, `user_id`) VALUES
('notifpref_00000-MOCK00001','usr_00000000-0000-0000-0000-000000000001');


-- -----------------------------------------------------
-- Table `reports`
-- -----------------------------------------------------
CREATE TABLE `reports` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL,
  `reporter_id` VARCHAR(36) NOT NULL COMMENT 'User who submitted the report',
  `reported_entity_type` ENUM('nft', 'user', 'comment') NOT NULL,
  `reported_entity_id` VARCHAR(36) NOT NULL COMMENT 'ID of the NFT, user, or comment being reported',
  `reason` TEXT NOT NULL COMMENT 'Reason for the report',
  `status` ENUM('pending', 'resolved_action_taken', 'resolved_no_action', 'dismissed') NOT NULL DEFAULT 'pending',
  `admin_notes` TEXT COMMENT 'Notes from admin handling the report',
  `resolved_by_admin_id` VARCHAR(36) COMMENT 'Admin user who resolved the report',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`resolved_by_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_reports_reporter_id` (`reporter_id`),
  INDEX `idx_reports_resolved_by_admin_id` (`resolved_by_admin_id`),
  INDEX `idx_reports_status` (`status`),
  INDEX `idx_reports_entity` (`reported_entity_type`, `reported_entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user-submitted reports for content or conduct violations.';


-- -----------------------------------------------------
-- Table `admin_audit_log`
-- -----------------------------------------------------
CREATE TABLE `admin_audit_log` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL,
  `admin_id` VARCHAR(36) NOT NULL COMMENT 'Admin user who performed the action',
  `action_type` VARCHAR(100) NOT NULL COMMENT 'Type of action performed (e.g., USER_SUSPENDED, NFT_HIDDEN)',
  `target_entity_type` ENUM('user', 'nft', 'category', 'setting', 'report') COMMENT 'Type of entity affected',
  `target_entity_id` VARCHAR(36) COMMENT 'ID of the affected entity',
  `details` TEXT COMMENT 'JSON or text details of the action (e.g., old vs new values)',
  `ip_address` VARCHAR(45) COMMENT 'IP address from which action was performed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_admin_audit_log_admin_id` (`admin_id`),
  INDEX `idx_admin_audit_log_action_type` (`action_type`),
  INDEX `idx_admin_audit_log_target` (`target_entity_type`, `target_entity_id`),
  INDEX `idx_admin_audit_log_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs significant actions performed by administrators.';


-- -----------------------------------------------------
-- Table `platform_settings`
-- -----------------------------------------------------
CREATE TABLE `platform_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY NOT NULL COMMENT 'Unique key for the setting (e.g., site_name, maintenance_mode)',
  `setting_value` TEXT COMMENT 'Value of the setting (can be JSON for complex settings)',
  `description` VARCHAR(255) COMMENT 'Description of what the setting controls',
  `type` ENUM('string', 'number', 'boolean', 'json', 'theme_color') NOT NULL DEFAULT 'string' COMMENT 'Data type of the setting_value',
  `is_public` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'If true, this setting might be exposed to frontend (use with caution)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores global configuration settings for the platform, manageable by admins.';

INSERT INTO `platform_settings` (`setting_key`, `setting_value`, `description`, `type`) VALUES
('site_name', 'ArtNFT Marketplace', 'The official name of the platform.', 'string'),
('maintenance_mode', 'false', 'Enable or disable maintenance mode for the site.', 'boolean'),
('default_royalty_percentage', '10.0', 'Default royalty percentage for new NFTs.', 'number'),
('primary_theme_color', '#7DF9FF', 'Primary theme color for the site (hex).', 'theme_color'),
('accent_theme_color', '#FF69B4', 'Accent theme color for the site (hex).', 'theme_color');


-- -----------------------------------------------------
-- Table `promotions`
-- -----------------------------------------------------
CREATE TABLE `promotions` (
  `id` VARCHAR(36) PRIMARY KEY NOT NULL,
  `type` ENUM('featured_nft', 'spotlight_artist', 'homepage_banner') NOT NULL,
  `target_entity_id` VARCHAR(36) NOT NULL COMMENT 'ID of NFT or User being promoted',
  `title` VARCHAR(255) COMMENT 'Optional title for the promotion',
  `description` TEXT COMMENT 'Optional description for the promotion',
  `image_url` VARCHAR(255) COMMENT 'Optional image for the promotion banner',
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `starts_at` TIMESTAMP NULL,
  `ends_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_promotions_type_active_order` (`type`, `is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Manages featured content and promotions (NFTs, artists, banners).';

INSERT INTO `promotions` (`id`, `type`, `target_entity_id`, `title`, `description`, `image_url`, `is_active`, `starts_at`, `ends_at`) VALUES
('promo_0000000-MOCK00001', 'featured_nft', 'nft_00000000-0000-0000-0000-MOCK00000007', 'Featured: Cybernetic Orb', 'Explore this mesmerizing 3D creation!', 'https://placehold.co/800x300.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
('promo_0000000-MOCK00002', 'spotlight_artist', 'usr_00000000-0000-0000-0000-000000000010', 'Artist Spotlight: PixelPioneer', 'Discover the world of PixelPioneer!', 'https://placehold.co/300x150.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));


SET FOREIGN_KEY_CHECKS=1; -- Re-enable FK checks
    
