require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const farmerRoutes = require('./routes/farmerRoutes');
const sellerRoutes = require('./routes/sellerRoute');
const landRoutes=require('./routes/landRoutes');
const airoute=require("./routes/airoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB Connection (✅ Fixed)
mongoose.connect(
    'mongodb+srv://indreshverma:indresh@cluster0.z4mrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/land',landRoutes);
app.use("/api/ai", airoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
