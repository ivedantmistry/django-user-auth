import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Otp from "./pages/VerifyOTP";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      const publicRoutes = ["/login", "/signup", "/verify-otp"];

      // Skip auth check for public routes
      if (publicRoutes.includes(location.pathname)) {
        return;
      }

      if (!token) {
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/profile/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setIsAuthenticated(true);
          // Only redirect to /profile/ if not already on a valid route
          if (location.pathname === "/") {
            navigate("/profile");
          }
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, location.pathname]); // Re-run on route change

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;