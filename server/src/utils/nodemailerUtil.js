import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use SMTP settings
    auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_PASSWORD
    }
});

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.CLIENT_URL}}/reset-password?token=${token}`;

    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);
};
