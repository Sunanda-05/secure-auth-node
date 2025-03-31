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
export const lockUserAccount = (email, duration) => {
  const lockedUntil = new Date(Date.now() + duration).toISOString();
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET isLocked = 1, locked_until = ? WHERE email = ?`,
      [lockedUntil, email],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

export const updateFailedAttempts = async (email, attempts) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET failedAttempts = ? WHERE email = ?",
      [attempts, email],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

// Lock user account
// export const lockUserAccount = async (email, duration) => {
//     const lockedUntil = new Date(Date.now() + duration).toISOString();
//     await db.run("UPDATE users SET isLocked = 1, locked_until = ? WHERE email = ?", [lockedUntil, email]);
// };

// Unlock user account
export const unlockUserAccount = async (email) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET isLocked = 0, locked_until = NULL, failedAttempts = 0 WHERE email = ?",
      [email],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};


// Enable 2FA
export const enable2FA = (email, otpSecret) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET otpSecret = ?, is2FAEnabled = 1 WHERE email = ?`,
      [otpSecret, email],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

// Get user OTP secret
export const getUserOTPSecret = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT otpSecret FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
