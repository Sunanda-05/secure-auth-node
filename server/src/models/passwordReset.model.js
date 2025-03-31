import db from "../config/db.js";

// Store password reset token
export const storePasswordResetToken = (userId, token, expiresAt) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO password_reset_tokens (userId, token, expiresAt) VALUES (?, ?, ?)`,
            [userId, token, expiresAt],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

// Get password reset token
export const getPasswordResetToken = (token) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM password_reset_tokens WHERE token = ?`, [token], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Delete password reset token after use
export const deletePasswordResetToken = (token) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM password_reset_tokens WHERE token = ?`, [token], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};
