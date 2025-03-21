const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyBdJucnG3ujeokv7OzyPT9pRkuSEzs4PQ0");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// POST endpoint for AI text generation
router.post("/chatboat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate AI response",
    });
  }
});
// POST endpoint for AI text generation
router.post("/estimate", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Data is required" });
    }

    // Constructing a prompt for AI
    const prompt = `
      Estimate yield and suggestions based on the following details.
      Return only valid JSON format without markdown or explanations.
      try to give each answer with just 30 words at max
      {
        "Estimated_yield": "{your_data}",
        "Water_required": "{your_data}",
        "Diseases": "{your_data}",
        "Fertilizer": "{your_data}",
        "Remark": "{your_data}",
        "Estimated_Sales":"Rupees {your_data_number}",
        "Estimated_cost":"Rupees {your_data_number}"
      }

      Crop Details:
      - Crop Type: ${data.cropType}
      - Land Area: ${data.landArea}
      - Water Availability: ${data.waterAvailability}
      - Soil Type: ${data.soilType}
      - Fertilizer Type: ${data.fertilizerType}
      - Expected Yield: ${data.expectedYield}
      - Additional Info: ${data.additionalInfo}
    `;

    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // **Step 1: Remove AI Markdown Formatting (```json ... ```)**
    response = response.replace(/```json|```/g, "").trim();

    // **Step 2: Parse AI Response into JSON**
    try {
      response = JSON.parse(response);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return res.status(500).json({
        success: false,
        error:
          "Failed to parse AI response into JSON. AI may have returned unexpected formatting.",
      });
    }

    // **Step 3: Send JSON Response**
    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate AI response",
    });
  }
});



module.exports = router;
