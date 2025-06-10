-- PostgreSQL Schema for ArtNFT Marketplace
-- Version: 1.2
-- Last Updated: (Will be set by the system)

-- Drop existing types and tables if they exist (for easier re-runs during development)
-- Be cautious with this in production!
DO $$
BEGIN
    DROP TABLE IF EXISTS admin_audit_log CASCADE;
    DROP TABLE IF EXISTS promotions CASCADE;
    DROP TABLE IF EXISTS platform_settings CASCADE;
    DROP TABLE IF EXISTS reports CASCADE;
    DROP TABLE IF EXISTS user_notification_preferences CASCADE;
    DROP TABLE IF EXISTS notifications CASCADE;
    DROP TABLE IF EXISTS transactions CASCADE;
    DROP TABLE IF EXISTS favorites CASCADE;
    DROP TABLE IF EXISTS bids CASCADE;
    DROP TABLE IF EXISTS nfts CASCADE;
    DROP TABLE IF EXISTS collections CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS user_follows CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    DROP TYPE IF EXISTS user_role_enum;
    DROP TYPE IF EXISTS nft_status_enum;
    DROP TYPE IF EXISTS promotion_type_enum;
    DROP TYPE IF EXISTS report_status_enum;
    DROP TYPE IF EXISTS report_content_type_enum;
    DROP TYPE IF EXISTS notification_type_enum;
    DROP TYPE IF EXISTS transaction_type_enum;
    DROP TYPE IF EXISTS transaction_status_enum;
    DROP TYPE IF EXISTS platform_setting_type_enum;
EXCEPTION
    WHEN undefined_object THEN
        -- Do nothing if types or tables don't exist
        RAISE NOTICE 'Some objects did not exist, skipping drop.';
END
$$;

-- Enable UUID generation if not already enabled (for PostgreSQL < 13, gen_random_uuid() is built-in for >=13)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define ENUM Types
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
CREATE TYPE nft_status_enum AS ENUM ('pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft', 'rejected');
CREATE TYPE promotion_type_enum AS ENUM ('nft_of_the_week', 'artist_spotlight', 'featured_collection');
CREATE TYPE report_status_enum AS ENUM ('pending_review', 'resolved_action_taken', 'resolved_no_action', 'dismissed');
CREATE TYPE report_content_type_enum AS ENUM ('nft', 'user_profile', 'comment');
CREATE TYPE notification_type_enum AS ENUM ('new_listing', 'bid_placed', 'bid_received', 'nft_sold', 'auction_ending_soon', 'auction_won', 'follow', 'system_update', 'promotion');
CREATE TYPE transaction_type_enum AS ENUM ('mint', 'sale_primary', 'sale_secondary', 'bid_placed', 'bid_refunded', 'royalty_payout');
CREATE TYPE transaction_status_enum AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE platform_setting_type_enum AS ENUM ('string', 'number', 'boolean', 'json', 'theme_color');


-- ================================================================================================
-- Users Table
-- ================================================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,
    avatar_url VARCHAR(2048),
    bio TEXT,
    wallet_address VARCHAR(42) UNIQUE, -- Ethereum address length
    role user_role_enum NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    CONSTRAINT users_wallet_address_check CHECK (wallet_address IS NULL OR wallet_address ~* '^0x[a-fA-F0-9]{40}$')
);
COMMENT ON TABLE users IS 'Stores user account information, credentials, and profile details.';
COMMENT ON COLUMN users.id IS 'Unique identifier for the user (UUID).';
COMMENT ON COLUMN users.wallet_address IS 'User''s cryptocurrency wallet address (e.g., Ethereum).';

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

-- ================================================================================================
-- Categories Table
-- ================================================================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- For Lucide icon name or similar
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE categories IS 'Defines categories for NFTs (e.g., Digital Art, Photography).';

CREATE INDEX idx_categories_slug ON categories(slug);

-- ================================================================================================
-- Collections Table
-- ================================================================================================
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(2048),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_collections_user_name UNIQUE (user_id, name) -- User cannot have two collections with the same name
);
COMMENT ON TABLE collections IS 'Allows users to group their NFTs into named collections.';

CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_slug ON collections(slug);

-- ================================================================================================
-- NFTs Table
-- ================================================================================================
CREATE TABLE nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(2048) NOT NULL,
    metadata_url VARCHAR(2048), -- Link to off-chain metadata JSON
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Prevent deleting user if they created NFTs
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL, -- If owner deleted, NFT becomes ownerless (or handle differently)
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
    status nft_status_enum NOT NULL DEFAULT 'pending_moderation',
    tags JSONB, -- Store tags as a JSON array of strings e.g. ['art', 'abstract']
    price_eth DECIMAL(18, 8), -- Price in ETH, NULL if not for direct sale or if auction starting_bid is used
    currency_symbol VARCHAR(10) NOT NULL DEFAULT 'ETH',
    is_auction BOOLEAN NOT NULL DEFAULT FALSE,
    auction_ends_at TIMESTAMP WITHOUT TIME ZONE,
    starting_bid_eth DECIMAL(18, 8),
    highest_bid_eth DECIMAL(18, 8),
    highest_bidder_id UUID REFERENCES users(id) ON DELETE SET NULL,
    royalty_percentage DECIMAL(5, 2) DEFAULT 0.00 CHECK (royalty_percentage >= 0.00 AND royalty_percentage <= 50.00), -- Max 50% royalty
    unlockable_content TEXT,
    view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT nfts_image_url_check CHECK (image_url ~* '^https?://.*'),
    CONSTRAINT nfts_price_check CHECK (price_eth IS NULL OR price_eth >= 0),
    CONSTRAINT nfts_starting_bid_check CHECK (starting_bid_eth IS NULL OR starting_bid_eth >= 0),
    CONSTRAINT nfts_auction_logic_check CHECK (NOT (is_auction = FALSE AND auction_ends_at IS NOT NULL)),
    CONSTRAINT nfts_auction_price_logic_check CHECK (NOT (is_auction = TRUE AND price_eth IS NOT NULL)) -- Typically, auction items don't have a fixed "buy now" price, or it's handled differently.
);
COMMENT ON TABLE nfts IS 'Stores all NFT details, including metadata, ownership, and sale status.';
COMMENT ON COLUMN nfts.tags IS 'Tags as a JSON array of strings, e.g., ["art", "pixel", "abstract"].';
COMMENT ON COLUMN nfts.royalty_percentage IS 'Royalty percentage for secondary sales (0-50).';

CREATE INDEX idx_nfts_creator_id ON nfts(creator_id);
CREATE INDEX idx_nfts_owner_id ON nfts(owner_id);
CREATE INDEX idx_nfts_category_id ON nfts(category_id);
CREATE INDEX idx_nfts_collection_id ON nfts(collection_id);
CREATE INDEX idx_nfts_status ON nfts(status);
CREATE INDEX idx_nfts_title ON nfts(title); -- For searching by title
CREATE INDEX idx_nfts_tags ON nfts USING GIN (tags); -- GIN index for JSONB tags
CREATE INDEX idx_nfts_price_eth ON nfts(price_eth) WHERE status = 'listed' AND is_auction = FALSE;
CREATE INDEX idx_nfts_auction_status ON nfts(is_auction, auction_ends_at) WHERE status = 'on_auction';

-- ================================================================================================
-- Bids Table
-- ================================================================================================
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bid_amount_eth DECIMAL(18, 8) NOT NULL CHECK (bid_amount_eth > 0),
    bid_time TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_withdrawn BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_bids_nft_user_amount_time UNIQUE (nft_id, user_id, bid_amount_eth, bid_time) -- Prevents exact duplicate bids
);
COMMENT ON TABLE bids IS 'Tracks bids made on NFTs that are up for auction.';

CREATE INDEX idx_bids_nft_id ON bids(nft_id);
CREATE INDEX idx_bids_user_id ON bids(user_id);
CREATE INDEX idx_bids_nft_amount_time ON bids(nft_id, bid_amount_eth DESC, bid_time DESC);

