const express = require('express');
const Farmer = require('../models/Farmer');
const axios = require('axios'); // Import axios
const router = express.Router();
const bycrypt = require("bcryptjs");
const jsonweb = require("jsonwebtoken");
const serect_data = "This is very confidential";

// ✅ Create a new farmer

router.post("/", async (req, res) => {
  try {
    const {
      name,
      password,
      area,
      landArea,
      phone,
      email,
      selectedCrop = null,
    } = req.body;

    // Validation check
    if (!name || !area || !landArea || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required (name, area, landArea, phone, email, password)",
      });
    }

    // Check if farmer with this email or phone already exists
    const existingFarmer = await Farmer.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: "A farmer with this email or phone number already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bycrypt.hash(password, 10);

    let cropData = null;

    // Fetch crop data if selectedCrop is provided
    if (selectedCrop) {
      try {
        const response = await axios.post(
          "https://iiitnayaraipurhakathon.onrender.com/api/ai/crop_data",
          {
            crop: selectedCrop,
          }
        );

        if (response.data.success) {
          cropData = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching crop data:", error.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch crop data",
          error: error.message,
        });
      }
    }

    // Create new farmer with hashed password
    const newFarmer = new Farmer({
      name,
      password: hashedPassword, // Store hashed password instead of plain text
      area,
      landArea,
      phone,
      email,
      selectedCrop,
      cropData,
    });

    await newFarmer.save();

    // Generate JWT token
    const token = jsonweb.sign(
      { id: newFarmer._id },
      serect_data,
      { expiresIn: "30d" } // Token expires in 30 days
    );

    res.status(201).json({
      success: true,
      message: "Farmer registered successfully!",
      authToken: token,
      farmer: {
        _id: newFarmer._id,
        name: newFarmer.name,
        email: newFarmer.email,
        phone: newFarmer.phone,
        area: newFarmer.area,
        landArea: newFarmer.landArea,
        selectedCrop: newFarmer.selectedCrop,
        cropData:cropData
        // Not returning password hash for security
      },
    });
  } catch (error) {
    console.error("Error registering farmer:", error);
    res.status(500).json({
      success: false,
      message: "Error registering farmer",
      error: error.message,
    });
  }
});

// More secure POST login route
router.get('/phone/:phone', async (req, res) => {
    try {
        const farmer = await Farmer.findOne({ phone: req.params.phone });
        if (!farmer) return res.status(404).json({ message: "Farmer not found" });
        res.status(200).json(farmer);
    } catch (err) {
        res.status(500).json({ message: "Error fetching farmer details", error: err.message });
    }
  });

// ✅ Update selected crop for a farmer
router.post("/:id/crop", async (req, res) => {
  try {
    const { selectedCrop } = req.body;
    const { id } = req.params;

    if (!selectedCrop) {
      return res.status(400).json({ message: "Selected crop is required" });
    }

    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Fetch crop data for the updated selectedCrop
    let cropData = null;
    try {
      const response = await axios.post(
        "https://iiitnayaraipurhakathon.onrender.com/api/ai/crop_data",
        {
          crop: selectedCrop,
        }
      );

      if (response.data.success) {
        cropData = response.data.data;
      }
    } catch (error) {
      console.error("Error fetching crop data:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to fetch crop data", error: error.message });
    }

    // Update farmer details
    farmer.selectedCrop = selectedCrop;
    farmer.cropData = cropData; // Store the updated crop data
    farmer.date = new Date(); // Set update timestamp

    await farmer.save();

    res.status(200).json({ message: "Crop updated successfully", farmer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating crop", error: error.message });
  }
});




// ✅ Get all farmers
router.get('/', async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.status(200).json(farmers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching farmers', error: err.message });
    }
});

// ✅ Get a specific farmer by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const farmer = await Farmer.findById(id);

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        res.status(200).json(farmer);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching farmer details', error: error.message });
    }
});

// ✅ Update farmer details
router.put('/:id', async (req, res) => {
    try {
        const { name, area, landArea, phone, email, selectedCrop } = req.body;

        if (!name || !area || !landArea || !phone || !email) {
            return res.status(400).json({ message: 'All fields are required (name, area, landArea, phone, email)' });
        }

        const farmer = await Farmer.findByIdAndUpdate(req.params.id, { name, area, landArea, phone, email, selectedCrop }, { 
            new: true, 
            runValidators: true 
        });

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        res.status(200).json({ message: 'Farmer updated successfully!', farmer });

    } catch (err) {
        res.status(400).json({ message: 'Error updating farmer', error: err.message });
    }
});

// ✅ Delete a farmer
router.delete('/:id', async (req, res) => {
    try {
        const farmer = await Farmer.findByIdAndDelete(req.params.id);

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        res.status(200).json({ message: 'Farmer deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error deleting farmer', error: err.message });
    }
});



module.exports = router;
