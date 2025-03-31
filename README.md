# 🔒 Node.js User Authentication & Security System

This backend project implements a **robust and secure user Authentication system using Node.js**, designed for production environments. It provides comprehensive features including user **_registration_**, secure **_login with account lockout_**, **_password reset_**, **_two-factor authentication (2FA)_**, and **_advanced token management_**.

## ✨ Key Features

### 👤 User Authentication & Management

- **Secure User Registration**:
  - Passwords are securely hashed using `bcryptjs`.
- **Robust User Login**:
  - Implements account lockout after a configurable number of failed login attempts.
  - Tracks failed login attempts to prevent brute-force attacks.
  - Account lockout with automatic unlocking after a set period.
- **Token-Based Authentication**:
  - Uses JWT (`jsonwebtoken`) for secure access and refresh tokens.
  - Refresh tokens are securely stored in HTTP-only cookies to mitigate XSS vulnerabilities.
  - `/refresh-token` endpoint for seamless token renewal without re-login.

### 🔑 Password Reset & Recovery

- **Secure Password Reset Tokens**:
  - Generates time-limited, cryptographically secure tokens.
- **Email-Based Reset Links**:
  - Utilizes `Nodemailer` to send password reset links with secure tokens.
- **Token Verification & Password Update**:
  - Verifies reset tokens before allowing password changes.
  - Single-use tokens with automatic expiry.

### 🔐 Two-Factor Authentication (2FA)

- **TOTP Secret Generation & Storage**:
  - Generates and stores TOTP secrets using `speakeasy`.
- **QR Code Setup**:
  - Generates QR codes (`qrcode`) for easy setup with authenticator apps.
- **TOTP Verification at Login**:
  - Requires TOTP codes for enhanced login security.

### 🛡️ Security & Rate Limiting

- **API Rate Limiting**:
  - Implements rate limiting using `express-rate-limit` to prevent brute-force attacks.
- **IP-Based Login Restrictions**:
  - Blocks repeated failed login attempts from specific IP addresses.
- **Secure Logout**:
  - Clears refresh token cookies to ensure complete logout.
- **Token Revocation**:
  - Invalidates tokens for enhanced security.
- **Secure CORS setup**:
  - Enables Cross-Origin Resource Sharing in a secure manner using the cors package.

## 🛠️ Tech Stack

- **Node.js**: Backend runtime environment.
- **Express**: Web application framework.
- **SQLite3**: Database for user data and login attempt tracking.
- **bcryptjs**: Password hashing.
- **jsonwebtoken**: JWT token generation and verification.
- **Nodemailer**: Email sending for password resets.
- **speakeasy**: TOTP generation for 2FA.
- **qrcode**: QR code generation for 2FA setup.
- **express-rate-limit**: API rate limiting.
- **cookie-parser**: HTTP cookie management.
- **cors**: Cross-Origin Resource Sharing.

## 🚀 Getting Started

1. **Clone the Repository:**

   ```bash
   git clone [repository-url]
   cd [project-directory]
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Database Setup:**

   - Ensure SQLite3 is properly configured.
   - Run any database migrations or setup scripts if necessary.

4. **Environment Configuration:**

   - Set up environment variables for JWT secrets, email credentials, and other sensitive information.
   - Create a `.env` file and populate it with your environment variables.
   - Example `.env` file content:

   ```env
     PORT=5000
     ACCESS_TOKEN_SECRET=your-access-token-key
     REFRESH_TOKEN_SECRET=your-refresh-token-key
     SERVICE_MAIL=your-email@gmail.com
     SERVICE_PASSWORD=your-email-password
     CLIENT_URL=http://yourwebsite.com
     ```

5. **Start the Server:**

   ```bash
   node --env-file=.env server.js
   ```

6. **API Documentation:**
   - Refer to the API documentation (if available) for endpoint details and usage.
