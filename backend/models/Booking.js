const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    eventSpaceId: { type: mongoose.Schema.Types.ObjectId, ref: "EventSpace", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Store Event Space Owner's ID
    date: { type: String, required: true },
    meal: { type: String, required: true },
    timeSlot: { type: String, required: true },
    people: { type: Number, required: true },
    status: { type: String, default: "Confirmed" }
});

module.exports = mongoose.model("Booking", BookingSchema);
