const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  landArea: { type: Number, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, match: /\S+@\S+\.\S+/ }, // Email validation
  selectedCrop: { type: String, default: null },
  cropData: { type: Object, default: null }, // Stores crop information
  date: { type: Date, default: Date.now }, // Automatically sets the current date
});

module.exports = mongoose.model("Farmer", farmerSchema);
