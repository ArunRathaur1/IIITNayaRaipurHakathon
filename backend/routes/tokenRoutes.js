const express = require("express");
const Token = require("../models/Token"); // Import the Token model

const router = express.Router();

// ✅ Route 1: Farmer submits details (without Status & Alloteddate)
router.post("/", async (req, res) => {
  try {
    const { name, contact, landArea, email, Crop } = req.body;

    if (!name || !contact || !landArea || !email) {
      return res.status(400).json({ error: "All fields except Crop are required" });
    }

    const newToken = new Token({
      name,
      contact,
      landArea,
      email,
      Crop: Crop || null, // Default to null if not provided
    });

    await newToken.save();
    res.status(201).json({ message: "Token created successfully", token: newToken });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Route 2: Update status and allotted date for a specific farmer
// router.put("/:id", async (req, res) => {
//   try {
//     const { status, allottedDate } = req.body;

//     if (!status) {
//       return res.status(400).json({ error: "Status is hrjj required" });
//     }

//     const updatedToken = await Token.findByIdAndUpdate(
//       req.params.id,
//       { Status: status, Alloteddate: allottedDate || Date.now() },
//       { new: true }
//     );

//     if (!updatedToken) {
//       return res.status(404).json({ error: "Token not found" });
//     }

//     res.json({ message: "Token updated successfully", token: updatedToken });
//   } catch (error) {
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });

router.put("/update", async (req, res) => {
    try {
      const { phone, allottedDate } = req.body;
  
      // Check if the contact exists
      const existingToken = await Token.findOne({ contact: phone });
  
      if (!existingToken) {
        return res.status(404).json({ message: "❌ Contact number not found!" });
      }
  
      // Update the token if found
      existingToken.Status = "Approved";
      existingToken.Alloteddate = allottedDate;
  
      await existingToken.save();
  
      res.status(200).json({ message: "✅ Token updated successfully!", updatedToken: existingToken });
    } catch (error) {
      res.status(500).json({ message: "❌ Error updating token", error });
    }
  });
  

// ✅ Route: Get status & allotted date by phone number
router.get("/status/:contact", async (req, res) => {
    try {
      const token = await Token.findOne({ contact: req.params.contact });
  
      if (!token) {
        return res.status(404).json({ error: "No record found for this phone number" });
      }
  
      res.json({ status: token.Status, allottedDate: token.Alloteddate });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });
  

module.exports = router;
