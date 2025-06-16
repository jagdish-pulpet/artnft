
-- ArtNFT Marketplace - MySQL/MariaDB Schema
-- Version 1.0

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_svg TEXT, -- Can store SVG content or a path/name for frontend lookup
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NFT Collections Table
CREATE TABLE IF NOT EXISTS nft_collections (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    banner_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NFTs Table
CREATE TABLE IF NOT EXISTS nfts (
    id CHAR(36) PRIMARY KEY,
    owner_id CHAR(36),
    collection_id CHAR(36),
    category_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    price DECIMAL(18, 8), -- Price in ETH, can be NULL if not for sale or auction only
    status ENUM('draft', 'listed', 'on_auction', 'sold', 'hidden', 'pending_moderation') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    listed_at TIMESTAMP NULL DEFAULT NULL,
    auction_ends_at TIMESTAMP NULL DEFAULT NULL,
    current_highest_bid DECIMAL(18, 8),
    current_highest_bidder_id CHAR(36),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (collection_id) REFERENCES nft_collections(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (current_highest_bidder_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bids Table (for auctions)
CREATE TABLE IF NOT EXISTS bids (
    id CHAR(36) PRIMARY KEY,
    nft_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    bid_amount DECIMAL(18, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nft_id) REFERENCES nfts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    user_id CHAR(36) NOT NULL,
    nft_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, nft_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (nft_id) REFERENCES nfts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY,
    nft_id CHAR(36),
    buyer_id CHAR(36),
    seller_id CHAR(36),
    transaction_type ENUM('mint', 'sale', 'transfer', 'listing', 'delisting', 'bid_placed', 'bid_accepted') NOT NULL,
    amount DECIMAL(18, 8), -- Amount in ETH, can be NULL for non-sale transactions
    currency VARCHAR(10) DEFAULT 'ETH',
    transaction_hash VARCHAR(255) UNIQUE, -- Blockchain transaction hash
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nft_id) REFERENCES nfts(id) ON DELETE SET NULL, -- SET NULL if NFT is deleted but transaction history is kept
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id CHAR(36) PRIMARY KEY,
    nft_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    parent_comment_id CHAR(36),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nft_id) REFERENCES nfts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id CHAR(36) PRIMARY KEY,
    reporter_id CHAR(36) NOT NULL,
    reported_nft_id CHAR(36),
    reported_user_id CHAR(36),
    reported_comment_id CHAR(36),
    reason TEXT NOT NULL,
    status ENUM('pending', 'reviewed_approved', 'reviewed_rejected', 'action_taken') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_nft_id) REFERENCES nfts(id) ON DELETE SET NULL,
    FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reported_comment_id) REFERENCES comments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Mock Data Inserts (Adapted for MySQL/MariaDB)

-- Users
INSERT INTO users (id, email, password_hash, username, avatar_url, bio, role, is_verified, last_login_at, created_at, updated_at) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'testuser01@artnft.com', '$2a$10$PlaceholderHashForUser01', 'TestUser01', 'https://placehold.co/100x100.png', 'Lover of abstract and pixel art.', 'user', TRUE, '2024-07-15 10:00:00', '2024-07-01 00:00:00', '2024-07-15 10:00:00'),
('usr_00000000-0000-0000-0000-000000000002', 'artisart@artnft.com', '$2a$10$PlaceholderHashForArtIsLife', 'ArtIsLife', 'https://placehold.co/100x100.png', 'Exploring the digital canvas, one masterpiece at a time.', 'user', TRUE, '2024-07-14 15:30:00', '2024-07-02 00:00:00', '2024-07-14 15:30:00'),
('usr_00000000-0000-0000-0000-000000000003', 'nftcollector@artnft.com', '$2a$10$PlaceholderHashForCollector', 'NFTCollectorGal', 'https://placehold.co/100x100.png', 'Curating the finest digital collectibles.', 'user', TRUE, '2024-07-15 09:00:00', '2024-07-03 00:00:00', '2024-07-15 09:00:00'),
('usr_00000000-0000-0000-0000-000000000004', 'galleryowner@artnft.com', '$2a$10$PlaceholderHashForGallery', 'CryptoGallery', 'https://placehold.co/100x100.png', 'Showcasing the future of art.', 'user', TRUE, '2024-07-13 12:00:00', '2024-07-04 00:00:00', '2024-07-13 12:00:00'),
('usr_00000000-0000-0000-0000-000000000005', 'procreator@artnft.com', '$2a$10$PlaceholderHashForCreator', 'DigitalCreatorPro', 'https://placehold.co/100x100.png', 'Professional digital artist, 3D and motion graphics specialist.', 'user', TRUE, '2024-07-15 11:00:00', '2024-07-05 00:00:00', '2024-07-15 11:00:00'),
('usr_00000000-0000-0000-0000-ADMIN0000001', 'admin@artnft.com', '$2a$10$PlaceholderHashForAdmin01', 'AdminUser01', 'https://placehold.co/100x100.png', 'Platform Administrator.', 'admin', TRUE, '2024-07-15 12:00:00', '2024-07-01 00:00:00', '2024-07-15 12:00:00'),
('usr_00000000-0000-0000-0000-000000000009', 'synth@artnft.com', '$2a$10$PlaceholderHashForSynth', 'SynthMusician', 'https://placehold.co/100x100.png', 'Crafting beats and melodies for the metaverse.', 'user', TRUE, '2024-07-15 14:00:00', '2024-07-08 00:00:00', '2024-07-15 14:00:00'),
('usr_00000000-0000-0000-0000-000000000010', 'pixel@artnft.com', '$2a$10$PlaceholderHashForPixel', 'PixelPioneer', 'https://placehold.co/100x100.png', 'Building worlds, one pixel at a time.', 'user', TRUE, '2024-07-15 16:00:00', '2024-07-09 00:00:00', '2024-07-15 16:00:00'),
('usr_00000000-0000-0000-0000-000000000011', 'viewer@artnft.com', '$2a$10$PlaceholderHashForViewer', 'ArtViewer22', 'https://placehold.co/100x100.png', 'Appreciator of digital fine arts.', 'user', TRUE, '2024-07-14 10:00:00', '2024-07-10 00:00:00', '2024-07-14 10:00:00'),
('usr_00000000-0000-0000-0000-000000000012', 'investor@artnft.com', '$2a$10$PlaceholderHashForInvestor', 'NFTInvestorX', 'https://placehold.co/100x100.png', 'Seeking unique digital assets with utility.', 'user', TRUE, '2024-07-13 18:00:00', '2024-07-11 00:00:00', '2024-07-13 18:00:00'),
('usr_00000000-0000-0000-0000-000000000013', 'uxdesigner@artnft.com', '$2a$10$PlaceholderHashForUX', 'UXDesignerArt', 'https://placehold.co/100x100.png', 'Designing experiences for the virtual realm.', 'user', TRUE, '2024-07-15 08:00:00', '2024-07-12 00:00:00', '2024-07-15 08:00:00');


