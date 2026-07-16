-- SR Events - Creators Awards Voting Platform
-- Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS vote_devices;
DROP TABLE IF EXISTS creators;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS settings;

-- Create admins table
CREATE TABLE admins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    requires_password_change BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(email)
);

-- Create categories table
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(255),
    display_order INT DEFAULT 0,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    voting_start DATETIME,
    voting_end DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(slug),
    INDEX(status)
);

-- Create creators table
CREATE TABLE creators (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    creator_name VARCHAR(150) NOT NULL,
    short_bio VARCHAR(500),
    profile_image VARCHAR(255),
    instagram_url VARCHAR(255),
    youtube_url VARCHAR(255),
    display_order INT DEFAULT 0,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX(category_id),
    INDEX(status)
);

-- Create vote_devices table (for duplicate vote prevention)
CREATE TABLE vote_devices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    browser_fingerprint VARCHAR(255) NOT NULL UNIQUE,
    cookie_token VARCHAR(255),
    local_storage_token VARCHAR(255),
    first_ip VARCHAR(45),
    latest_ip VARCHAR(45),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    device_type VARCHAR(50),
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(browser_fingerprint)
);

-- Create votes table
CREATE TABLE votes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    creator_id BIGINT NOT NULL,
    vote_device_id BIGINT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    risk_score TINYINT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (vote_device_id) REFERENCES vote_devices(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX(category_id),
    INDEX(creator_id),
    INDEX(vote_device_id),
    INDEX(created_at),
    UNIQUE KEY unique_vote (category_id, vote_device_id)
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX(admin_id),
    INDEX(created_at)
);

-- Create settings table (only one row needed)
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255),
    event_logo VARCHAR(255),
    event_description TEXT,
    global_voting_enabled BOOLEAN DEFAULT TRUE,
    voting_start DATETIME,
    voting_end DATETIME,
    footer_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (id, event_name, event_description, global_voting_enabled) 
VALUES (1, 'Creators Awards', 'Vote for your favorite creators', TRUE);

-- Insert sample admin (password: admin123 - should be hashed in production)
-- Hash: $2b$10$tQW1W0W0W0W0W0W0W0W0W (use bcrypt in production)
INSERT INTO admins (full_name, email, password)
VALUES ('Admin User', 'admin@example.com', '$2b$10$tQW1W0W0W0W0W0W0W0W0WO8c8B4J5L3K2M9Q7W5Z1X3C5V7B9N');
