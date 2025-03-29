const mongoose = require("mongoose");

const workListingSchema = new mongoose.Schema(
  {
    id: { type: String }, // Unique identifier for the work listing
    title: { type: String,  }, // Title of the work
    description: { type: String,  }, // Description of the work
    payment: { type: Number,  }, // Payment for the work
    location: { type: [String],  }, // List of locations where work is available
    duration: { type: String,  }, // Duration of the work
    category: { type: String,  }, // Category of the work
    requirements: { type: String,  }, // Requirements for the job
    contactInfo: { type: String,  }, // Contact information for the work listing
    createdAt: { type: String,  }, // Creation date of the listing
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("WorkListing", workListingSchema);
