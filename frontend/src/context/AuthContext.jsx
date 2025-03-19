import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const register = async (name, email, password, role, navigate) => {
        try {
            const res = await axios.post("https://eventspaceproject.onrender.com/api/auth/register", { name, email, password, role });

            if (res.data && res.data.user && res.data.token) {
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);

                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

                alert("Registration Successful! You are now logged in.");
                if (navigate) navigate("/");
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Registration Failed");
        }
    };

// ✅ Prevents duplicate calls

    const [loading, setLoading] = useState(false); // ✅ Prevent duplicate calls

    const login = async (email, password, navigate) => {
        if (loading) return; // ✅ Prevent multiple calls
        setLoading(true);  // ✅ Set loading state
    
        try {
            console.log("⏳ Attempting login..."); // ✅ Debug log before API call
    
            const res = await axios.post('https://eventspaceproject.onrender.com/api/auth/login', { email, password });
    
            console.log("✅ Login API Response:", res.data); // ✅ Debug API response
    
            if (res.data && res.data.user && res.data.token) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('token', res.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
                alert("Login Successful!");  
                navigate("/");  // ✅ Redirect after login
    
                // ✅ Delay reload to ensure user state is updated properly
                setTimeout(() => {
                    window.location.reload(); // ✅ Force reload to update `AuthContext`
                }, 500);
    
            } else {
                throw new Error("Invalid response from server");
            }
    
        } catch (error) {
            console.error("❌ Login Error:", error.response?.data || error.message); // ✅ Debug error response
            alert(error.response?.data?.message || "Login Failed");
    
        } finally {
            setLoading(false);  // ✅ Reset loading state after request
        }
    };
    
    
    
    

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = "/";  // ✅ Redirect user after logout
    };
    

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
