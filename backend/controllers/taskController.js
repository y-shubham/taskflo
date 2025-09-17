import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const APP_WEB_URL = process.env.APP_WEB_URL || "http://localhost:3000";

const taskAddedTemplate = (title, description) => {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Task Added</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.05);">
            <tr>
              <td style="padding:24px 24px 8px 24px;text-align:center;">
                <div style="display:inline-block;background:#eef2ff;color:#4f46e5;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:600;letter-spacing:.2px;">
                  Task Added
                </div>
                <h1 style="margin:16px 0 8px 0;font-size:22px;line-height:1.3;color:#0f172a;">Your task was created successfully</h1>
                <p style="margin:0 0 8px 0;font-size:14px;color:#475569;">Here are the details you just added:</p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 24px 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 16px 8px 16px;">
                      <div style="font-size:13px;color:#64748b;margin-bottom:4px;">Title</div>
                      <div style="font-size:16px;font-weight:600;color:#0f172a;">${safeTitle}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 16px 16px 16px;border-top:1px solid #e2e8f0;">
                      <div style="font-size:13px;color:#64748b;margin-bottom:4px;">Description</div>
                      <div style="font-size:14px;color:#334155;white-space:pre-wrap;">${safeDesc}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px 8px 24px;text-align:center;">
                <a href="${APP_WEB_URL}" target="_blank"
                   style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;
                          padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;">
                  View my tasks
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 24px 24px 24px;text-align:center;color:#64748b;font-size:12px;">
                If you didn’t create this task, you can safely ignore this email.
              </td>
            </tr>
          </table>

          <div style="margin-top:14px;color:#94a3b8;font-size:12px;">
            © ${new Date().getFullYear()} TaskFlo. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const sendMail = async (to, subject, title, description) => {
  try {
    const html = taskAddedTemplate(title, description);
    const text = `Task added successfully
Title: ${title}
Description: ${description}
Open: ${APP_WEB_URL}`;
    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("sendMail error:", err.message);
  }
};


export const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await userModel.findById(userId).select("email");
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTask = await taskModel.create({
      title,
      description,
      completed: false,
      userId,
    });

    void sendMail(user.email, "Task Added", title, description);

    return res
      .status(201)
      .json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeTask = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Task id is required" });

    const deleted = await taskModel.findOneAndDelete({
      _id: id,
      userId: req.user?.id,
    });
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = await taskModel.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
