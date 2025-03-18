import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Base API URL
const API_URL_AUTH = `${API_BASE_URL}/auth`;
const API_URL_EVENTSPACES = `${API_BASE_URL}/eventSpaces`;
const API_URL_BOOKINGS = `${API_BASE_URL}/bookings`;

// ✅ Axios Instance with Interceptor for Auth Header
const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Register User
export const registerUser = async (userData) => {
  return await API.post(`/auth/register`, userData);
};

// ✅ Login User
export const loginUser = async (userData) => {
  return await API.post(`/auth/login`, userData);
};

// ✅ Get All Event Spaces
export const getAllEventSpaces = async () => {
  return API.get(`/eventSpaces`);
};

// ✅ Get Event Space by ID (With Date Query for Available Slots)
export const getEventSpaceById = async (id, date) => {
  return API.get(`/eventSpaces/${id}`, { params: { date } });
};

// ✅ Book an Event Space
export const bookEventSpace = async (eventSpaceId, bookingDate, selectedSlot, selectedMeal, numPeople, userId) => {
  try {
    const response = await API.post(`/eventSpaces/${eventSpaceId}/book`, {
      bookingDate,
      selectedSlot,
      selectedMeal,
      numPeople,
      userId,
    });

    console.log("Booking API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Booking API Error:", error.response?.data || error.message);
    throw error.response?.data || { error: "Booking failed." };
  }
};

// ✅ Add Event Space (Multipart Form Data for Images)
export const addEventSpace = async (eventData) => {
  return API.post(`/eventSpaces/add`, eventData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ Get bookings for a user
export const getUserBookings = async (userId) => {
  return API.get(`/bookings/user/${userId}`);
};

// ✅ Get bookings for an owner's venues
export const getOwnerBookings = async (ownerId) => {
  return API.get(`/bookings/owner/${ownerId}`);
};

// ✅ Get all bookings (admin only)
export const getAllBookings = async () => {
  return API.get(`/bookings/all`);
};

// ✅ Create a new booking
export const createBooking = async (bookingData) => {
  return API.post(`/bookings`, bookingData);
};

// ✅ Get a specific booking
export const getBookingById = async (bookingId) => {
  return API.get(`/bookings/${bookingId}`);
};

// ✅ Update a booking
export const updateBooking = async (bookingId, updateData) => {
  return API.put(`/bookings/${bookingId}`, updateData);
};

// ✅ Cancel a booking
export const cancelBooking = async (bookingId, reason) => {
  return API.delete(`/bookings/${bookingId}`, { data: { reason } });
};

// ✅ Check venue availability for a specific date
export const checkVenueAvailability = async (venueId, date) => {
  return API.get(`/eventSpaces/${venueId}/availability`, { params: { date } });
};
