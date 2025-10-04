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
      to: "ramasani2007@gmail.com",
      subject: `New Feedback from ${userName}`,
      replyTo: userEmail, // This is important!
      html: `
      <div style="font-family:'Poppins',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:32px 24px 24px 24px;border-radius:16px;box-shadow:0 2px 12px rgba(34,139,34,0.07);">
        <div style="text-align:center;margin-bottom:18px;">
          <img src="https://drive.usercontent.google.com/download?id=15i1bEJ-SXKmF4WwqDLo83Qot7rrzSRSA&export=view&authuser=0" alt="interNito Logo" style="width:70px;height:auto;margin-bottom:8px;display:inline-block;" />
        </div>
        <div style="text-align:center;margin-bottom:24px;">
          <h2 style="margin:0;font-size:1.5rem;color:#222;font-weight:600;letter-spacing:0.01em;">New Feedback Received</h2>
        </div>
        <div style="background:#fff;border-radius:12px;padding:20px 18px 14px 18px;border:1.5px solid #e0e0e0;">
          <p style="margin:0 0 8px 0;font-size:1.05rem;color:#333;">
            <strong>From:</strong> <span style="color:#76b852;">${userName}</span> (<a href="mailto:${userEmail}" style="color:#76b852;text-decoration:none;">${userEmail}</a>)
          </p>
          <p style="margin:0 0 8px 0;font-size:1.05rem;color:#333;"><strong>Feedback:</strong></p>
          <div style="border-left:4px solid #76b852;padding-left:14px;margin:8px 0 16px 0;color:#222;font-size:1.08rem;line-height:1.6;background:#f6fff4;border-radius:6px;">
            ${feedback}
          </div>
          <p style="font-size:0.97rem;color:#888;margin:0 0 4px 0;">
            <em>Replying to this email will send your response directly to the user.</em>
          </p>
        </div>
        <div style="margin-top:28px;text-align:center;font-size:0.95rem;color:#aaa;">
          <span>interNito Feedback System</span>
        </div>
      </div>
    `
    });
    

    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ message: "Failed to send feedback." });
  }
});

module.exports = router;