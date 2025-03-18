import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUpdateEventSpace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    useEffect(() => {
        const fetchEventSpace = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/event-spaces/${id}`);
                setEventData(res.data);
            } catch (error) {
                console.error("Error fetching event space", error);
            }
        };

        fetchEventSpace();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData({
            ...eventData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageUpload = async (event) => {
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
            await axios.put(`http://localhost:5000/api/event-spaces/update/${id}`, eventData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            alert("Event Space Updated Successfully!");
            navigate("/admin-panel"); // ✅ Redirects to Admin Panel
        } catch (error) {
            console.error("Error updating event space", error);
            alert("Failed to update event space. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Update Event Space (Admin)</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <h4>Basic Details</h4>
                <div className="mb-3">
                    <label className="form-label">Event Space Name:</label>
                    <input type="text" className="form-control" value={eventData.name} disabled />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">City:</label>
                        <input type="text" className="form-control" value={eventData.city} disabled />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Location:</label>
                        <input type="text" className="form-control" value={eventData.location} disabled />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Event Space Type:</label>
                    <input type="text" className="form-control" value={eventData.type} disabled />
                </div>

                <h4 className="mt-4">Update Images</h4>
                <div className="mb-3">
                    <input type="file" multiple accept="image/*" className="form-control" onChange={handleImageUpload} />
                    <p className="text-muted">Select up to 15 images from your device.</p>
                </div>
                <div className="mt-3 d-flex flex-wrap">
                    {eventData.images.map((image, index) => (
                        <img key={index} src={image} alt="Preview" className="m-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                    ))}
                </div>

                <h4 className="mt-4">Update Amenities</h4>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" name="acAvailable" checked={eventData.acAvailable} onChange={handleChange} />
                    <label className="form-check-label">AC Available</label>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" name="parkingAvailable" checked={eventData.parkingAvailable} onChange={handleChange} />
                    <label className="form-check-label">Parking Available</label>
                </div>

                <h4 className="mt-4">Update Pricing & Meals</h4>
                <div className="mb-3">
                    <label className="form-label">Price:</label>
                    <input type="number" className="form-control" name="price" value={eventData.price} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Meals Availability:</label>
                    <select name="meals" className="form-control" value={eventData.meals} onChange={handleChange} required>
                        <option value="">Select Meals Availability</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Both">Both</option>
                        <option value="Not Available">Not Available</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-success mt-3">Update Event Space</button>
            </form>
        </div>
    );
};

export default AdminUpdateEventSpace;
