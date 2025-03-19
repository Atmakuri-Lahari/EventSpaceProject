import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MyEventSpaces.css";

const MyEventSpaces = () => {
    const [eventSpaces, setEventSpaces] = useState([]);

    useEffect(() => {
        const fetchEventSpaces = async () => {
            try {
                const res = await axios.get("https://eventspaceproject.onrender.com/api/event-spaces/my-event-spaces", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setEventSpaces(res.data);
            } catch (error) {
                console.error("Error fetching event spaces", error);
            }
        };

        fetchEventSpaces();
    }, []);

    return (
        <div className="my-event-container">
            <h2 className="text-center">My Event Spaces</h2>
            {eventSpaces.length === 0 ? (
                <p className="text-center">No event spaces found.</p>
            ) : (
                <div className="row">
                    {eventSpaces.map((space) => (
                        <div className="col-md-4 mt-3" key={space._id}>
                            <div className="card event-card">
                                <img src={space.images[0]} className="card-img-top event-img" alt={space.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{space.name}</h5>
                                    <p className="event-details">{space.city}, {space.location}</p>
                                    <p className="event-details">Type: {space.type}</p>
                                    <p className="event-details">Capacity: {space.capacity}</p>
                                    <p className="event-price">Price: ₹{space.price}</p>
                                    
                                    <Link to={`/update-event-space/${space._id}`} className="btn btn-warning update-btn">
                                        Update
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEventSpaces;