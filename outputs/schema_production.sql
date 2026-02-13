-- CY LIVE 4.0 | PRODUCTION DATABASE SCHEMA
-- Matches SeeWhy LIVE high-performance streaming architecture

-- 1. Users & Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Wallets & Earnings
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_earnings DECIMAL(15, 2) DEFAULT 0.00,
    pending_payouts DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    last_payout_at TIMESTAMP WITH TIME ZONE
);

-- 3. Live Streams
CREATE TABLE streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    stream_key VARCHAR(100) UNIQUE NOT NULL,
    push_url TEXT,
    rtmp_url TEXT,
    is_live BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    access_code VARCHAR(50),
    peak_viewers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Paywall Systems
CREATE TABLE paywalls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id UUID REFERENCES streams(id),
    price DECIMAL(10, 2) NOT NULL,
    access_tier VARCHAR(50) DEFAULT 'premium',
    total_redemptions INTEGER DEFAULT 0
);

-- 5. Donations & Split Logic
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    stream_id UUID REFERENCES streams(id),
    gross_amount DECIMAL(10, 2) NOT NULL,
    net_to_creator DECIMAL(10, 2) NOT NULL, -- 90% after fees target
    platform_take DECIMAL(10, 2) NOT NULL,  -- 10% after fees target
    payment_method VARCHAR(50), -- CashApp, PayPal, etc.
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Direct Payment Log (Matching Image 7)
CREATE TABLE payment_provider_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID REFERENCES donations(id),
    provider_transaction_id TEXT,
    provider_name VARCHAR(50), -- PayPal, CashApp, Venmo, Zelle, Chime
    payout_status VARCHAR(20)
);

-- 7. Video Posts (10 Min Extension)
CREATE TABLE video_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title TEXT,
    file_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds <= 600),
    is_short BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Expandable Panel Metrics
CREATE TABLE panel_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id UUID REFERENCES streams(id),
    guest_count INTEGER DEFAULT 1,
    layout_type VARCHAR(20) DEFAULT 'grid', -- solo, grid, audio_only
    active_layout JSONB
);

-- 9. AI Agent Interactions
CREATE TABLE ai_agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id UUID REFERENCES streams(id),
    agent_name VARCHAR(50), -- Llama 3.1, Claude, Long Cat
    prompt_tokens INTEGER,
    response_text TEXT,
    action_taken TEXT
);

-- 10. Social Sharing & Install Attribution
CREATE TABLE share_attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID, -- Video or Stream ID
    platform VARCHAR(50), -- Instagram, TikTok, etc.
    share_id VARCHAR(100) UNIQUE,
    click_count INTEGER DEFAULT 0,
    install_count INTEGER DEFAULT 0
);

-- Indices for performance
CREATE INDEX idx_streams_live ON streams(is_live) WHERE is_live = TRUE;
CREATE INDEX idx_donations_receiver ON donations(receiver_id);
CREATE INDEX idx_video_duration ON video_posts(duration_seconds);
