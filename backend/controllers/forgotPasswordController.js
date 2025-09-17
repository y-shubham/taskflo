import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD, 
  },
});

const APP_WEB_URL =
  process.env.APP_WEB_URL || "http://localhost:3000";
const APP_NAME = process.env.APP_NAME || "TaskFlo";

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const resetEmailTemplate = ({ appName, resetUrl, expiresMinutes = 15 }) => {
  const safeUrl = escapeHtml(resetUrl);
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Reset your password</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.05);">
            <tr>
              <td style="padding:24px 24px 8px 24px;text-align:center;">
                <div style="display:inline-block;background:#eef2ff;color:#4f46e5;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:600;letter-spacing:.2px;">
                  ${escapeHtml(appName)}
                </div>
                <h1 style="margin:16px 0 8px 0;font-size:22px;line-height:1.3;color:#0f172a;">Reset your password</h1>
                <p style="margin:0 0 8px 0;font-size:14px;color:#475569;">
                  Click the button below to create a new password. This link expires in ${expiresMinutes} minutes.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 24px 4px 24px;text-align:center;">
                <a href="${safeUrl}" target="_blank"
                   style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;
                          padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;">
                  Reset password
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 24px 0 24px;">
                <p style="margin:12px 0 0 0;font-size:12px;color:#64748b;word-break:break-all;">
                  Or copy and paste this link into your browser:<br/>
                  <span style="color:#334155;">${safeUrl}</span>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px 24px 24px;text-align:center;color:#64748b;font-size:12px;">
                If you didn’t request a password reset, you can ignore this email.
              </td>
            </tr>
          </table>

          <div style="margin-top:14px;color:#94a3b8;font-size:12px;">
            © ${new Date().getFullYear()} ${escapeHtml(
    appName
  )}. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const genericMsg =
    "If that email is registered, a password reset link has been sent.";

  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: genericMsg });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    const resetUrl = `${APP_WEB_URL}/resetPassword?token=${encodeURIComponent(
      resetToken
    )}`;

    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Reset your password",
      html: resetEmailTemplate({
        appName: APP_NAME,
        resetUrl,
        expiresMinutes: 15,
      }),
      text: `Reset your password (expires in 15 minutes): ${resetUrl}`,
    });

    return res.status(200).json({ message: genericMsg });
  } catch (err) {
    return res.status(200).json({ message: genericMsg });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const now = new Date();

    const user = await userModel.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: { $gt: now },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const saltRounds = 12;
    user.password = await bcrypt.hash(password, saltRounds);
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;

    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