-- Categories
INSERT INTO categories (id, name, slug, description, icon_svg) VALUES
('cat_00000000-0000-0000-0000-CATEGORY0001', 'Digital Art', 'digital-art', 'Creations made with digital technologies, including 2D and 3D art.', 'palette'),
('cat_00000000-0000-0000-0000-CATEGORY0002', 'Photography', 'photography', 'Art captured through the lens, from landscapes to portraits.', 'camera'),
('cat_00000000-0000-0000-0000-CATEGORY0003', 'Music', 'music', 'Audio NFTs, music-related collectibles, and soundscapes.', 'music-2'),
('cat_00000000-0000-0000-0000-CATEGORY0004', 'Collectibles', 'collectibles', 'Unique digital items, memorabilia, and branded assets.', 'toy-brick'),
('cat_00000000-0000-0000-0000-CATEGORY0005', 'Virtual Worlds', 'virtual-worlds', 'Assets for metaverses, including land, wearables, and avatars.', 'globe'),
('cat_00000000-0000-0000-0000-CATEGORY0006', 'Utility Tokens', 'utility-tokens', 'NFTs that grant access, perks, or functionalities.', 'bitcoin'),
('cat_00000000-0000-0000-0000-CATEGORY0007', 'Generative Art', 'generative-art', 'Art created using autonomous systems, often involving algorithms and code.', 'sparkles'),
('cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Art', 'pixel-art', 'Digital art created on the pixel level, often with a retro aesthetic.', 'grid');

