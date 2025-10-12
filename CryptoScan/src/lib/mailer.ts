import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
  },
});

export async function sendOtpMail(to: string, code: string) {
  try {
    const info = await transporter.sendMail({
      from: `"CryptoGuard AI" <${process.env.GMAIL_USER}>`, // sender
      to,
      subject: "Your OTP Code - CryptoGuard AI",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2>Verify your email</h2>
          <p>Use the following code to complete your registration:</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</div>
          <p style="margin-top:12px;color:#666">This code expires in 10 minutes.</p>
        </div>
      `,
    });

    console.log("📨 Gmail SMTP response:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Gmail SMTP error:", error);
    throw error;
  }
}
