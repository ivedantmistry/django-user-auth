import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    if (!email) {
      setError("No email found. Please sign up again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Email verified successfully. Redirecting...");
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.removeItem("email");
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setError(data.error || "Invalid OTP. Try again.");
      }
    } catch (err) {
      setError("An error occurred. Try again.");
      console.error("Verify OTP error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Verify Your Email</h2>
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;