-- NFT Collections
INSERT INTO nft_collections (id, user_id, name, description, banner_image_url) VALUES
('col_00000000-0000-0000-0000-COLLECTION01', 'usr_00000000-0000-0000-0000-000000000001', 'My First Abstracts', 'A collection of my initial explorations into abstract digital art.', 'https://placehold.co/1200x300.png'),
('col_00000000-0000-0000-0000-COLLECTION02', 'usr_00000000-0000-0000-0000-000000000002', 'Dreamscapes Vol. 1', 'Surreal and imaginative landscapes from my Dream Weaver series.', 'https://placehold.co/1200x300.png'),
('col_00000000-0000-0000-0000-COLLECTION03', 'usr_00000000-0000-0000-0000-000000000010', 'Pixel Perfect Picks', 'A curated selection of my best pixel art characters and scenes.', 'https://placehold.co/1200x300.png'),
('col_00000000-0000-0000-0000-COLLECTION04', 'usr_00000000-0000-0000-0000-000000000009', 'Synthwave Anthems', 'Collection of retro-futuristic music tracks and loops.', 'https://placehold.co/1200x300.png'),
('col_00000000-0000-0000-0000-COLLECTION05', 'usr_00000000-0000-0000-0000-000000000005', 'Cybernetic Visions', 'High-detail 3D models and scenes from a cyberpunk future.', 'https://placehold.co/1200x300.png');

