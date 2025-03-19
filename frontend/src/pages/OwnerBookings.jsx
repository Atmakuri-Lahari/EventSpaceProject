import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./OwnerBookings.css";

const OwnerBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;

            try {
                let res;
                if (user.role === "owner") {
                    res = await axios.get("https://eventspaceproject.onrender.com/api/bookings/owner", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                } else if (user.role === "admin") {
                    res = await axios.get("https://eventspaceproject.onrender.com/api/bookings/all", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                } else {
                    res = await axios.get("https://eventspaceproject.onrender.com/api/bookings/user", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                }

                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            }
        };

        fetchBookings();
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="owner-bookings-container">
            <h2 className="text-center">My Bookings</h2>
            <div className="row">
                {bookings.length === 0 ? (
                    <p className="text-center">No bookings found.</p>
                ) : (
                    bookings.map((booking) => (
                        <div className="col-md-4 mt-3" key={booking._id}>
                            <div className="card booking-card">
                                <img src={booking.eventSpaceId?.images[0]} className="card-img-top booking-img" alt={booking.eventSpaceId?.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{booking.eventSpaceId?.name}</h5>
                                    <p className="booking-details">Date: {booking.date}</p>
                                    <p className="booking-details">Time Slot: {booking.timeSlot}</p>
                                    <p className="booking-details">Meals: {booking.meal}</p>
                                    <p className="booking-details">People: {booking.people}</p>
                                    <p className="booking-status">Status: <strong>{booking.status}</strong></p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OwnerBookings;
