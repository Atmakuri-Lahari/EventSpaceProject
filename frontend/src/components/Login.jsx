import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password, navigate);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" className="form-control mt-2 input-field" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="form-control mt-2 input-field" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn btn-primary mt-3 login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
