import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./AdminPanel.css";

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [eventSpaces, setEventSpaces] = useState([]);

    useEffect(() => {
        if (!user || user.role !== "admin") return;

        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem("token");

                const bookingsRes = await axios.get("http://localhost:5000/api/admin/bookings/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(bookingsRes.data);

                const eventSpacesRes = await axios.get("http://localhost:5000/api/admin/event-spaces/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEventSpaces(eventSpacesRes.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchAdminData();
    }, [user]);

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/bookings/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setBookings(bookings.filter((booking) => booking._id !== id));
        } catch (error) {
            console.error("Error canceling booking:", error);
        }
    };

    return (
        <div className="admin-container">
            <h2 className="text-center admin-title">Admin Panel</h2>

            {/* ✅ Bookings Table */}
            <h3 className="admin-section-title">All Bookings</h3>
            <table className="table table-striped admin-table">
                <thead>
                    <tr>
                        <th>Event Space</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 ? (
                        <tr><td colSpan="6" className="text-center">No bookings found.</td></tr>
                    ) : (
                        bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>{booking.eventSpaceId?.name}</td>
                                <td>{booking.date}</td>
                                <td>{booking.timeSlot}</td>
                                <td>{booking.userId?.email}</td>
                                <td>{booking.status}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm cancel-btn" onClick={() => handleCancelBooking(booking._id)}>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* ✅ Event Spaces as Cards */}
            <h3 className="admin-section-title">All Event Spaces</h3>
            {eventSpaces.length === 0 ? (
                <p className="text-center">No event spaces found.</p>
            ) : (
                <div className="row">
                    {eventSpaces.map((space) => (
                        <div className="col-md-4 mt-3" key={space._id}>
                            <div className="card admin-event-card">
                                <img src={space.images[0]} className="card-img-top admin-event-img" alt={space.name} />
                                <div className="card-body text-center">
                                    <h5 className="card-title">{space.name}</h5>
                                    <p className="admin-event-details">{space.city}, {space.location}</p>
                                    <p className="admin-event-details">Type: {space.type}</p>
                                    <p className="admin-event-price">Price: ₹{space.price}</p>
                                    <Link to={`/edit-event-space/${space._id}`} className="btn btn-warning update-btn">
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

export default AdminPanel;