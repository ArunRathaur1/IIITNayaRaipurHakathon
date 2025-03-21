const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const Farmer = require("../models/Farmer"); // Adjust path based on your folder structure

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arunrathaur92.6@gmail.com", // Replace with your email
    pass: "hwpt wphl xheb ezva", // Replace with your email password or app password
  },
});

// Send Email Route
router.post("/send_email", async (req, res) => {
  try {
    const { farmerId } = req.body;

    // Fetch Farmer Details
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, error: "Farmer not found" });
    }

    // Construct Email Content
    const emailBody = `
      <h2>Crop Information for ${farmer.name}</h2>
      <p><strong>Area:</strong> ${farmer.area}</p>
      <p><strong>Land Area:</strong> ${farmer.landArea} acres</p>
      <p><strong>Phone:</strong> ${farmer.phone}</p>
      <p><strong>Email:</strong> ${farmer.email}</p>
      <p><strong>Selected Crop:</strong> ${farmer.selectedCrop}</p>
      <h3>Crop Data:</h3>
      <pre>${JSON.stringify(farmer.cropData, null, 2)}</pre>
    `;

    // Send Email
    const mailOptions = {
      from: "arunrathaur92.6@gmail.com",
      to: farmer.email, // Sending email to the farmer
      subject: `Crop Information for ${farmer.selectedCrop}`, // ✅ FIXED LINE
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

module.exports = router;