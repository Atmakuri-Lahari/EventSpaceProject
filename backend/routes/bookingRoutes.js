const express = require("express");
const {
    createBooking, getUserBookings, getOwnerBookings, getAllBookings, updateBooking, deleteBooking,cancelBooking,getAvailableDatesAndSlots
} = require("../controllers/bookingController");
const {authMiddleware} = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.get("/available-dates-slots/:eventSpaceId", getAvailableDatesAndSlots);
router.post("/create", authMiddleware, createBooking);
router.get("/owner", authMiddleware, getOwnerBookings);
router.get("/user", authMiddleware, getUserBookings);
router.put("/cancel/:bookingId", authMiddleware, cancelBooking);
router.get("/owner", authMiddleware, getOwnerBookings);
router.post("/add", authMiddleware, createBooking);
router.put("/update/:id", authMiddleware, updateBooking);
router.delete("/delete/:id", authMiddleware, deleteBooking);

module.exports = router;
