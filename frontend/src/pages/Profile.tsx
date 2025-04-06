import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
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
          const data: UserProfile = await response.json();
          setUser(data);
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Profile</h2>
        {message && <p className="text-center text-blue-600">{message}</p>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={user.first_name}
            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            className="w-full px-4 py-2 border rounded-xl"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={user.last_name}
            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            className="w-full px-4 py-2 border rounded-xl"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={user.phone_number}
            onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
            className="w-full px-4 py-2 border rounded-xl"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;