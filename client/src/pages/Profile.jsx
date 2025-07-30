import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthCotext.jsx"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isUserAuthenticated, loading, logout } = useAuth();
  const Navigate = useNavigate(); // Use useNavigate hook for navigation

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen w-full flex-col">
          <p>Loading user session...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!isUserAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen w-full flex-col text-destructive">
          <p>You need to be logged in to view this page.</p>
          <button onClick={() => Navigate("/login")} className="mt-4">
            Go to Login
          </button>
        </div>
        <Footer />
      </>
    );
  }
  const handleLogout = async () => {
    await logout(); // Call the logout function from useAuth
    Navigate("/"); // Redirect to login after logout
  };
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
            <button onClick={handleLogout}>Logout</button>
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
