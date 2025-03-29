const express = require("express");
const router = express.Router();
const WorkListing = require("../models/work");

// Create a new work listing
router.post("/", async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      payment,
      location,
      duration,
      category,
      requirements,
      contactInfo,
      createdAt,
    } = req.body;


    const newWorkListing = new WorkListing({
      id,
      title,
      description,
      payment,
      location,
      duration,
      category,
      requirements,
      contactInfo,
      createdAt,
    });

    const savedListing = await newWorkListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error("Error creating work listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all work listings sorted by creation date (latest first)
router.get("/", async (req, res) => {
  try {
    const listings = await WorkListing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error("Error fetching work listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
