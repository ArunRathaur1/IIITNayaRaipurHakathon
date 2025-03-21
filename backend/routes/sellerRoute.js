const express = require("express");
const router = express.Router();
const Seller = require("../models/Seller");
// const Product = require("../models/Product"); // ✅ Import Product model

// ✅ Controller for fetching sellers by type
const fetchSellers = async (req, res) => {
  const { type } = req.params;

  try {
    const sellers = await Seller.find({ type });
    if (sellers.length === 0) {
      return res
        .status(404)
        .json({ message: "No sellers found for this type" });
    }
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers by type", error });
  }
};

// ✅ 1️⃣ Add a new seller
router.post("/sellers/add", async (req, res) => {
  try {
    const newSeller = new Seller(req.body);
    const savedSeller = await newSeller.save();
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ message: "Error adding seller", error });
  }
});

// ✅ 2️⃣ Get sellers by type using the fetchSellers controller
router.get("/sellers/type/:type", fetchSellers);

// ✅ 3️⃣ Get all sellers
router.get("/sellers/all", async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error });
  }
});

// ✅ 4️⃣ Get a single seller by ID
router.get("/sellers/:id", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller", error });
  }
});

// ✅ 5️⃣ Update a seller by ID
router.put("/sellers/update/:id", async (req, res) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSeller)
      return res.status(404).json({ message: "Seller not found" });
    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(400).json({ message: "Error updating seller", error });
  }
});

// ✅ 6️⃣ Delete a seller by ID
router.delete("/sellers/delete/:id", async (req, res) => {
  try {
    const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
    if (!deletedSeller)
      return res.status(404).json({ message: "Seller not found" });
    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting seller", error });
  }
});

// ✅ 7️⃣ Add a new product
router.post("/products/add", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error adding product", error });
  }
});

// ✅ 8️⃣ Get all products
router.get("/products/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

module.exports = router;
