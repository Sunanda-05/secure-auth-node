import db from "../config/db.js";

// Insert a new user
export const createUser = (email, password) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO users (email, password) VALUES (?, ?)`,
            [email, password],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

// Get user by email
export const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Update password
export const updatePassword = (email, newPassword) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET password = ? WHERE email = ?`,
            [newPassword, email],
            function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
};

// Increment failed login attempts
export const incrementFailedAttempts = (email) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET failedAttempts = failedAttempts + 1 WHERE email = ?`,
            [email],
            function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
};

// Lock user account after multiple failed attempts
export const lockUser = (email) => {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE users SET isLocked = 1 WHERE email = ?`, [email], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};
