import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(userData.name, userData.email, userData.password, userData.role, navigate);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" className="form-control mt-2 input-field" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" className="form-control mt-2 input-field" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" className="form-control mt-2 input-field" onChange={handleChange} required />
                    <select name="role" className="form-control mt-2 input-field" onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="owner">Event Space Owner</option>
                    </select>
                    <button type="submit" className="btn btn-success mt-3 register-btn">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;