import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  UserIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock images (ensure these paths are correct in your assets folder)
import hoodieImage from "@/assets/hoodie-1.jpg";
import tshirtImage from "@/assets/tshirt-1.jpg";
import axios from "axios";

const Cart = () => {
  const [user, setUser] = useState(null); // Local state for user data
  const [loading, setLoading] = useState(true); // Local loading state
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false); // Local authentication status
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  // Get userId from localStorage (as per your current preference)
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Get API base URL

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

  // Mock cart data. In a real app, this would come from a global state (Context/Redux)
  // or fetched from a backend after a user logs in.
  const [cartItems, setCartItems] = useState([
    {
      id: "prod1",
      name: "Urban Essential Hoodie",
      price: 89,
      image: hoodieImage,
      quantity: 1,
    },
    {
      id: "prod2",
      name: "Street Culture Tee",
      price: 45,
      image: tshirtImage,
      quantity: 2,
    },
    {
      id: "prod3",
      name: "Midnight Black Hoodie",
      price: 95,
      image: hoodieImage,
      quantity: 1,
    },
  ]);

  // Calculate total sum of items in the cart
  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Handle quantity change
  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Quantity cannot go below 1
          : item
      )
    );
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Handle checkout/payment
  const handleMakePayment = () => {
    // In a real application, you would integrate with a payment gateway here.
    // For now, it's just a placeholder.
    alert("Proceeding to payment for $" + totalAmount.toFixed(2));
    // navigate('/checkout'); // Example: navigate to a checkout page
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen w-full flex-col">
          <p className="text-foreground/70 text-lg">Loading user Cart...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!isUserAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen w-full flex-col text-center p-4">
          <UserIcon className="h-16 w-16 text-destructive mb-4" />
          <p className="text-destructive text-lg font-semibold mb-6">
            You need to be logged in to view this page.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="mt-4"
            variant="cta"
            size="lg"
          >
            Go to Login
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-card/50 border border-border/50 rounded-lg shadow-lg">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground/70 text-lg mb-6">
              Your cart is empty. Start shopping now!
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link to="/explore">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="flex items-center p-4 bg-card/50 border-border/50 shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mr-4 border border-border/50"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 items-center">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-accent font-bold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-start md:justify-end gap-3">
                      <div className="flex items-center border border-border/50 rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="text" // Use text type to avoid number input issues with leading zeros, etc.
                          value={item.quantity}
                          readOnly // Make it read-only as quantity is controlled by buttons
                          className="w-12 text-center bg-transparent border-y-0 border-x border-border/50 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="bg-card/50 border-border/50 shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border/50 pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">${totalAmount.toFixed(2)}</span>
                </div>
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full"
                  onClick={handleMakePayment}
                >
                  Make Payment
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/explore">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
