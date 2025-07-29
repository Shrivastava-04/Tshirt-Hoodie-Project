import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const userId = localStorage.getItem("userId").replace(/"/g, "");
  //   console.log(userId);
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/userById?id=${userId}`
        );
        if (response.status !== 200) {
          console.log(response);
          throw new Error("Failed to fetch user profile");
        }
        console.log(response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, []);
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen w-full flex-col">
        <h1>Profile Page</h1>
        <p>Welcome to your profile!</p>
        {user ? (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phoneNumber}</p>
            <button
              onClick={() => {
                localStorage.removeItem("userId");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading user profile...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
