import db from "../config/db.js";

// Store refresh token
export const storeRefreshToken = (userId, token, expiresAt) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO refresh_tokens (userId, token, expiresAt) VALUES (?, ?, ?)`,
            [userId, token, expiresAt],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

// Get refresh token
export const getRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM refresh_tokens WHERE token = ?`, [token], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Delete refresh token (on logout)
export const deleteRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM refresh_tokens WHERE token = ?`, [token], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};
