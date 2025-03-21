const express = require("express");
const router = express.Router();
const LandListing = require("../models/LandListing");

// Get all listings
router.get("/", async (req, res) => {
  try {
    const listings = await LandListing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new listing
router.post("/", async (req, res) => {
  try {
    const { title, description, price, area, location } = req.body;

    if (!title || !description || !price || !area || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newListing = new LandListing({
      title,
      description,
      price,
      area,
      location,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search listings
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let listings;

    // First try text search
    listings = await LandListing.find({ $text: { $search: q } });

    // If no results, try regex search on title and description
    if (listings.length === 0) {
      const regex = new RegExp(q, "i");
      listings = await LandListing.find({
        $or: [{ title: regex }, { description: regex }],
      });
    }

    res.json(listings);
  } catch (error) {
    console.error("Error searching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