-- ================================================================================================
-- Favorites Table
-- ================================================================================================
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_favorites_user_nft UNIQUE (user_id, nft_id) -- User can only favorite an NFT once
);
COMMENT ON TABLE favorites IS 'Allows users to mark NFTs as their favorites.';

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_nft_id ON favorites(nft_id);

-- ================================================================================================
-- Transactions Table
-- ================================================================================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(66) UNIQUE, -- e.g., Ethereum transaction hash
    nft_id UUID REFERENCES nfts(id) ON DELETE RESTRICT, -- What NFT was involved (if any)
    from_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Seller or previous owner
    to_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Buyer or new owner
    transaction_type transaction_type_enum NOT NULL,
    transaction_amount_eth DECIMAL(18, 8),
    gas_fee_eth DECIMAL(18, 8),
    currency_symbol VARCHAR(10) NOT NULL DEFAULT 'ETH',
    transaction_time TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status transaction_status_enum NOT NULL DEFAULT 'pending',
    details JSONB -- Store additional details like marketplace fee, royalties paid, etc.
);
COMMENT ON TABLE transactions IS 'Logs all significant blockchain-related transactions.';
COMMENT ON COLUMN transactions.details IS 'Additional transaction specific data, e.g. marketplace_fee, royalties_paid_to_creator_id, etc.';

CREATE INDEX idx_transactions_nft_id ON transactions(nft_id);
CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_time ON transactions(transaction_time DESC);

-- ================================================================================================
-- Notifications Table
-- ================================================================================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user receiving the notification
    type notification_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    related_entity_id VARCHAR(255), -- e.g., NFT ID, User ID, Transaction ID
    related_entity_type VARCHAR(50), -- e.g., 'nft', 'user', 'transaction'
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE notifications IS 'Stores notifications for users about platform activities.';
COMMENT ON COLUMN notifications.related_entity_id IS 'ID of the entity this notification relates to (e.g., NFT ID, User ID).';

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);

-- ================================================================================================
-- User Follows Table
-- ================================================================================================
CREATE TABLE user_follows (
    id SERIAL PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_follows_pair UNIQUE (follower_id, followed_id),
    CONSTRAINT chk_user_cannot_follow_self CHECK (follower_id <> followed_id)
);
COMMENT ON TABLE user_follows IS 'Tracks follow relationships between users.';

CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_followed_id ON user_follows(followed_id);

-- ================================================================================================
-- User Notification Preferences Table
-- ================================================================================================
CREATE TABLE user_notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_new_listing BOOLEAN NOT NULL DEFAULT TRUE,
    email_bid_activity BOOLEAN NOT NULL DEFAULT TRUE,
    email_item_sold BOOLEAN NOT NULL DEFAULT TRUE,
    email_auction_results BOOLEAN NOT NULL DEFAULT TRUE,
    email_platform_updates BOOLEAN NOT NULL DEFAULT TRUE,
    push_new_listing BOOLEAN NOT NULL DEFAULT TRUE, -- Placeholder for future push notifications
    push_bid_activity BOOLEAN NOT NULL DEFAULT TRUE,
    push_item_sold BOOLEAN NOT NULL DEFAULT TRUE,
    push_auction_results BOOLEAN NOT NULL DEFAULT TRUE,
    push_platform_updates BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_notification_preferences_user_id UNIQUE (user_id)
);
COMMENT ON TABLE user_notification_preferences IS 'Stores user preferences for receiving various types of notifications.';

CREATE INDEX idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);

-- ================================================================================================
-- Reports Table (Content Moderation)
-- ================================================================================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_content_id VARCHAR(255) NOT NULL, -- Could be NFT ID, User ID, Comment ID
    content_type report_content_type_enum NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status report_status_enum NOT NULL DEFAULT 'pending_review',
    admin_notes TEXT, -- Notes by admin handling the report
    resolved_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE reports IS 'Stores reports made by users against content or other users.';

CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status_content_type ON reports(status, content_type);
CREATE INDEX idx_reports_resolved_by_admin_id ON reports(resolved_by_admin_id);

-- ================================================================================================
-- Admin Audit Log Table
-- ================================================================================================
CREATE TABLE admin_audit_log (
    id SERIAL PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Admin who performed the action
    action VARCHAR(255) NOT NULL, -- e.g., 'updated_user_status', 'deleted_nft'
    target_entity_type VARCHAR(50), -- e.g., 'user', 'nft', 'category'
    target_entity_id VARCHAR(255), -- ID of the entity affected
    details JSONB, -- Additional details about the action
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE admin_audit_log IS 'Logs significant actions performed by administrators.';

CREATE INDEX idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX idx_admin_audit_log_target ON admin_audit_log(target_entity_type, target_entity_id);

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
COMMENT ON COLUMN platform_settings.is_public IS 'If true, this setting might be exposed to frontend (use with caution).';


-- ================================================================================================
-- Promotions Table
-- ================================================================================================
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    type promotion_type_enum NOT NULL,
    target_id VARCHAR(255) NOT NULL, -- NFT ID, User ID (artist), Collection ID
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(2048),
    start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITHOUT TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_by_admin_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE promotions IS 'Manages featured NFTs, artist spotlights, and other promotional content.';

CREATE INDEX idx_promotions_type_active ON promotions(type, is_active, start_date, end_date);
CREATE INDEX idx_promotions_target_id ON promotions(target_id);


-- ================================================================================================
-- Mock Data Insertion
-- ================================================================================================

-- Mock Users (Password for all is 'adminpass', 'artistpass', 'collectorpass' - bcrypted)
-- For admin@artnft.com and testuser@artnft.com, password is 'adminpass'
-- For artist@example.com, password is 'artistpass'
-- For collector@example.com, password is 'collectorpass'
-- The UUIDs are now valid.
INSERT INTO users (id, email, password_hash, username, role, avatar_url, bio) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@artnft.com', '$2a$10$G1qS3q3e.iE8pZq4p.Q9VuY7sVqg9wz4X.NfXy0x8hY7.z3.fKymq', 'ArtNFTAdmin', 'admin', 'https://placehold.co/100x100.png', 'Platform Administrator for ArtNFT Marketplace.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'testuser@artnft.com', '$2a$10$G1qS3q3e.iE8pZq4p.Q9VuY7sVqg9wz4X.NfXy0x8hY7.z3.fKymq', 'TestUser01', 'user', 'https://placehold.co/100x100.png', 'Enthusiast of digital art and blockchain technology. Exploring the ArtNFT world.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'artist@example.com', '$2a$10$0y9QzJ4Y.R8lJ4zT5yW7AeV2.L0n3o2p7i4c6K9z0B5xN1kXyR6oK', 'ArtIsLife', 'user', 'https://placehold.co/100x100.png', 'Digital artist weaving dreams into pixels. Creator of unique NFT experiences.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'collector@example.com', '$2a$10$P1bXvR0xR8gW2vHn6dK5i.t0sP3q.R1sL9kY7jN0mZ3bX4rO.cWpW', 'NFTCollectorGal', 'user', 'https://placehold.co/100x100.png', 'Avid collector of rare and beautiful NFTs. Always looking for the next masterpiece.');

-- Mock Categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Digital Art', 'digital-art', 'Creations made with digital technologies, from illustrations to 3D art.', 'Palette'),
('Photography', 'photography', 'Art captured through the lens, showcasing moments and perspectives.', 'Camera'),
('Music', 'music', 'Audio NFTs, from tracks and albums to soundscapes and musical experiments.', 'Music2'),
('Collectibles', 'collectibles', 'Unique digital items, memorabilia, and tradable assets.', 'ToyBrick'),
('Virtual Worlds', 'virtual-worlds', 'Assets for metaverses, including land, avatars, and wearables.', 'Globe'),
('Utility Tokens', 'utility-tokens', 'NFTs that grant access, perks, or functionalities.', 'Bitcoin'),
('Generative Art', 'generative-art', 'Art created using autonomous systems, often involving algorithms and code.', 'Sparkles'),
('Pixel Art', 'pixel-art', 'Digital art created using raster graphics software, where images are edited on the pixel level.', 'Grid');


-- Mock NFTs
INSERT INTO nfts (id, title, description, image_url, creator_id, owner_id, category_id, status, price_eth, is_auction, starting_bid_eth, auction_ends_at, tags) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'My First Abstract', 'An exploration of color and form.', 'https://placehold.co/400x400.png', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', (SELECT id from categories WHERE slug='digital-art'), 'listed', 0.5, FALSE, NULL, NULL, '["abstract", "colorful", "digital"]'::JSONB),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'Pixel Pal', 'A friendly pixel character, ready for adventure!', 'https://placehold.co/400x400.png', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', (SELECT id from categories WHERE slug='pixel-art'), 'on_auction', NULL, TRUE, 0.2, CURRENT_TIMESTAMP + INTERVAL '3 days', '["pixel", "character", "cute", "8bit"]'::JSONB),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'Dream Weaver #1', 'A surreal landscape from the mind of ArtIsLife.', 'https://placehold.co/400x400.png', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', (SELECT id from categories WHERE slug='digital-art'), 'listed', 1.2, FALSE, NULL, NULL, '["surreal", "dream", "landscape", "digital"]'::JSONB),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'Ephemeral Light', 'Capturing fleeting moments of light and shadow.', 'https://placehold.co/400x400.png', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NULL, (SELECT id from categories WHERE slug='photography'), 'listed', 0.8, FALSE, NULL, NULL, '["light", "abstract", "photography", "moody"]'::JSONB);

-- Mock Favorites
INSERT INTO favorites (user_id, nft_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13'); -- TestUser01 favorites Dream Weaver #1

-- Mock Bids
INSERT INTO bids (nft_id, user_id, bid_amount_eth) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 0.25), -- NFTCollectorGal bids on Pixel Pal
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 0.3);  -- ArtIsLife bids on Pixel Pal (highest)

