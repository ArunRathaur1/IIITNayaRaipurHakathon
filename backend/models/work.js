const mongoose = require("mongoose");

const workListingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    payment: Number,
    location: [String],
    duration: String,
    category: String,
    requirements: String,
    contactInfo: String,
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt
);

module.exports = mongoose.model("WorkListing", workListingSchema);
