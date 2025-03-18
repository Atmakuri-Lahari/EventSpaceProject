const mongoose = require("mongoose");

const EventSpaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    images: { type: [String], required: true },
    acAvailable: { type: Boolean, required: true },
    parkingAvailable: { type: Boolean, required: true },
    capacity: { type: Number, required: true },
    meals: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // ✅ Ensure ownerId is required
});

module.exports = mongoose.model("EventSpace", EventSpaceSchema);
