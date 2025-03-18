const express = require("express");
const { verifyAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController"); // ✅ Correct Import

const router = express.Router();

// ✅ Ensure Functions Exist
router.get("/bookings/all", verifyAdmin, adminController.getAllBookings);
router.delete("/bookings/:id", verifyAdmin, adminController.cancelBooking);
router.get("/event-spaces/all", verifyAdmin, adminController.getAllEventSpaces);
router.put("/event-spaces/update/:id", verifyAdmin, adminController.updateEventSpace);

module.exports = router;
