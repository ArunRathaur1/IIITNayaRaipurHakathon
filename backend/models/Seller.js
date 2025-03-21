const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
    {
        sellerName: { type: String, required: true }, // Name of the seller
        location: { type: String, required: true },  // Seller's location
        contact: { type: String, default: null }, // Contact number (Can be null)
        itemName: { type: String, required: true }, // Name of the item being sold
        quantity: { type: Number, required: true }, // Quantity available
        type: {
            type: String,
            enum: ["Consumer Market", "Industry Supply", "Equipment Rental"], // Seller category
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Seller', sellerSchema);
