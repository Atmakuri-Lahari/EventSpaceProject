import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import MyEventSpaces from "./pages/MyEventSpaces";
import AddEventSpace from "./pages/AddEventSpace";
import EditEventSpace from "./pages/EditEventSpace";
import EventSpaces from "./pages/EventSpaces";
import EventSpaceDetails from "./pages/EventSpaceDetails";
import OwnerBookings from "./pages/OwnerBookings"; // ✅ Import OwnerBookings page
import UpdateEventSpace from "./pages/UpdateEventSpace"; // ✅ Import Update Event Space page
import AuthProvider from "./context/AuthContext";
import AdminPanel from "./pages/AdminPanel";
import AdminUpdateEventSpace from "./pages/AdminUpdateEventSpace";
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/my-event-spaces" element={<MyEventSpaces />} />
                        <Route path="/add-event-space" element={<AddEventSpace />} />
                        <Route path="/edit-event-space/:id" element={<EditEventSpace />} />
                        <Route path="/event-spaces" element={<EventSpaces />} />
                        <Route path="/event-space/:id" element={<EventSpaceDetails />} />
                        <Route path="/owner-bookings" element={<OwnerBookings />} /> {/* ✅ Owner's Bookings */}
                        <Route path="/update-event-space/:id" element={<UpdateEventSpace />} /> 
                        <Route path="/admin-panel" element={<AdminPanel />} />
<Route path="/admin/edit-event-space/:id" element={<AdminUpdateEventSpace />} />
{/* ✅ Update Event Space */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
