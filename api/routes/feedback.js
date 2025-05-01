const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    // Ensure user is authenticated and has email
    if (!req.user || !req.user.user || !req.user.user.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { feedback } = req.body;
    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required." });
    }

    const userEmail = req.user.user.email;
    const userName = req.user.user.firstName
      ? `${req.user.user.firstName} ${req.user.user.lastName || ""}`.trim()
      : userEmail;

    // Setup nodemailer transporter (use Gmail App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FEEDBACK_MAIL_USER, // cses.dev@gmail.com
        pass: process.env.FEEDBACK_MAIL_PASS  // Gmail App Password
      }
    });

    // Send mail to admin (yourself)
    const adminMail = await transporter.sendMail({
      from: `"interNito Feedback" <${process.env.FEEDBACK_MAIL_USER}>`,
      to: "cses.dev@gmail.com",
      subject: `New Feedback from ${userName}`,
      replyTo: userEmail, // This is important!
      html: `
        <p><strong>From:</strong> ${userName} (${userEmail})</p>
        <p><strong>Feedback:</strong></p>
        <blockquote style="border-left:2px solid #76b852;padding-left:8px;margin:8px 0;color:#333;">${feedback}</blockquote>
        <p>Replying to this email will send your response directly to the user.</p>
      `
    });

    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ message: "Failed to send feedback." });
  }
});

module.exports = router;