-- NFTs
INSERT INTO nfts (id, owner_id, collection_id, category_id, title, description, image_url, price, status, listed_at, auction_ends_at, current_highest_bid, current_highest_bidder_id) VALUES
('nft_00000000-0000-0000-0000-MOCK00000001', 'usr_00000000-0000-0000-0000-000000000001', 'col_00000000-0000-0000-0000-COLLECTION01', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'My First Abstract', 'An exploration of color and form in the digital medium.', 'https://placehold.co/400x400.png', 0.5, 'listed', '2024-07-15 10:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000001', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Pal', 'A friendly pixel character, ready for adventure!', 'https://placehold.co/400x400.png', 0.2, 'on_auction', '2024-07-16 12:30:00', '2024-07-20 12:30:00', 0.3, 'usr_00000000-0000-0000-0000-000000000003'),
('nft_00000000-0000-0000-0000-MOCK00000003', 'usr_00000000-0000-0000-0000-000000000002', 'col_00000000-0000-0000-0000-COLLECTION02', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'Dream Weaver #1', 'First piece in the Dream Weaver series. A surreal landscape.', 'https://placehold.co/400x400.png', 1.2, 'listed', '2024-07-12 08:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000004', 'usr_00000000-0000-0000-0000-000000000002', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0002', 'Ephemeral Light', 'A fleeting moment of light captured in time.', 'https://placehold.co/400x400.png', 0.8, 'listed', '2024-07-13 14:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000005', 'usr_00000000-0000-0000-0000-000000000003', 'col_00000000-0000-0000-0000-COLLECTION02', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'Dream Weaver #2', 'Continuing the journey through surreal digital dreamscapes.', 'https://placehold.co/400x400.png', 1.5, 'sold', '2024-07-14 18:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000006', 'usr_00000000-0000-0000-0000-000000000003', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0004', 'Vintage Robot', 'A classic collectible robot from a bygone digital era.', 'https://placehold.co/400x400.png', 0.75, 'listed', '2024-07-17 11:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000007', 'usr_00000000-0000-0000-0000-000000000005', 'col_00000000-0000-0000-0000-COLLECTION05', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'Cybernetic Orb', 'A detailed 3D model of a futuristic orb.', 'https://placehold.co/400x400.png', 2.0, 'listed', '2024-07-10 20:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000008', 'usr_00000000-0000-0000-0000-000000000005', 'col_00000000-0000-0000-0000-COLLECTION05', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'Mech Suit Alpha', 'Concept art for a powerful mech suit.', 'https://placehold.co/400x400.png', 3.5, 'on_auction', '2024-07-11 09:00:00', '2024-07-18 09:00:00', NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000009', 'usr_00000000-0000-0000-0000-000000000009', 'col_00000000-0000-0000-0000-COLLECTION04', 'cat_00000000-0000-0000-0000-CATEGORY0003', 'Retro Wave Loop', 'A synthwave music loop perfect for retro vibes.', 'https://placehold.co/400x400.png', 0.4, 'listed', '2024-07-07 10:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000010', 'usr_00000000-0000-0000-0000-000000000009', 'col_00000000-0000-0000-0000-COLLECTION04', 'cat_00000000-0000-0000-0000-CATEGORY0003', '80s Nostalgia Beat', 'An upbeat track reminiscent of classic 80s music.', 'https://placehold.co/400x400.png', 0.6, 'listed', '2024-07-08 15:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000011', 'usr_00000000-0000-0000-0000-000000000010', 'col_00000000-0000-0000-0000-COLLECTION03', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Knight #001', 'The first knight in a series of pixel adventurers.', 'https://placehold.co/400x400.png', 0.3, 'sold', '2024-07-02 19:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000012', 'usr_00000000-0000-0000-0000-000000000010', 'col_00000000-0000-0000-0000-COLLECTION03', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Forest Scene', 'A tranquil forest rendered in detailed pixel art.', 'https://placehold.co/400x400.png', 0.5, 'listed', '2024-07-04 22:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000013', 'usr_00000000-0000-0000-0000-000000000010', 'col_00000000-0000-0000-0000-COLLECTION03', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Dragonling', 'A cute but fierce baby dragon in pixel form.', 'https://placehold.co/400x400.png', 0.7, 'on_auction', '2024-07-05 10:00:00', '2024-07-25 10:00:00', NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000014', 'usr_00000000-0000-0000-0000-000000000004', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0007', 'Generative Swirls #7', 'Algorithmically generated swirling patterns, unique edition.', 'https://placehold.co/400x400.png', 1.0, 'listed', '2024-06-27 13:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000015', 'usr_00000000-0000-0000-0000-000000000011', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0002', 'Mountain Vista Photo', 'A stunning photograph of a mountain range at dawn.', 'https://placehold.co/400x400.png', 0.9, 'listed', '2024-06-30 10:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000016', 'usr_00000000-0000-0000-0000-000000000012', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0006', 'VR Gallery Access Key', 'This NFT grants exclusive access to a virtual reality art gallery.', 'https://placehold.co/400x400.png', 2.5, 'listed', '2024-06-22 11:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000017', 'usr_00000000-0000-0000-0000-000000000013', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0005', 'Lost Temple - Game Asset', 'A 3D model of a lost temple, ready for use in virtual worlds.', 'https://placehold.co/400x400.png', 1.8, 'listed', '2024-06-24 17:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000018', 'usr_00000000-0000-0000-0000-000000000002', 'col_00000000-0000-0000-0000-COLLECTION02', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'Cosmic Abstract #42', 'Another piece from the cosmic series.', 'https://placehold.co/400x400.png', 0.65, 'hidden', '2024-07-17 09:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000019', 'usr_00000000-0000-0000-0000-000000000010', 'col_00000000-0000-0000-0000-COLLECTION03', 'cat_00000000-0000-0000-0000-CATEGORY0008', 'Pixel Mage Character', 'A powerful mage rendered in classic pixel art style.', 'https://placehold.co/400x400.png', 0.4, 'listed', '2024-07-19 12:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000020', 'usr_00000000-0000-0000-0000-000000000011', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0002', 'Serene Lake Photograph', 'A calming photo of a lake at dusk.', 'https://placehold.co/400x400.png', 0.7, 'on_auction', '2024-07-20 10:00:00', '2024-07-27 10:00:00', NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000021', 'usr_00000000-0000-0000-0000-000000000009', 'col_00000000-0000-0000-0000-COLLECTION04', 'cat_00000000-0000-0000-0000-CATEGORY0003', 'Chillhop Beat "Sunset"', 'A relaxing chillhop track perfect for sunsets.', 'https://placehold.co/400x400.png', 0.25, 'listed', '2024-07-21 15:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000022', 'usr_00000000-0000-0000-0000-000000000005', 'col_00000000-0000-0000-0000-COLLECTION05', 'cat_00000000-0000-0000-0000-CATEGORY0001', 'Cyberpunk Alleyway 3D', 'A detailed 3D render of a futuristic cyberpunk alley.', 'https://placehold.co/400x400.png', 2.2, 'listed', '2024-07-18 18:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000023', 'usr_00000000-0000-0000-0000-000000000004', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0007', 'Generative Patterns Alpha', 'Early exploration of generative pattern algorithms.', 'https://placehold.co/400x400.png', 0.9, 'draft', '2024-07-06 10:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000024', 'usr_00000000-0000-0000-0000-000000000012', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0006', 'Utility Key - Beta Access', 'Grants early access to a new platform (beta).', 'https://placehold.co/400x400.png', 1.1, 'pending_moderation', '2024-07-03 11:00:00', NULL, NULL, NULL),
('nft_00000000-0000-0000-0000-MOCK00000025', 'usr_00000000-0000-0000-0000-000000000003', NULL, 'cat_00000000-0000-0000-0000-CATEGORY0004', 'Collectible Card #007', 'A rare collectible trading card from the Alpha series.', 'https://placehold.co/400x400.png', 0.35, 'listed', '2024-07-01 17:00:00', NULL, NULL, NULL);

-- Bids (Example for Pixel Pal NFT which is on auction)
INSERT INTO bids (id, nft_id, user_id, bid_amount, created_at) VALUES
('bid_00000000-0000-0000-0000-MOCKBID00001', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000004', 0.25, '2024-07-16 13:00:00'),
('bid_00000000-0000-0000-0000-MOCKBID00002', 'nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000003', 0.30, '2024-07-16 14:00:00');

-- Favorites
INSERT INTO favorites (user_id, nft_id, created_at) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000003', '2024-07-15 11:00:00'),
('usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000007', '2024-07-15 11:05:00'),
('usr_00000000-0000-0000-0000-000000000002', 'nft_00000000-0000-0000-0000-MOCK00000001', '2024-07-14 16:00:00');

-- Transactions
INSERT INTO transactions (id, nft_id, buyer_id, seller_id, transaction_type, amount, currency, transaction_hash, status, created_at, updated_at) VALUES
('txn_00000000-0000-0000-0000-MOCKTXN00001', 'nft_00000000-0000-0000-0000-MOCK00000005', 'usr_00000000-0000-0000-0000-000000000003', 'usr_00000000-0000-0000-0000-000000000002', 'sale', 1.5, 'ETH', '0xabcdef1234567890mocktransactionhash1', 'completed', '2024-07-14 18:05:00', '2024-07-14 18:05:00'),
('txn_00000000-0000-0000-0000-MOCKTXN00002', 'nft_00000000-0000-0000-0000-MOCK00000011', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000010', 'sale', 0.3, 'ETH', '0xabcdef1234567890mocktransactionhash2', 'completed', '2024-07-02 19:05:00', '2024-07-02 19:05:00');

-- Comments
INSERT INTO comments (id, nft_id, user_id, content, created_at, updated_at) VALUES
('cmt_00000000-0000-0000-0000-MOCKCMT00001', 'nft_00000000-0000-0000-0000-MOCK00000001', 'usr_00000000-0000-0000-0000-000000000002', 'Love this abstract piece!', '2024-07-15 10:30:00', '2024-07-15 10:30:00'),
('cmt_00000000-0000-0000-0000-MOCKCMT00002', 'nft_00000000-0000-0000-0000-MOCK00000001', 'usr_00000000-0000-0000-0000-000000000001', 'Thanks! Glad you like it.', '2024-07-15 10:35:00', '2024-07-15 10:35:00');
