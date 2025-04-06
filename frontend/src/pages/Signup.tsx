import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true); // Start loading state

    try {
      const res = await fetch("http://localhost:8000/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("email", email);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/verify-otp");
        }, 2000); // Simulate wait time for UX
      } else {
        setIsLoading(false);
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <style>
        {`
          @keyframes slideUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-slide-up {
            animation: slideUp 0.5s ease-out forwards;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:shadow-xl animate-slide-up"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center animate-slide-up">{error}</p>
        )}

        {isLoading ? (
          <div className="mt-6 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm mt-2 text-center">
              Sending OTP to your email... Please check your inbox!
            </p>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Sign Up
          </button>
        )}
      </form>
    </div>
  );
};

export default Signup;