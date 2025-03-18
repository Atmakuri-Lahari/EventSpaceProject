const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

// ✅ Fix Admin Verification to Use a Proper ObjectId
exports.verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // ✅ Ensure the user ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // ✅ Find the user in the database
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        console.error("Admin Verification Error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
