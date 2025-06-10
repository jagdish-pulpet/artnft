-- PostgreSQL Schema for ArtNFT Marketplace
-- Note: For UUID primary keys like users.id, ensure the `uuid-ossp` extension is enabled in your PostgreSQL database (`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
-- or if using PostgreSQL 13+, you can use `gen_random_uuid()`. This schema uses `gen_random_uuid()`.
-- For simpler auto-incrementing integer primary keys, `SERIAL` or `INTEGER GENERATED ALWAYS AS IDENTITY` is used.

-- Drop existing types and tables in reverse order of dependency if they exist (for easier re-runs during development)
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS admin_audit_log CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS user_follows CASCADE;
DROP TABLE IF EXISTS user_notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS nfts CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role_enum CASCADE;
DROP TYPE IF EXISTS nft_status_enum CASCADE;
DROP TYPE IF EXISTS transaction_type_enum CASCADE;
DROP TYPE IF EXISTS transaction_status_enum CASCADE;
DROP TYPE IF EXISTS notification_type_enum CASCADE;
DROP TYPE IF EXISTS report_type_enum CASCADE;
DROP TYPE IF EXISTS report_status_enum CASCADE;
DROP TYPE IF EXISTS platform_setting_type_enum CASCADE;
DROP TYPE IF EXISTS promotion_type_enum CASCADE;

-- ================================================================================================
-- ENUM Types
-- ================================================================================================
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
CREATE TYPE nft_status_enum AS ENUM ('pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft');
CREATE TYPE transaction_type_enum AS ENUM ('mint', 'sale', 'purchase', 'bid_placed', 'bid_refunded', 'royalty_payment');
CREATE TYPE transaction_status_enum AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE notification_type_enum AS ENUM ('new_listing', 'price_drop', 'bid_placed', 'bid_received', 'auction_won', 'auction_ending', 'sale_made', 'item_purchased', 'follow', 'platform_update');
CREATE TYPE report_type_enum AS ENUM ('nft_content', 'user_profile', 'comment_spam', 'policy_violation');
CREATE TYPE report_status_enum AS ENUM ('pending_review', 'action_taken', 'dismissed');
CREATE TYPE platform_setting_type_enum AS ENUM ('string', 'number', 'boolean', 'json', 'theme_color');
CREATE TYPE promotion_type_enum AS ENUM ('featured_nft', 'artist_spotlight', 'collection_highlight', 'homepage_banner');

-- ================================================================================================
-- Users Table
-- ================================================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE,
    avatar_url VARCHAR(255),
    bio TEXT,
    wallet_address VARCHAR(255) UNIQUE,
    role user_role_enum NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE users IS 'Stores user account information.';
COMMENT ON COLUMN users.id IS 'Primary key, UUID.';
COMMENT ON COLUMN users.email IS 'User email, must be unique.';
COMMENT ON COLUMN users.password_hash IS 'Hashed password.';
COMMENT ON COLUMN users.username IS 'Unique public username.';
COMMENT ON COLUMN users.wallet_address IS 'User''s crypto wallet address, unique.';
COMMENT ON COLUMN users.role IS 'User role (user or admin).';

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ================================================================================================
-- Categories Table
-- ================================================================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Lucide icon name or URL
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE categories IS 'Stores NFT categories.';

-- ================================================================================================
-- Collections Table
-- ================================================================================================
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, slug) -- User can have multiple collections, but slug should be unique per user
);
COMMENT ON TABLE collections IS 'User-created collections of NFTs.';
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_slug ON collections(slug);

-- ================================================================================================
-- NFTs Table
-- ================================================================================================
CREATE TABLE nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Changed to UUID
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    price_eth DECIMAL(18, 8),
    currency_symbol VARCHAR(10) NOT NULL DEFAULT 'ETH',
    status nft_status_enum NOT NULL DEFAULT 'pending_moderation',
    is_auction BOOLEAN NOT NULL DEFAULT FALSE,
    auction_ends_at TIMESTAMP WITHOUT TIME ZONE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Prevent deleting user if they created NFTs
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL, -- If owner deleted, NFT owner becomes NULL
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
    tags JSONB, -- Store tags as a JSON array of strings
    metadata_url VARCHAR(255), -- Link to off-chain metadata if any
    royalty_percentage DECIMAL(5,2) DEFAULT 0.00,
    unlockable_content TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE nfts IS 'Stores information about each NFT.';
CREATE INDEX idx_nfts_creator_id ON nfts(creator_id);
CREATE INDEX idx_nfts_owner_id ON nfts(owner_id);
CREATE INDEX idx_nfts_category_id ON nfts(category_id);
CREATE INDEX idx_nfts_status ON nfts(status);
CREATE INDEX idx_nfts_title ON nfts(title);
CREATE INDEX idx_nfts_tags ON nfts USING GIN (tags); -- GIN index for JSONB tags

-- ================================================================================================
-- Bids Table
-- ================================================================================================
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bid_amount_eth DECIMAL(18, 8) NOT NULL,
    bid_time TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_winning_bid BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active' -- e.g., active, outbid, cancelled
);
COMMENT ON TABLE bids IS 'Records bids made on NFTs.';
CREATE INDEX idx_bids_nft_id ON bids(nft_id);
CREATE INDEX idx_bids_user_id ON bids(user_id);
CREATE INDEX idx_bids_nft_amount_time ON bids(nft_id, bid_amount_eth DESC, bid_time DESC);

-- ================================================================================================
-- Favorites Table
-- ================================================================================================
CREATE TABLE favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, nft_id)
);
COMMENT ON TABLE favorites IS 'Stores users'' favorited NFTs.';

-- ================================================================================================
-- Transactions Table
-- ================================================================================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    nft_id UUID REFERENCES nfts(id) ON DELETE RESTRICT, -- Prevent deleting NFT if it has transactions
    from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type transaction_type_enum NOT NULL,
    amount_eth DECIMAL(18, 8),
    currency_symbol VARCHAR(10) DEFAULT 'ETH',
    transaction_hash VARCHAR(255) UNIQUE, -- Blockchain transaction hash
    status transaction_status_enum NOT NULL DEFAULT 'pending',
    transaction_time TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gas_fee_eth DECIMAL(18,8)
);
COMMENT ON TABLE transactions IS 'Records all platform transactions like sales, mints, etc.';
CREATE INDEX idx_transactions_nft_id ON transactions(nft_id);
CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ================================================================================================
-- Notifications Table
-- ================================================================================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    message TEXT NOT NULL,
    related_nft_id UUID REFERENCES nfts(id) ON DELETE SET NULL,
    related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE notifications IS 'Stores user notifications.';
CREATE INDEX idx_notifications_user_id_read_created ON notifications(user_id, is_read, created_at DESC);

-- ================================================================================================
-- User Notification Preferences Table
-- ================================================================================================
CREATE TABLE user_notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    email_new_listing BOOLEAN DEFAULT TRUE,
    email_price_drop BOOLEAN DEFAULT TRUE,
    email_auction_update BOOLEAN DEFAULT TRUE,
    email_transaction BOOLEAN DEFAULT TRUE,
    push_new_listing BOOLEAN DEFAULT TRUE,
    push_price_drop BOOLEAN DEFAULT TRUE,
    push_auction_update BOOLEAN DEFAULT TRUE,
    push_transaction BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE user_notification_preferences IS 'Stores individual user notification preferences.';

-- ================================================================================================
-- User Follows Table
-- ================================================================================================
CREATE TABLE user_follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT chk_no_self_follow CHECK (follower_id <> followed_id)
);
COMMENT ON TABLE user_follows IS 'Tracks user following relationships.';

-- ================================================================================================
-- Reports Table (for content moderation)
-- ================================================================================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_nft_id UUID REFERENCES nfts(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- For reporting a user profile
    report_type report_type_enum NOT NULL,
    reason TEXT NOT NULL,
    status report_status_enum NOT NULL DEFAULT 'pending_review',
    admin_notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE reports IS 'Stores user-submitted reports for content moderation.';
CREATE INDEX idx_reports_status_type ON reports(status, report_type);

-- ================================================================================================
-- Admin Audit Log Table
-- ================================================================================================
CREATE TABLE admin_audit_log (
    id SERIAL PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Ensure admin user exists
    action VARCHAR(255) NOT NULL, -- e.g., 'updated_nft_status', 'suspended_user'
    target_type VARCHAR(100), -- e.g., 'NFT', 'User', 'Category'
    target_id VARCHAR(255), -- ID of the item affected
    details JSONB, -- Additional details about the action
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE admin_audit_log IS 'Logs significant actions performed by administrators.';
CREATE INDEX idx_admin_audit_log_admin_id ON admin_audit_log(admin_user_id);
CREATE INDEX idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX idx_admin_audit_log_target ON admin_audit_log(target_type, target_id);

-- ================================================================================================
-- Platform Settings Table
-- ================================================================================================
CREATE TABLE platform_settings (
    setting_key VARCHAR(100) PRIMARY KEY NOT NULL,
    setting_value TEXT,
    description VARCHAR(255),
    type platform_setting_type_enum NOT NULL DEFAULT 'string',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE platform_settings IS 'Stores global configuration settings for the platform, manageable by admins.';
COMMENT ON COLUMN platform_settings.setting_key IS 'Unique key for the setting (e.g., site_name, maintenance_mode).';
COMMENT ON COLUMN platform_settings.setting_value IS 'Value of the setting (can be JSON for complex settings).';
COMMENT ON COLUMN platform_settings.type IS 'Data type of the setting_value.';
COMMENT ON COLUMN platform_settings.is_public IS 'If true, this setting might be exposed to frontend (use with caution).';

-- ================================================================================================
-- Promotions Table
-- ================================================================================================
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    type promotion_type_enum NOT NULL,
    target_nft_id UUID REFERENCES nfts(id) ON DELETE CASCADE, -- If NFT is deleted, promotion is removed
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- If Artist is deleted, promotion is removed
    target_collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255),
    link_url VARCHAR(255),
    start_date TIMESTAMP WITHOUT TIME ZONE,
    end_date TIMESTAMP WITHOUT TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE promotions IS 'Manages featured NFTs, artist spotlights, etc.';
CREATE INDEX idx_promotions_type_active_dates ON promotions(type, is_active, start_date, end_date);

-- ================================================================================================
-- Mock Data Insertion
-- ================================================================================================

-- Passwords are 'adminpass', 'testpass', 'artistpass', 'collectorpass'
-- Bcrypt hash for 'adminpass' ($2a$10$G1qS3q3e.iE8pZq4p.Q9VuY7sVqg9wz4X.NfXy0x8hY7.z3.fKymq)
-- Bcrypt hash for 'testpass' ($2a$10$eA.zC3bV4kQlE2vYx8.x6uWq3w5E1sL0d8K3eH9nJ1a.O4sL2p9iG)
-- Bcrypt hash for 'artistpass' ($2a$10$/u9YnJGqnVjODn3vsGCZ4uS9gPntJdF8sUjS2jX.wA.3oZ7xL2M3K)
-- Bcrypt hash for 'collectorpass' ($2a$10$k5Z9s6Hj3q.EwN8r.P0b9uc2nU.f9jX.k0eW7qS5qB8wL2vX3x4mJ)

INSERT INTO users (id, email, password_hash, username, role) VALUES
('usr_00000000-0000-0000-0000-ADMIN0000001', 'admin@artnft.com', '$2a$10$G1qS3q3e.iE8pZq4p.Q9VuY7sVqg9wz4X.NfXy0x8hY7.z3.fKymq', 'ArtNFTAdmin', 'admin'),
('usr_00000000-0000-0000-0000-000000000001', 'testuser@artnft.com', '$2a$10$eA.zC3bV4kQlE2vYx8.x6uWq3w5E1sL0d8K3eH9nJ1a.O4sL2p9iG', 'TestUser01', 'user'),
('usr_00000000-0000-0000-0000-000000000002', 'artist@example.com', '$2a$10$/u9YnJGqnVjODn3vsGCZ4uS9gPntJdF8sUjS2jX.wA.3oZ7xL2M3K', 'ArtIsLife', 'user'),
('usr_00000000-0000-0000-0000-000000000003', 'collector@example.com', '$2a$10$k5Z9s6Hj3q.EwN8r.P0b9uc2nU.f9jX.k0eW7qS5qB8wL2vX3x4mJ', 'NFTCollectorGal', 'user'),
('usr_00000000-0000-0000-0000-000000000004', 'gallery@example.com', '$2a$10$eA.zC3bV4kQlE2vYx8.x6uWq3w5E1sL0d8K3eH9nJ1a.O4sL2p9iG', 'CryptoGallery', 'user'),
('usr_00000000-0000-0000-0000-000000000005', 'creator@example.com', '$2a$10$/u9YnJGqnVjODn3vsGCZ4uS9gPntJdF8sUjS2jX.wA.3oZ7xL2M3K', 'DigitalCreatorPro', 'user'),
('usr_00000000-0000-0000-0000-000000000006', 'investor@example.com', '$2a$10$k5Z9s6Hj3q.EwN8r.P0b9uc2nU.f9jX.k0eW7qS5qB8wL2vX3x4mJ', 'NFTInvestorX', 'user'),
('usr_00000000-0000-0000-0000-000000000007', 'viewer@example.com', '$2a$10$eA.zC3bV4kQlE2vYx8.x6uWq3w5E1sL0d8K3eH9nJ1a.O4sL2p9iG', 'ArtViewer22', 'user'),
('usr_00000000-0000-0000-0000-000000000008', 'designer@example.com', '$2a$10$/u9YnJGqnVjODn3vsGCZ4uS9gPntJdF8sUjS2jX.wA.3oZ7xL2M3K', 'UXDesignerArt', 'user'),
('usr_00000000-0000-0000-0000-000000000009', 'synth@example.com', '$2a$10$k5Z9s6Hj3q.EwN8r.P0b9uc2nU.f9jX.k0eW7qS5qB8wL2vX3x4mJ', 'SynthMusician', 'user'),
('usr_00000000-0000-0000-0000-000000000010', 'pixel@example.com', '$2a$10$eA.zC3bV4kQlE2vYx8.x6uWq3w5E1sL0d8K3eH9nJ1a.O4sL2p9iG', 'PixelPioneer', 'user');


INSERT INTO categories (name, slug, description, icon) VALUES
('Digital Art', 'digital-art', 'Creations made with digital technologies.', 'Palette'),
('Photography', 'photography', 'Art captured through the lens.', 'Camera'),
('Music', 'music', 'Audio NFTs and music-related collectibles.', 'Music2'),
('Collectibles', 'collectibles', 'Unique digital items and memorabilia.', 'ToyBrick'),
('Virtual Worlds', 'virtual-worlds', 'Assets for metaverses and virtual environments.', 'Globe'),
('Utility Tokens', 'utility-tokens', 'NFTs that grant access or perks.', 'Bitcoin'),
('Generative Art', 'generative-art', 'Art created using autonomous systems and algorithms.', 'Sparkles'),
('Pixel Art', 'pixel-art', 'Digital art created at the pixel level.', 'Grid');

INSERT INTO nfts (id, title, description, image_url, price_eth, status, is_auction, auction_ends_at, creator_id, owner_id, category_id, tags, royalty_percentage, view_count, created_at) VALUES
('nft_00000000-0000-0000-0000-MOCK00000001', 'My First Abstract', 'An exploration of color and form by TestUser01.', 'https://placehold.co/600x400.png', 0.5, 'listed', FALSE, NULL, 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 1, '["abstract", "colorful", "digital"]'::JSONB, 5.00, 102, NOW() - INTERVAL '3 days'),
('nft_00000000-0000-0000-0000-MOCK00000002', 'Pixel Pal', 'A friendly pixel character, ready for adventure!', 'https://placehold.co/600x400.png', 0.2, 'on_auction', TRUE, NOW() + INTERVAL '3 days', 'usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000001', 8, '["pixelart", "character", "cute"]'::JSONB, 7.50, 250, NOW() - INTERVAL '2 days'),
('nft_00000000-0000-0000-0000-MOCK00000003', 'Dream Weaver #1', 'A surreal landscape from another dimension.', 'https://placehold.co/600x400.png', 1.2, 'listed', FALSE, NULL, 'usr_00000000-0000-0000-0000-000000000002', 'usr_00000000-0000-0000-0000-000000000002', 1, '["surreal", "landscape", "dream"]'::JSONB, 10.00, 180, NOW() - INTERVAL '5 days');

INSERT INTO bids (nft_id, user_id, bid_amount_eth, bid_time) VALUES
('nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000004', 0.25, NOW() - INTERVAL '1 hour'),
('nft_00000000-0000-0000-0000-MOCK00000002', 'usr_00000000-0000-0000-0000-000000000003', 0.30, NOW() - INTERVAL '10 minutes');

INSERT INTO favorites (user_id, nft_id) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'nft_00000000-0000-0000-0000-MOCK00000003');

INSERT INTO user_follows (follower_id, followed_id) VALUES
('usr_00000000-0000-0000-0000-000000000001', 'usr_00000000-0000-0000-0000-000000000002'); -- TestUser01 follows ArtIsLife

INSERT INTO platform_settings (setting_key, setting_value, description, type, is_public) VALUES
('site_name', 'ArtNFT Marketplace', 'The official name of the platform.', 'string', TRUE),
('maintenance_mode', 'false', 'Set to true to enable maintenance mode for the site.', 'boolean', TRUE),
('default_royalty_percentage', '10', 'Default royalty percentage for new NFT mints.', 'number', FALSE),
('primary_theme_color', '#7DF9FF', 'Primary theme color (Electric Blue).', 'theme_color', TRUE);

SELECT 'Mock data insertion complete.' AS status;
