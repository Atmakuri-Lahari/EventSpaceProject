const EventSpace = require('../models/EventSpace');

// Add Event Space
exports.addEventSpace = async (req, res) => {
    try {
        const { name, city, location, type, images, acAvailable, parkingAvailable, capacity, meals, address, price } = req.body;
        const ownerId = req.user.id; // ✅ Get the logged-in owner's ID

        // ✅ Validate request data
        if (!name || !city || !location || !type || !images || !capacity || !meals || !address || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Save event space with ownerId
        const newEventSpace = new EventSpace({
            name,
            city,
            location,
            type,
            images,
            acAvailable,
            parkingAvailable,
            capacity,
            meals,
            address,
            price,
            ownerId // ✅ Store ownerId in the database
        });

        await newEventSpace.save();
        res.status(201).json({ message: "Event Space added successfully!", eventSpace: newEventSpace });

    } catch (error) {
        console.error("Error adding event space", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


// Get All Event Spaces
exports.getMyEventSpaces = async (req, res) => {
    try {
        const ownerId = req.user.id; // ✅ Get logged-in owner's ID

        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized. Owner ID is missing." });
        }

        console.log("Fetching event spaces for owner:", ownerId); // ✅ Debug log

        const eventSpaces = await EventSpace.find({ ownerId });

        if (!eventSpaces.length) {
            return res.status(404).json({ message: "No event spaces found for this owner." });
        }

        res.json(eventSpaces);
    } catch (error) {
        console.error("Error fetching event spaces:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get Event Spaces of a Specific Owner
exports.getOwnerEventSpaces = async (req, res) => {
    try {
        const spaces = await EventSpace.find({ owner: req.user.id });
        res.json(spaces);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update Event Space
exports.updateEventSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedSpace = await EventSpace.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json(updatedSpace);
    } catch (error) {
        console.error("Error updating event space:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Delete Event Space
exports.deleteEventSpace = async (req, res) => {
    try {
        const space = await EventSpace.findById(req.params.id);
        if (!space || space.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        await space.deleteOne();
        res.json({ message: "Event Space Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
exports.getFilteredEventSpaces = async (req, res) => {
    try {
        const { city, location, type } = req.query;

        let filters = {};
        if (city) filters.city = city;
        if (location) filters.location = location;
        if (type) filters.type = type;

        const eventSpaces = await EventSpace.find(filters);
        res.json(eventSpaces);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
exports.getEventSpaceById = async (req, res) => {
    try {
        const eventSpace = await EventSpace.findById(req.params.id);
        if (!eventSpace) {
            return res.status(404).json({ message: "Event Space not found" });
        }
        res.json(eventSpace);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
exports.getAllEventSpaces = async (req, res) => {
    try {
        const eventSpaces = await EventSpace.find().sort({ createdAt: -1 }); // ✅ Sort by latest
        res.status(200).json(eventSpaces);
    } catch (error) {
        console.error("Error fetching event spaces:", error);
        res.status(500).json({ message: "Server error fetching event spaces" });
    }
};
