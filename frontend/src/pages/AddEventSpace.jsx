import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddEventSpace.css";

const AddEventSpace = () => {
    const [eventData, setEventData] = useState({
        name: "",
        city: "",
        location: "",
        type: "",
        images: [],
        acAvailable: false,
        parkingAvailable: false,
        capacity: "",
        meals: "",
        address: "",
        price: ""
    });

    const navigate = useNavigate();

    const locationsByCity = {
        Vijayawada: ["Labbipet", "Patamata", "Gurunanak Colony"],
        Hyderabad: ["L.B.Nagar", "Jubilee Hills", "Banjara Hills"],
        Vizag: ["Bheemili", "Seethamadhara", "Rushikonda"],
      };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData({
            ...eventData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleCityChange = (e) => {
        setEventData({
            ...eventData,
            city: e.target.value,
            location: "",
        });
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newImages = [];
        for (let i = 0; i < files.length && i < 15; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onloadend = () => {
                newImages.push(reader.result);
                if (newImages.length === files.length || newImages.length === 15) {
                    setEventData((prev) => ({
                        ...prev,
                        images: [...prev.images, ...newImages].slice(0, 15)
                    }));
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://eventspaceproject.onrender.com/api/event-spaces/add", eventData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Event Space Added Successfully!");
            navigate("/my-event-spaces");
        } catch (error) {
            alert("Error adding event space");
            console.error("Error:", error);
        }
    };

    return (
        <div className="add-event-container">
            <div className="add-event-box">
                <h2 className="text-center">Add Event Space</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Event Space Name" className="form-control input-field" onChange={handleChange} required />
                    <select name="city" className="form-control input-field" onChange={handleCityChange} required>
                        <option value="">Select City</option>
                        {Object.keys(locationsByCity).map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <select name="location" className="form-control input-field" onChange={handleChange} value={eventData.location} required disabled={!eventData.city}>
                        <option value="">Select Location</option>
                        {eventData.city && locationsByCity[eventData.city].map((location) => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                    <select name="type" className="form-control input-field" onChange={handleChange} required>
                        <option value="">Select Type</option>
                        <option value="Banquet Hall">Banquet Hall</option>
                        <option value="Auditorium">Auditorium</option>
                        <option value="Open Garden">Open Garden</option>
                        <option value="Conference Room">Conference Room</option>
                    </select>
                    <div className="image-upload-box">
                        <label className="form-label"><strong>Upload Images (Max 15)</strong></label>
                        <input type="file" multiple accept="image/*" className="form-control" onChange={handleImageUpload} />
                    </div>
                    <div className="image-preview-box">
                        {eventData.images.map((image, index) => (
                            <img key={index} src={image} alt="Preview" className="image-preview" />
                        ))}
                    </div>
                    <input type="number" name="capacity" placeholder="Capacity" className="form-control input-field" onChange={handleChange} required />
                    <select name="meals" className="form-control input-field" onChange={handleChange} required>
                        <option value="">Select Meals Availability</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Both">Both</option>
                        <option value="Not Available">Not Available</option>
                    </select>
                    <input type="text" name="address" placeholder="Address" className="form-control input-field" onChange={handleChange} required />
                    <input type="number" name="price" placeholder="Price" className="form-control input-field" onChange={handleChange} required />
                    <div className="checkbox-group">
                        <input type="checkbox" name="acAvailable" onChange={handleChange} /> AC Available
                        <input type="checkbox" name="parkingAvailable" onChange={handleChange} className="ms-3" /> Parking Available
                    </div>
                    <button type="submit" className="btn btn-success submit-btn">Add Event Space</button>
                </form>
            </div>
        </div>
    );
};

export default AddEventSpace;