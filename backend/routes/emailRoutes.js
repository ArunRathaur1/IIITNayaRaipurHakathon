const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const Farmer = require("../models/Farmer"); // Adjust path based on your folder structure

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arunrathaur92.6@gmail.com", // Replace with your email
    pass: "hwpt wphl xheb ezva", // Replace with your email password or app password
  },
});

// Send Email Route
router.post("/send_email", async (req, res) => {
  try {
    const { farmerId } = req.body;
    
    // Fetch Farmer Details
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, error: "Farmer not found" });
    }
    
    // Function to format nested objects and arrays properly
    const formatNestedData = (data) => {
      if (!data) return '';
      
      if (Array.isArray(data)) {
        // If it's an array of objects, create a list for each object
        if (typeof data[0] === 'object' && data[0] !== null) {
          return data.map((item, index) => {
            const itemDetails = Object.entries(item)
              .map(([key, val]) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                  
                // Handle nested values
                let formattedVal = val;
                if (typeof val === 'object' && val !== null) {
                  formattedVal = formatNestedData(val);
                }
                
                return `<strong>${formattedKey}:</strong> ${formattedVal}`;
              }).join(', ');
              
            return `<li><strong>Item ${index + 1}:</strong> ${itemDetails}</li>`;
          }).join('');
        }
        // Simple array
        return data.join(', ');
      }
      
      // Simple object
      if (typeof data === 'object' && data !== null) {
        return Object.entries(data)
          .map(([k, v]) => {
            const formattedKey = k
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
              
            // Handle nested values
            let formattedVal = v;
            if (typeof v === 'object' && v !== null) {
              formattedVal = formatNestedData(v);
            }
            
            return `<strong>${formattedKey}:</strong> ${formattedVal}`;
          }).join(', ');
      }
      
      return data;
    };
    
    // Format complex schedules
    const formatSchedule = (scheduleArray, title) => {
      if (!scheduleArray || !Array.isArray(scheduleArray) || scheduleArray.length === 0) {
        return '';
      }
      
      return `
        <h4>${title}:</h4>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <thead>
            <tr>
              ${Object.keys(scheduleArray[0]).map(key => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                return `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${formattedKey}</th>`;
              }).join('')}
            </tr>
          </thead>
          <tbody>
            ${scheduleArray.map(item => `
              <tr>
                ${Object.values(item).map(value => {
                  let displayValue = value;
                  if (typeof value === 'object' && value !== null) {
                    displayValue = formatNestedData(value);
                  }
                  return `<td style="border: 1px solid #ddd; padding: 8px;">${displayValue}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };
    
    // Construct Email Content with proper formatting for complex data
    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Crop Information for ${farmer.name}</h2>
        <p><strong>Area:</strong> ${farmer.area}</p>
        <p><strong>Land Area:</strong> ${farmer.landArea} acres</p>
        <p><strong>Phone:</strong> ${farmer.phone}</p>
        <p><strong>Email:</strong> ${farmer.email}</p>
        <p><strong>Selected Crop:</strong> ${farmer.selectedCrop}</p>
        
        <h3>Detailed Crop Information:</h3>
        
        ${farmer.cropData?.waterSchedule ? 
          formatSchedule(farmer.cropData.waterSchedule, 'Water Schedule') : ''}
          
        ${farmer.cropData?.fertilizerSchedule ? 
          formatSchedule(farmer.cropData.fertilizerSchedule, 'Fertilizer Schedule') : ''}
          
        ${farmer.cropData?.stages ? 
          formatSchedule(farmer.cropData.stages, 'Growth Stages') : ''}
        
        ${farmer.cropData && Object.entries(farmer.cropData)
          .filter(([key]) => !['waterSchedule', 'fertilizerSchedule', 'stages'].includes(key))
          .map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            let content = '';
            if (typeof value === 'object' && value !== null) {
              if (Array.isArray(value)) {
                content = `<ul>${formatNestedData(value)}</ul>`;
              } else {
                content = formatNestedData(value);
              }
            } else {
              content = value;
            }
            
            return `<p><strong>${formattedKey}:</strong> ${content}</p>`;
          }).join('')}
        
        <p>If you have any questions about this information, please contact us.</p>
        <p>Thank you for using our service!</p>
      </div>
    `;
    
    // Send Email
    const mailOptions = {
      from: "arunrathaur92.6@gmail.com",
      to: farmer.email,
      subject: `Crop Information for ${farmer.selectedCrop}`,
      html: emailBody,
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

module.exports = router;