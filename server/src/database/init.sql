-- Users Table (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isLocked BOOLEAN DEFAULT 0,
    locked_until TIMESTAMP DEFAULT NULL,
    failedAttempts INTEGER DEFAULT 0,
    is2FAEnabled BOOLEAN DEFAULT 0,
    otpSecret TEXT -- For 2FA (TOTP-based authentication)
);

-- Refresh Tokens Table (For Secure JWT-Based Authentication)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Password Reset Tokens Table (For Password Recovery)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);