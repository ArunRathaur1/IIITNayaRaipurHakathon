const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  landArea: { type: Number, required: true },
  email: { type: String, required: true, match: /\S+@\S+\.\S+/ }, // Email validation
  Crop: { type: String, default: null },
  Status:{type:String,default:"Pending"},
  Alloteddate: { type: Date, default: null }, // Automatically sets the current date
});

module.exports = mongoose.model("Token", tokenSchema);
