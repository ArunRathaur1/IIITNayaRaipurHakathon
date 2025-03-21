const mongoose = require("mongoose");

const landListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  area: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: [Number], // [latitude, longitude]
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 2;
      },
      message:
        "Location must be an array with exactly 2 elements [latitude, longitude]",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for search
landListingSchema.index({ title: "text", description: "text" });

const LandListing = mongoose.model("LandListing", landListingSchema);

module.exports = LandListing;
