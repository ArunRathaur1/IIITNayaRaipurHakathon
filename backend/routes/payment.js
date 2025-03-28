require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: 100 * 100, // Amount in paisa (100 INR)
            currency: "INR",
            receipt: `receipt_${Math.random() * 1000}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify payment
router.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    let hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    let generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        res.status(200).json({ message: "Payment successful", status: true });
    } else {
        res.status(400).json({ message: "Payment verification failed", status: false });
    }
});

module.exports = router;