-- Update Pixel Pal with highest bid info (manual step for mock data consistency)
UPDATE nfts SET highest_bid_eth = 0.3, highest_bidder_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13' WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12';

-- Mock Follows
INSERT INTO user_follows (follower_id, followed_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'); -- TestUser01 follows ArtIsLife

-- Mock Platform Settings
INSERT INTO platform_settings (setting_key, setting_value, description, type, is_public) VALUES
('site_name', 'ArtNFT Marketplace', 'The official name of the platform.', 'string', TRUE),
('maintenance_mode', 'false', 'Set to "true" to enable maintenance mode.', 'boolean', TRUE),
('default_royalty_percentage', '5.0', 'Default royalty percentage for new mints if not specified.', 'number', FALSE),
('theme_primary_color', '#3B69CC', 'Primary theme color (hex).', 'theme_color', TRUE);

-- Mock Notifications (Example)
INSERT INTO notifications (user_id, type, title, message, related_entity_id, related_entity_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'bid_received', 'New Bid on Your NFT!', 'You received a new bid of 0.3 ETH on "Pixel Pal".', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'nft');

-- Mock Transactions (Example)
INSERT INTO transactions (nft_id, from_user_id, to_user_id, transaction_type, transaction_amount_eth, status, transaction_hash) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', NULL, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'mint', 0.01, 'completed', '0xmocktransactionhashformint001');


-- ================================================================================================
-- Functions and Triggers (Example: to automatically update `updated_at` columns)
-- ================================================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to tables that have an `updated_at` column
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_categories
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_collections
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_nfts
BEFORE UPDATE ON nfts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_notification_preferences
BEFORE UPDATE ON user_notification_preferences
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_reports
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_platform_settings
BEFORE UPDATE ON platform_settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_promotions
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- End of Schema --
SELECT 'ArtNFT Marketplace Schema & Mock Data Loaded Successfully.' AS message;
