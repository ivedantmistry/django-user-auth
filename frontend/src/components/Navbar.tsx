import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
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

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">MyApp</Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white mr-4 hover:underline">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4 hover:underline">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;