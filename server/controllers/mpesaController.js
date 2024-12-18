import axios from 'axios';
import db from '../models/db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const BASE_URL = "https://sandbox.safaricom.co.ke";

// Fetch OAuth Token
const getToken = async () => {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const { data } = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` },
    });
    return data.access_token;
};

// Initiate STK Push
const stkPush = async (req, res) => {
    const { phone, amount } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.error('Authorization header missing'); // Detailed error log
        return res.status(401).json({ error: "Authorization header missing. Please log in again." });
    }
    const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    let user_id;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Decode the token to get the user_id
        user_id = decodedToken.id;
        console.log('Decoded user_id:', user_id); // Debugging message
    } catch (err) {
        console.error('Token verification error:', err); // Detailed error log
        return res.status(401).json({ error: "Invalid token. Please log in again." });
    }

    if (!user_id) {
        console.error('User ID is empty'); // Detailed error log
        return res.status(400).json({ error: "User ID is empty. Please log in." });
    }

    const tokenMpesa = await getToken();
    const timestamp = new Date().toISOString().replace(/[-:TZ]/g, "").slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const request = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "Health-insurance-system",
        TransactionDesc: "Payment for health insurance subscription", 
    };

    try {
        const { data } = await axios.post(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, request, {
            headers: { Authorization: `Bearer ${tokenMpesa}` },
        });

        // Debugging message
        console.log('Payment Data:', { user_id, phone, amount, status: 'pending' });

        // Record payment details in the database
        db.query(
            "INSERT INTO payments (user_id, phone, amount, status) VALUES (?, ?, ?, ?)",
            [user_id, phone, amount, 'pending'],
            (err) => {
                if (err) {
                    console.error('Database insertion error:', err); // Detailed error log
                } else {
                    console.log("Payment recorded successfully");
                }
            }
        );

        res.status(200).json({ message: "STK Push initiated successfully", data });
    } catch (error) {
        console.error("STK Push Error:", error.response?.data || error.message); // Detailed error log
        res.status(500).json({ error: "Failed to initiate STK Push" });
    }
};

// Handle callback
const handleCallback = (req, res) => {
    const { Body } = req.body;
    const resultCode = Body.stkCallback.ResultCode;
    const resultDesc = Body.stkCallback.ResultDesc;

    if (resultCode === 0) {
        const { MerchantRequestID, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;
        const { Item: metadata } = CallbackMetadata || {};
        const phone = metadata?.find((item) => item.Name === "PhoneNumber")?.Value;

        if (phone) {
            // Update payment status to 'paid'
            db.query(
                "UPDATE payments SET status = ? WHERE phone = ? AND status = ?",
                ['paid', phone, 'pending'],
                (err) => {
                    if (err) {
                        console.error('Database update error:', err); // Detailed error log
                    } else {
                        console.log("Payment status updated to 'paid'");
                    }
                }
            );
        } else {
            console.error("Phone number not found in callback metadata");
        }
    } else {
        const { CallbackMetadata } = Body.stkCallback;
        const phone = CallbackMetadata?.Item?.find((item) => item.Name === "PhoneNumber")?.Value;

        if (phone) {
            // Update payment status to 'cancelled'
            db.query(
                "UPDATE payments SET status = ? WHERE phone = ? AND status = ?",
                ['cancelled', phone, 'pending'],
                (err) => {
                    if (err) {
                        console.error('Database update error:', err); // Detailed error log
                    } else {
                        console.log("Payment status updated to 'cancelled'");
                    }
                }
            );
        } else {
            console.error("Phone number not found in callback metadata");
        }
    }

    res.sendStatus(200);
};

// Fetch Payment History
const getPaymentHistory = (req, res) => {
    const { user_id } = req.params;

    db.query(
        "SELECT id, phone, amount, status, created_at FROM payments WHERE user_id = ?",
        [user_id],
        (err, results) => {
            if (err) {
                console.error('Database query error:', err); // Detailed error log
                res.status(500).json({ error: "Failed to fetch payment history" });
            } else {
                res.status(200).json(results);
            }
        }
    );
};

export { stkPush, handleCallback, getPaymentHistory };
