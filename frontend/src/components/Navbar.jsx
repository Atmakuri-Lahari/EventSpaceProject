import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";  // ✅ Add this at the top

const Navbar = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) return null;

    const { user, logout } = authContext;
    const navigate = useNavigate(); // ✅ Use navigate inside Navbar

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">EventSpace</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        {user ? (
                            <>
                                {user.role === "user" && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/my-bookings">My Bookings</Link>
                                    </li>
                                )}

                                {user.role === "owner" && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/owner-bookings">My Bookings</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/my-event-spaces">My Event Spaces</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/add-event-space">Add Event Space</Link>
                                        </li>
                                    </>
                                )}

                                {user.role === "admin" && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin-panel">Admin Panel</Link>
                                    </li>
                                )}

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                        Profile
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                                        <li><button className="dropdown-item text-danger" onClick={() => logout(navigate)}>Logout</button></li> {/* ✅ Pass navigate to logout */}
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
