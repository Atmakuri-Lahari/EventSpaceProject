import { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("https://eventspaceproject.onrender.com/api/bookings/admin", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="container mt-5">
            <h2>All Bookings (Admin Panel)</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking._id}>
                            {booking.date} | {booking.timeSlot} | {booking.meal} | {booking.people} People
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminBookings;
