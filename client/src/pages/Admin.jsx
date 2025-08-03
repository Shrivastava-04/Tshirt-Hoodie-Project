// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext.jsx"; // Use AuthContext for role check
import Header from "@/components/Header"; // You might want a different, simpler Header for admin
import Footer from "@/components/Footer"; // Or no footer for admin

// Admin-specific UI components (create these files)
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import AddProductForm from "@/components/admin/AddProductForm";

import { Card, CardContent } from "@/components/ui/card"; // For placeholder UI
import { Button } from "@/components/ui/button";
import { Users, Package, PlusCircle, LayoutDashboard } from "lucide-react"; // Icons
import axios from "axios";

const AdminDashboard = () => {
  // const { user, isAuthenticated, loading } = useAuth();
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
  const [user, setUser] = useState(null); // Local state for user data
  const [loading, setLoading] = useState(true); // Local loading state
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard', 'users', 'products', 'addProduct'

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchUserProfile = async () => {
      // If userId is missing, assume not authenticated
      if (!userId) {
        console.warn(
          "Profile Page: No userId found in localStorage. Assuming not logged in."
        );
        setLoading(false);
        setIsUserAuthenticated(false);
        // Consider navigating to login immediately here if no userId
        // navigate('/login');
        return;
      }

      try {
        setLoading(true); // Set loading to true while fetching
        // This makes the GET request to your backend to fetch user details by ID
        const response = await axios.get(`${API_BASE_URL}/user/userById`, {
          params: { id: userId }, // Sending userId as a query parameter
        });

        // Check for response data and user object within it
        if (response.data && response.data.user) {
          setUser(response.data.user);
          console.log(response.data.user);
          setIsUserAuthenticated(true);
        } else {
          // If API returns 200 but no user data (e.g., user deleted from DB)
          console.warn(
            "Profile Page: User data not found in API response, even with 200 OK."
          );
          setUser(null);
          setIsUserAuthenticated(false);
          // Also clear localStorage userId if it's invalid/user not found
          localStorage.removeItem("userId");
        }
      } catch (error) {
        console.error(
          "Profile Page: Error fetching user profile:",
          error.response?.status,
          error.response?.data?.message || error.message
        );
        setUser(null);
        setIsUserAuthenticated(false);
        // Clear userId in localStorage on API fetch error (e.g., 404, 500)
        localStorage.removeItem("userId");
        // Optionally show a toast message here for the error
      } finally {
        setLoading(false); // Always set loading to false
      }
    };

    fetchUserProfile(); // Call the function to fetch user profile
  }, [API_BASE_URL, userId, navigate]); // Dependencies for useEffect (include navigate if used in callback)

  // --- Authorization Guard ---
  useEffect(() => {
    if (!loading) {
      // Once auth status is known
      if (!isUserAuthenticated || user.role !== "admin") {
        alert("Access Denied: You must be an administrator to view this page.");
        navigate("/"); // Redirect non-admins to home page
      }
    }
  }, [isUserAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  // If not authenticated or not admin, show access denied (redirect handled by useEffect)
  if (!isUserAuthenticated || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-destructive text-xl">
          Access Denied: You are not authorized to view this page.
        </p>
      </div>
    );
  }

  // --- Admin Dashboard Layout ---
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:ml-64">
        {" "}
        {/* md:ml-64 to account for sidebar width */}
        <h1 className="text-4xl font-bold gradient-text mb-8">
          Admin Dashboard
        </h1>
        {activeTab === "dashboard" && (
          <Card className="bg-card/50 border-border/50 p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user.name}!
            </h2>
            <p className="text-foreground/70">
              Manage your website's users and products from here.
            </p>
          </Card>
        )}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "addProduct" && <AddProductForm />}
        {/* You might want a different footer or no footer for the admin dashboard */}
        {/* <Footer /> */}
      </main>
    </div>
  );
};

export default AdminDashboard;
