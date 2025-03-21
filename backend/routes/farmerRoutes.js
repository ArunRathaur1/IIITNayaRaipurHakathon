const express = require('express');
const Farmer = require('../models/Farmer');
const axios = require('axios'); // Import axios
const router = express.Router();

// ✅ Create a new farmer
router.post("/", async (req, res) => {
  try {
    const {
      name,
      area,
      landArea,
      phone,
      email,
      selectedCrop = null,
    } = req.body;

    if (!name || !area || !landArea || !phone || !email) {
      return res
        .status(400)
        .json({
          message:
            "All fields are required (name, area, landArea, phone, email)",
        });
    }

    let cropData = null;

    // Fetch crop data if selectedCrop is provided
    if (selectedCrop) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/ai/crop_data",
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
    }

    const newFarmer = new Farmer({
      name,
      area,
      landArea,
      phone,
      email,
      selectedCrop,
      cropData,
    });
    await newFarmer.save();

    res
      .status(201)
      .json({ message: "Farmer added successfully!", farmer: newFarmer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding farmer", error: error.message });
  }
});

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
        "http://localhost:5000/api/ai/crop_data",
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
