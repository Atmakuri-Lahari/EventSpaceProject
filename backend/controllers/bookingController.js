const Booking = require("../models/Booking");
const EventSpace = require("../models/EventSpace");
const timeSlots = [
    "9:00 AM - 3:00 PM",
    "3:00 PM - 6:00 PM",
    "6:00 PM - 11:00 PM",
    "11:00 PM - 8:00 AM"
];

// ✅ Get Available Booking Dates & Time Slots
exports.getAvailableDatesAndSlots = async (req, res) => {
    try {
        const { eventSpaceId } = req.params;

        // ✅ Fetch all bookings for this event space
        const bookings = await Booking.find({ eventSpaceId });

        // ✅ Get fully booked dates
        const bookedSlots = {};
        const fullyBookedDates = new Set();

        // ✅ Iterate through bookings and track booked slots
        bookings.forEach((booking) => {
            if (!bookedSlots[booking.date]) {
                bookedSlots[booking.date] = [];
            }
            bookedSlots[booking.date].push(booking.timeSlot);

            // ✅ If all slots are booked for a date, disable that date
            if (bookedSlots[booking.date].length >= 4) {
                fullyBookedDates.add(booking.date);
            }
        });

        // ✅ Generate available dates
        const availableDates = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formattedDate = date.toISOString().split("T")[0];

            if (!fullyBookedDates.has(formattedDate)) {
                availableDates.push(formattedDate);
            }
        }

        // ✅ Define all time slots
        const allTimeSlots = [
            "9:00 AM - 3:00 PM",
            "3:00 PM - 6:00 PM",
            "6:00 PM - 11:00 PM",
            "11:00 PM - 8:00 AM"
        ];

        // ✅ Prepare available slots for each date
        const availableSlots = {};
        availableDates.forEach((date) => {
            availableSlots[date] = allTimeSlots.filter(slot => !bookedSlots[date]?.includes(slot));
        });

        res.json({ availableDates, availableSlots });
    } catch (error) {
        console.error("Error fetching available dates and slots", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Create a Booking
exports.createBooking = async (req, res) => {
    try {
        const { eventSpaceId, date, meal, timeSlot, people } = req.body;
        const userId = req.user.id; // Get logged-in user's ID

        console.log("Received Booking Request:", req.body); // ✅ Debug log

        // ✅ Validate request data
        if (!eventSpaceId || !date || !meal || !timeSlot || !people) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Find the event space
        const eventSpace = await EventSpace.findById(eventSpaceId);
        if (!eventSpace) {
            return res.status(404).json({ message: "Event Space not found" });
        }

        console.log("Event Space Found:", eventSpace.name); // ✅ Debug log

        // ✅ Ensure ownerId exists
        if (!eventSpace.ownerId) {
            return res.status(400).json({ message: "Event Space does not have an owner assigned." });
        }

        console.log("Owner ID Found:", eventSpace.ownerId); // ✅ Debug log

        // ✅ Save booking with event space and owner ID
        const newBooking = new Booking({
            eventSpaceId,
            userId,
            ownerId: eventSpace.ownerId,
            date,
            meal,
            timeSlot,
            people,
            status: "Confirmed" // Default status
        });

        await newBooking.save();
        console.log("Booking Saved Successfully!"); // ✅ Debug log

        res.status(201).json({ message: "Booking successful!", booking: newBooking });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};
// ✅ Cancel a Booking (Update Status)
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("Fetching bookings for User ID:", userId); // ✅ Debug log

        // ✅ Populate event space details when fetching bookings
        const bookings = await Booking.find({ userId })
            .populate("eventSpaceId", "name images city location type price")
            .sort({ date: 1 });

        console.log("User Bookings Found:", bookings.length); // ✅ Debug log

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// ✅ Allow users to cancel bookings
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        console.log("Canceling Booking ID:", bookingId); // ✅ Debug log

        // ✅ Find and update booking status
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "Canceled" },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        console.log("Booking Canceled Successfully"); // ✅ Debug log

        res.status(200).json({ message: "Booking canceled successfully", booking: updatedBooking });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


// Get Bookings for Event Owners
exports.getOwnerBookings = async (req, res) => {
    try {
        const ownerId = req.user.id; // Owner's ID from token

        console.log("Fetching bookings for Owner ID:", ownerId); // ✅ Debug log

        // ✅ Find all event spaces owned by the logged-in owner
        const ownerSpaces = await EventSpace.find({ ownerId }).select("_id");
        const spaceIds = ownerSpaces.map(space => space._id);

        // ✅ Find bookings for these event spaces
        const bookings = await Booking.find({ eventSpaceId: { $in: spaceIds } })
            .populate("eventSpaceId", "name images city location type price")
            .populate("userId", "name email") // ✅ Fetch user details who booked
            .sort({ date: 1 });

        console.log("Owner's Bookings Found:", bookings.length); // ✅ Debug log

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching owner bookings:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("eventSpace user");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update a Booking
exports.updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete a Booking
exports.deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
