-- Database schema for ArtNFT Marketplace (MySQL/MariaDB)

-- Drop existing database if it exists (optional, for development)
-- DROP DATABASE IF EXISTS artnft_db;
-- CREATE DATABASE artnft_db;
-- USE artnft_db;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) PRIMARY KEY, -- UUID stored as CHAR(36)
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    wallet_address VARCHAR(42) UNIQUE, -- Ethereum address length
    role ENUM('User', 'Artist', 'Admin') NOT NULL DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- NFTs Table
CREATE TABLE IF NOT EXISTS NFTs (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL, -- Main image
    thumbnail_url VARCHAR(255),
    creator_id CHAR(36) NOT NULL, -- Foreign Key to Users table
    owner_id CHAR(36), -- Foreign Key to Users table (can be NULL if listed by platform/creator)
    category_id CHAR(36), -- Foreign Key to Categories table
    price DECIMAL(18, 8), -- Price in ETH or other crypto
    currency VARCHAR(10) DEFAULT 'ETH',
    status ENUM('Listed', 'OnAuction', 'Sold', 'Hidden', 'Draft', 'PendingModeration') NOT NULL DEFAULT 'Draft',
    edition_number INT DEFAULT 1,
    total_editions INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    listed_at TIMESTAMP NULL, -- When it was first made available for sale/auction
    data_ai_hint VARCHAR(255), -- For Unsplash search hint
    FOREIGN KEY (creator_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Collections Table (Many-to-Many through NFTCollections or direct if NFT belongs to one)
CREATE TABLE IF NOT EXISTS Collections (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id CHAR(36) NOT NULL,
    banner_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- NFTCollections Table (Associative table for Many-to-Many between NFTs and Collections)
CREATE TABLE IF NOT EXISTS NFTCollections (
    nft_id CHAR(36) NOT NULL,
    collection_id CHAR(36) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (nft_id, collection_id),
    FOREIGN KEY (nft_id) REFERENCES NFTs(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES Collections(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bids Table (For Auctions)
CREATE TABLE IF NOT EXISTS Bids (
    id CHAR(36) PRIMARY KEY,
    nft_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    bid_amount DECIMAL(18, 8) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_winning_bid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (nft_id) REFERENCES NFTs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Transactions Table
CREATE TABLE IF NOT EXISTS Transactions (
    id CHAR(36) PRIMARY KEY,
    nft_id CHAR(36) NOT NULL,
    seller_id CHAR(36) NOT NULL,
    buyer_id CHAR(36) NOT NULL,
    transaction_type ENUM('Sale', 'Transfer') NOT NULL,
    price DECIMAL(18, 8), -- Price for sales, NULL for transfers
    currency VARCHAR(10),
    transaction_hash VARCHAR(255) UNIQUE, -- Blockchain transaction hash
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nft_id) REFERENCES NFTs(id), -- Don't cascade delete, keep history
    FOREIGN KEY (seller_id) REFERENCES Users(id),
    FOREIGN KEY (buyer_id) REFERENCES Users(id)
) ENGINE=InnoDB;

-- Favorites Table (User favorites an NFT)
CREATE TABLE IF NOT EXISTS Favorites (
    user_id CHAR(36) NOT NULL,
    nft_id CHAR(36) NOT NULL,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, nft_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (nft_id) REFERENCES NFTs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reports Table (For users reporting content)
CREATE TABLE IF NOT EXISTS Reports (
    id CHAR(36) PRIMARY KEY,
    reporter_id CHAR(36) NOT NULL,
    reported_content_id CHAR(36) NOT NULL, -- Could be NFT ID, User ID, Comment ID etc.
    content_type ENUM('NFT', 'User', 'Comment') NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Reviewed', 'ActionTaken', 'Dismissed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    admin_notes TEXT, -- Notes by admin who reviewed the report
    FOREIGN KEY (reporter_id) REFERENCES Users(id) ON DELETE CASCADE
    -- Cannot add direct FK for reported_content_id as it can refer to different tables.
    -- This needs to be handled at application level.
) ENGINE=InnoDB;

-- Audit Log Table
CREATE TABLE IF NOT EXISTS AuditLogs (
  id CHAR(36) PRIMARY KEY,
  admin_user_id CHAR(36), -- Can be NULL if system action
  action_type VARCHAR(100) NOT NULL, -- e.g., 'USER_SUSPENDED', 'NFT_HIDDEN'
  target_type VARCHAR(50), -- e.g., 'User', 'NFT', 'Category'
  target_id CHAR(36),
  description TEXT,
  details JSON, -- Store additional structured data about the action
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- Mock Data Inserts

-- Users
INSERT INTO Users (id, username, email, password_hash, role, bio, wallet_address) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'TestUser01', 'testuser01@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'User', 'I love testing things!', '0x1234567890123456789012345678901234567890'),
('usr_00000000-0000-0000-0000-000000000002', 'ArtIsLife', 'artislife@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'Artist', 'Creating digital dreams. Verified Artist.', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'),
('usr_00000000-0000-0000-0000-000000000003', 'NFTCollectorGal', 'collector@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'User', 'Collecting rare NFTs.', '0x11223344556677889900aabbccddeeff00112233'),
('usr_00000000-0000-0000-0000-000000000004', 'CryptoGallery', 'gallery@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'User', 'Curating the finest digital art.', NULL),
('usr_00000000-0000-0000-0000-000000000005', 'DigitalCreatorPro', 'procreator@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'Artist', 'Professional digital artist specializing in 3D.', '0x223344556677889900aabbccddeeff0011223344'),
('usr_00000000-0000-0000-0000-000000000006', 'ArtViewer22', 'viewer@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'User', 'Enthusiast of digital photography.', NULL),
('usr_00000000-0000-0000-0000-000000000007', 'NFTInvestorX', 'investorx@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'User', 'Investing in the future of digital assets.', '0x3344556677889900aabbccddeeff001122334455'),
('usr_00000000-0000-0000-0000-000000000008', 'UXDesignerArt', 'ux@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'Artist', 'Designing interfaces and art.', NULL),
('usr_00000000-0000-0000-0000-000000000009', 'SynthMusician', 'synth@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'Artist', 'Creating unique soundscapes. Verified Artist.', '0x44556677889900aabbccddeeff00112233445566'),
('usr_00000000-0000-0000-0000-000000000010', 'PixelPioneer', 'pixel@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'Artist', 'Mastering the art of pixels. Verified Artist.', '0x556677889900aabbccddeeff0011223344556677'),
('usr_00000000-0000-0000-0000-000000000011', 'AdminUser', 'admin@artnft.com', '$2a$10$abcdefghijklmnopqrstuv', 'Admin', 'Platform Administrator', '0xAdminWalletAddressAdminWalletAddressAdmi');


-- Categories
INSERT INTO Categories (id, name, slug, description) VALUES
('cat_00000000-0000-0000-0000-CATEGORY0001', 'Digital Art', 'digital-art', 'Creations made with digital technologies.'),
('cat_00000000-0000-0000-0000-CATEGORY0002', 'Photography', 'photography', 'Art captured through the lens.'),
('cat_00000000-0000-0000-0000-CATEGORY0003', 'Music', 'music', 'Audio NFTs and music-related collectibles.'),
('cat_00000000-0000-0000-0000-CATEGORY0004', 'Collectibles', 'collectibles', 'Unique digital items and memorabilia.'),
('cat_00000000-0000-0000-0000-CATEGORY0005', 'Virtual Worlds', 'virtual-worlds', 'Assets for metaverses and virtual environments.'),
('cat_00000000-0000-0000-0000-CATEGORY0006', 'Utility Tokens', 'utility-tokens', 'NFTs that provide specific functionalities or access.'),
('cat_00000000-0000-0000-0000-CATEGORY0007', 'Generative Art', 'generative-art', 'Art created using autonomous systems, often involving algorithms and code.'),
('cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Art', 'pixel-art', 'Digital art created using raster graphics software, where images are edited on the pixel level.');

-- NFTs
INSERT INTO NFTs (id, title, description, image_url, thumbnail_url, creator_id, owner_id, category_id, price, status, data_ai_hint, listed_at) VALUES
('nft_00000000-0000-0000-0000-MOCK00000001', 'My First Abstract', 'An exploration of color and form.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0001', 0.5, 'Listed', 'abstract colorful', '2024-07-15 10:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000002', 'Pixel Pal', 'A friendly pixel character.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 'cat_00000000-0000-0000-0000-CATEGORY0008', 0.2, 'OnAuction', 'pixel character', '2024-07-16 12:30:00'),
('nft_00000000-0000-0000-0000-MOCK00000003', 'Dream Weaver #1', 'Surreal landscape from another dimension.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000002', 'cat_00000000-0000-0000-0000-CATEGORY0001', 1.2, 'Listed', 'surreal landscape', '2024-07-12 08:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000004', 'Ephemeral Light', 'Captured moment of light and shadow.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0002', 0.8, 'Listed', 'abstract light', '2024-07-13 14:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000005', 'Dream Weaver #2', 'Another piece from the Dream Weaver series.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0001', 1.5, 'Sold', 'dreamlike vista', '2024-07-14 18:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000006', 'Vintage Robot', 'A classic collectible robot figure.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000003', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0004', 0.75, 'Listed', 'retro robot', '2024-07-17 11:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000007', 'Cybernetic Orb', 'A futuristic 3D orb design.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', 2.0, 'Listed', '3d orb', '2024-07-10 20:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000008', 'Mech Suit Alpha', 'Concept art for a sci-fi mech suit.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', 3.5, 'OnAuction', 'mech suit concept', '2024-07-11 09:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000009', 'Retro Wave Loop', 'A seamless synthwave music loop.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', 0.4, 'Listed', 'synthwave music', '2024-07-07 10:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000010', '80s Nostalgia Beat', 'An instrumental beat with an 80s vibe.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', 0.6, 'Listed', '80s beat', '2024-07-08 15:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000011', 'Pixel Knight #001', 'A brave knight in pixel art form.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0008', 0.3, 'Sold', 'pixel knight', '2024-07-02 19:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000012', 'Pixel Forest Scene', 'A serene forest scene in pixel art.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000010', 'cat_00000000-0000-0000-0000-CATEGORY0008', 0.5, 'Listed', 'pixel forest', '2024-07-04 22:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000013', 'Pixel Dragonling', 'A cute baby dragon in pixel form.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000010', 'cat_00000000-0000-0000-0000-CATEGORY0008', 0.7, 'OnAuction', 'pixel dragon', '2024-07-05 10:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000014', 'Generative Swirls #7', 'Unique patterns created by an algorithm.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000004', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0007', 1.0, 'Listed', 'generative art', '2024-06-27 13:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000015', 'Mountain Vista Photo', 'A stunning photograph of a mountain range.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000006', 'usr_00000000-0000-0000-0000-000000000006', 'cat_00000000-0000-0000-0000-CATEGORY0002', 0.9, 'Listed', 'mountain photography', '2024-06-30 10:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000016', 'VR Gallery Access Key', 'Grants access to an exclusive VR gallery.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000007', 'usr_00000000-0000-0000-0000-000000000007', 'cat_00000000-0000-0000-0000-CATEGORY0006', 2.5, 'Listed', 'vr utility', '2024-06-22 11:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000017', 'Lost Temple - Game Asset', 'A 3D model of a temple for game development.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000008', 'usr_00000000-0000-0000-0000-000000000008', 'cat_00000000-0000-0000-0000-CATEGORY0005', 1.8, 'Listed', '3d game asset', '2024-06-24 17:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000018', 'Cosmic Abstract #42', 'Abstract piece, currently hidden.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000002', 'cat_00000000-0000-0000-0000-CATEGORY0001', 0.65, 'Hidden', 'cosmic abstract', '2024-07-17 09:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000019', 'Pixel Mage Character', 'A wise mage in detailed pixel art.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000010', 'cat_00000000-0000-0000-0000-CATEGORY0008', 0.4, 'Listed', 'pixel mage', '2024-07-19 12:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000020', 'Serene Lake Photograph', 'Calm lake at dawn, captured perfectly.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000006', 'usr_00000000-0000-0000-0000-000000000006', 'cat_00000000-0000-0000-0000-CATEGORY0002', 0.7, 'OnAuction', 'lake photography', '2024-07-20 10:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000021', 'Chillhop Beat "Sunset"', 'Relaxing chillhop track for study or focus.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000009', 'usr_00000000-0000-0000-0000-000000000009', 'cat_00000000-0000-0000-0000-CATEGORY0003', 0.25, 'Listed', 'chillhop music', '2024-07-21 15:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000022', 'Cyberpunk Alleyway 3D', 'Detailed 3D render of a futuristic alley.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000005', 'usr_00000000-0000-0000-0000-000000000005', 'cat_00000000-0000-0000-0000-CATEGORY0001', 2.2, 'Listed', 'cyberpunk 3d', '2024-07-18 18:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000023', 'Generative Patterns Alpha', 'Early collection of generative patterns.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000004', 'usr_00000000-0000-0000-0000-000000000004', 'cat_00000000-0000-0000-0000-CATEGORY0007', 0.9, 'Draft', 'generative patterns', '2024-07-06 10:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000024', 'Utility Key - Beta Access', 'Unlocks beta access to a new DApp.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000007', 'usr_00000000-0000-0000-0000-000000000007', 'cat_00000000-0000-0000-0000-CATEGORY0006', 1.1, 'PendingModeration', 'utility key', '2024-07-03 11:00:00'),
('nft_00000000-0000-0000-0000-MOCK00000025', 'Collectible Card #007', 'Rare collectible trading card.', 'https://placehold.co/800x800.png', 'https://placehold.co/200x200.png', 'usr_00000000-0000-0000-0000-000000000003', 'usr_00000000-0000-0000-0000-000000000003', 'cat_00000000-0000-0000-0000-CATEGORY0004', 0.35, 'Listed', 'collectible card', '2024-07-01 17:00:00');

-- Collections
INSERT INTO Collections (id, name, creator_id, description) VALUES
('col_00000000-0000-0000-0000-COLLECTION01', 'Abstract Dreams', 'usr_00000000-0000-0000-0000-000000000001', 'A collection of my abstract works.'),
('col_00000000-0000-0000-0000-COLLECTION02', 'Surreal Escapes by ArtIsLife', 'usr_00000000-0000-0000-0000-000000000002', 'Venturing into surreal digital landscapes.'),
('col_00000000-0000-0000-0000-COLLECTION03', 'Pixel Perfect Picks', 'usr_00000000-0000-0000-0000-000000000010', 'A curated set of pixel art creations.'),
('col_00000000-0000-0000-0000-COLLECTION04', 'Generative Explorations', 'usr_00000000-0000-0000-0000-000000000004', 'Experiments in generative art.'),
('col_00000000-0000-0000-0000-COLLECTION05', 'Cybernetic Visions', 'usr_00000000-0000-0000-0000-000000000005', 'Futuristic 3D models and concepts.');


-- NFTCollections (Linking NFTs to Collections)
INSERT INTO NFTCollections (nft_id, collection_id) VALUES
('nft_00000000-0000-0000-0000-MOCK00000001', 'col_00000000-0000-0000-0000-COLLECTION01'), -- My First Abstract in Abstract Dreams
('nft_00000000-0000-0000-0000-MOCK00000003', 'col_00000000-0000-0000-0000-COLLECTION02'), -- Dream Weaver #1 in Surreal Escapes
('nft_00000000-0000-0000-0000-MOCK00000005', 'col_00000000-0000-0000-0000-COLLECTION02'), -- Dream Weaver #2 in Surreal Escapes
('nft_00000000-0000-0000-0000-MOCK00000011', 'col_00000000-0000-0000-0000-COLLECTION03'), -- Pixel Knight #001 in Pixel Perfect Picks
('nft_00000000-0000-0000-0000-MOCK00000012', 'col_00000000-0000-0000-0000-COLLECTION03'), -- Pixel Forest Scene in Pixel Perfect Picks
('nft_00000000-0000-0000-0000-MOCK00000013', 'col_00000000-0000-0000-0000-COLLECTION03'), -- Pixel Dragonling in Pixel Perfect Picks
('nft_00000000-0000-0000-0000-MOCK00000019', 'col_00000000-0000-0000-0000-COLLECTION03'), -- Pixel Mage Character in Pixel Perfect Picks
('nft_00000000-0000-0000-0000-MOCK00000014', 'col_00000000-0000-0000-0000-COLLECTION04'), -- Generative Swirls #7 in Generative Explorations
('nft_00000000-0000-0000-0000-MOCK00000023', 'col_00000000-0000-0000-0000-COLLECTION04'), -- Generative Patterns Alpha in Generative Explorations
('nft_00000000-0000-0000-0000-MOCK00000007', 'col_00000000-0000-0000-0000-COLLECTION05'), -- Cybernetic Orb in Cybernetic Visions
('nft_00000000-0000-0000-0000-MOCK00000008', 'col_00000000-0000-0000-0000-COLLECTION05'), -- Mech Suit Alpha in Cybernetic Visions
('nft_00000000-0000-0000-0000-MOCK00000022', 'col_00000000-0000-0000-0000-COLLECTION05'); -- Cyberpunk Alleyway 3D in Cybernetic Visions

-- Bids
INSERT INTO Bids (id, nft_id, user_id, bid_amount, bid_time) VALUES
('bid_00000000-0000-0000-0000-MOCKBID00001', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000003', 0.25, '2024-07-16 13:00:00'),
('bid_00000000-0000-0000-0000-MOCKBID00002', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000004', 0.30, '2024-07-16 14:00:00'); -- Highest bid for Pixel Pal

-- Transactions
INSERT INTO Transactions (id, nft_id, seller_id, buyer_id, transaction_type, price, currency, transaction_hash, transaction_time) VALUES
('txn_00000000-0000-0000-0000-MOCKTXN00001', 'nft_00000000-0000-0000-0000-MOCK00000005', 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000004', 'Sale', 1.5, 'ETH', '0xtxhash001abc', '2024-07-14 18:05:00'),
('txn_00000000-0000-0000-0000-MOCKTXN00002', 'nft_00000000-0000-0000-0000-MOCK00000011', 'usr_00000000-0000-0000-0000-000000000010', 'usr_00000000-0000-0000-0000-000000000004', 'Sale', 0.3, 'ETH', '0xtxhash002def', '2024-07-02 19:10:00');

-- Favorites
INSERT INTO Favorites (user_id, nft_id) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000003'), -- TestUser01 favorites Dream Weaver #1
('usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000007'), -- TestUser01 favorites Cybernetic Orb
('usr_00000000-0000-0000-0000-000000000002', 'nft_00000000-0000-0000-0000-MOCK00000001'); -- ArtIsLife favorites My First Abstract

-- Audit Logs
INSERT INTO AuditLogs (id, admin_user_id, action_type, target_type, target_id, description) VALUES
('aud_00000000-0000-0000-0000-AUDIT00001', 'usr_00000000-0000-0000-0000-000000000011', 'USER_ROLE_CHANGED', 'User', 'usr_00000000-0000-0000-0000-000000000002', 'Changed role of ArtIsLife to Artist.'),
('aud_00000000-0000-0000-0000-AUDIT00002', 'usr_00000000-0000-0000-0000-000000000011', 'NFT_STATUS_CHANGED', 'NFT', 'nft_00000000-0000-0000-0000-MOCK00000018', 'Changed status of Cosmic Abstract #42 to Hidden.');
