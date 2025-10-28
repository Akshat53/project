-- Create database
CREATE DATABASE IF NOT EXISTS eventsphere_db;

-- Use the database
USE eventsphere_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_type ENUM('Personal', 'Business') DEFAULT 'Personal',
    event_type VARCHAR(100),
    decorations TEXT,
    profile_picture VARCHAR(255),
    age INT,
    referrer VARCHAR(100),
    suggestion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Show table structure
DESCRIBE users;