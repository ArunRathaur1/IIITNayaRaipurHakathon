require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const farmerRoutes = require('./routes/farmerRoutes');
const sellerRoutes = require('./routes/sellerRoute');
const landRoutes=require('./routes/landRoutes');
const airoute=require("./routes/airoutes");
const paymentRoutes = require('./routes/payment');
const emailroute=require("./routes/emailRoutes");
const app = express();

const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB Connection (✅ Fixed)
mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/land',landRoutes);
app.use("/api/email", emailroute);
app.use("/api/ai", airoute);
app.use('/api/payment', paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
