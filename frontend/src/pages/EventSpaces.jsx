import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventSpaces.css";

const EventSpaces = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [eventSpaces, setEventSpaces] = useState([]);

    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city");
    const locationValue = queryParams.get("location");
    const type = queryParams.get("type");

    useEffect(() => {
        const fetchEventSpaces = async () => {
            try {
                const res = await axios.get("https://eventspaceproject.onrender.com/api/event-spaces/filter", {
                    params: { city, location: locationValue, type },
                });
                setEventSpaces(res.data);
            } catch (error) {
                console.error("Error fetching event spaces", error);
            }
        };

        fetchEventSpaces();
    }, [city, locationValue, type]);

    return (
        <div className="event-spaces-container">
            <h2 className="text-center event-title">Filtered Event Spaces</h2>
            <div className="row justify-content-center">
                {eventSpaces.length === 0 ? (
                    <p className="text-center mt-3 event-no-result">No event spaces found.</p>
                ) : (
                    eventSpaces.map((space, index) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-3" key={index}>
                            <div className="card event-card">
                                <img src={space.images[0]} className="card-img-top event-img" alt={space.name} />
                                <div className="card-body">
                                    <h5 className="card-title event-name">{space.name}</h5>
                                    <p className="event-location">{space.city}, {space.location}</p>
                                    <p className="event-type">Type: {space.type}</p>
                                    <p className="event-capacity">Capacity: {space.capacity}</p>
                                    <p className="event-price">Price: <strong>₹{space.price}</strong></p>
                                    <button className="btn btn-outline-primary view-details-btn" onClick={() => navigate(`/event-space/${space._id}`)}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventSpaces;