import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./MyBookings.css";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                let res;
                if (user.role === "owner") {
                    res = await axios.get("http://localhost:5000/api/bookings/owner", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                } else {
                    res = await axios.get("http://localhost:5000/api/bookings/user", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                }
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            }
        };

        fetchBookings();
    }, [user.role]);

    const handleCancel = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await axios.delete(`http://localhost:5000/api/bookings/delete/${bookingId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setBookings(bookings.filter(booking => booking._id !== bookingId));
                alert("Booking canceled successfully!");
            } catch (error) {
                console.error("Error canceling booking", error);
                alert("Failed to cancel booking. Please try again.");
            }
        }
    };

    return (
        <div className="my-bookings-container">
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
                                    {user.role === "user" && (
                                        <button 
                                            className="btn btn-danger cancel-btn" 
                                            onClick={() => handleCancel(booking._id)}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBookings;