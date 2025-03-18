import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import "./EventSpaceDetails.css"; // Add a separate CSS file for extra styling

const EventSpaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventSpace, setEventSpace] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableSlots, setAvailableSlots] = useState({});
    const [availableMeals, setAvailableMeals] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    const [bookingData, setBookingData] = useState({
        date: "",
        meal: "Not Required",  // ✅ Set "Not Required" as default
        timeSlot: "",
        people: "",
    });

    useEffect(() => {
        const fetchEventSpace = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/event-spaces/${id}`);
                setEventSpace(res.data);

                const dateRes = await axios.get(`http://localhost:5000/api/bookings/available-dates-slots/${id}`);
                setAvailableDates(dateRes.data.availableDates);
                setAvailableSlots(dateRes.data.availableSlots);

                // ✅ Include "Not Required" in meal options
                const meals = ["Not Required"];
                if (res.data.meals === "Veg") meals.push("Veg");
                if (res.data.meals === "Non-Veg") meals.push("Non-Veg");
                if (res.data.meals === "Both") meals.push("Veg", "Non-Veg", "Both");
                if (res.data.meals === "Not Available") meals.push("Not Available");
                setAvailableMeals(meals);
            } catch (error) {
                console.error("Error fetching event space", error);
            }
        };

        fetchEventSpace();
    }, [id]);

    const handleDateChange = (e) => {
        const selected = e.target.value;
        setSelectedDate(selected);
        setBookingData({ ...bookingData, date: selected, timeSlot: "" });
    };

    const handleBooking = async () => {
        if (!bookingData.date || !bookingData.timeSlot || !bookingData.people) {
            alert("Please fill in all required booking details.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/bookings/add", {
                eventSpaceId: id,
                ...bookingData
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            alert("Booking Successful!");
            navigate("/my-bookings");
        } catch (error) {
            console.error("Error booking event space", error);
            alert("Booking failed. Please try again.");
        }
    };

    if (!eventSpace) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="card event-details-card p-4 shadow-lg">
                <h2 className="text-center event-title mb-4">{eventSpace.name}</h2>

                <Carousel className="event-carousel">
                    {eventSpace.images.map((img, index) => (
                        <Carousel.Item key={index}>
                            <img className="d-block w-100 event-img" src={img} alt={`Image ${index + 1}`} />
                        </Carousel.Item>
                    ))}
                </Carousel>

                <div className="event-info mt-4">
                    <p><strong>City:</strong> {eventSpace.city}</p>
                    <p><strong>Location:</strong> {eventSpace.location}</p>
                    <p><strong>Type:</strong> {eventSpace.type}</p>
                    <p><strong>AC Available:</strong> {eventSpace.acAvailable ? "Yes" : "No"}</p>
                    <p><strong>Parking Available:</strong> {eventSpace.parkingAvailable ? "Yes" : "No"}</p>
                    <p><strong>Price:</strong> <span className="event-price">₹{eventSpace.price}</span></p>
                    <p><strong>Capacity:</strong> {eventSpace.capacity} people</p>
                </div>

                <h3 className="mt-4 text-center">Book This Event Space</h3>

                <div className="booking-form mt-3">
                    <select className="form-control" onChange={handleDateChange}>
                        <option value="">Select Available Date</option>
                        {availableDates.length > 0 ? (
                            availableDates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
                            ))
                        ) : (
                            <option disabled>No available dates</option>
                        )}
                    </select>

                    {/* ✅ Meal Selection with "Not Required" as Default */}
                    <select
                        className="form-control mt-2"
                        value={bookingData.meal}
                        onChange={(e) => setBookingData({ ...bookingData, meal: e.target.value })}
                    >
                        {availableMeals.length > 0 ? (
                            availableMeals.map((meal, index) => (
                                <option key={index} value={meal}>{meal}</option>
                            ))
                        ) : (
                            <option disabled>No meal options available</option>
                        )}
                    </select>

                    <select className="form-control mt-2" onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })} disabled={!selectedDate}>
                        <option value="">Select Time Slot</option>
                        {selectedDate && availableSlots[selectedDate]?.length > 0 ? (
                            availableSlots[selectedDate].map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                            ))
                        ) : (
                            <option disabled>No available slots</option>
                        )}
                    </select>

                    <input type="number" className="form-control mt-2" placeholder="Number of People" onChange={(e) => setBookingData({ ...bookingData, people: e.target.value })} />

                    <button className="btn btn-primary btn-lg mt-3 w-100" onClick={handleBooking}>Book Now</button>
                </div>
            </div>
        </div>
    );
};

export default EventSpaceDetails;
