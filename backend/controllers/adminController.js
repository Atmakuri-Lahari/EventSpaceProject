const Booking = require("../models/Booking");
const EventSpace = require("../models/EventSpace");

// ✅ Get All Bookings (Sorted by Latest)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("eventSpaceId")
            .populate("userId")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

// ✅ Cancel Booking
exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        await Booking.findByIdAndDelete(bookingId);
        res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ message: "Error canceling booking" });
    }
};

// ✅ Get All Event Spaces
exports.getAllEventSpaces = async (req, res) => {
    try {
        const spaces = await EventSpace.find().select("name city location type price images");
        res.status(200).json(spaces);
    } catch (error) {
        console.error("Error fetching event spaces:", error);
        res.status(500).json({ message: "Error fetching event spaces" });
    }
};


// ✅ Update Event Space
exports.updateEventSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedSpace = await EventSpace.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json(updatedSpace);
    } catch (error) {
        console.error("Error updating event space:", error);
        res.status(500).json({ message: "Error updating event space" });
    }
};
