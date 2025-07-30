import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import axios from "axios";
// Corrected import path for AuthContext
// import { useAuth } from "@/context/AuthContext.jsx"; // <--- Corrected path
import { useAuth } from "@/context/AuthCotext.jsx"; // Import the useAuth hook

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  // Get the 'login' function from AuthContext to set user state after signup
  const { login } = useAuth(); // <--- Corrected: Using 'login'

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhoneNumber = (phoneNumber) => {
    // This regex is more lenient, allowing for digits, spaces, hyphens, parentheses, plus sign.
    // Adjust based on your required phone number format.
    const phoneRegex = /^[+]?[\s\d\-\(\)]{7,20}$/; // Example: +1 (123) 456-7890
    // If phone number is OPTIONAL in schema:
    if (phoneNumber.trim() === "") {
      return true; // Empty string is valid for an optional field
    }
    // If phone number is REQUIRED in schema:
    // return phoneRegex.test(phoneNumber); // Must match format if not empty

    // Current logic reflects your schema's `required: true` for phoneNumber
    return phoneRegex.test(phoneNumber); // If required, must validate
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "name") {
      if (value.trim() === "") {
        errorMessage = "Name is required.";
      }
    } else if (name === "email") {
      if (value.trim() === "") {
        errorMessage = "Email is required.";
      } else if (!validateEmail(value)) {
        errorMessage = "Please enter a valid email address.";
      }
    } else if (name === "password") {
      if (value.trim() === "") {
        errorMessage = "Password is required.";
      } else if (!validatePassword(value)) {
        errorMessage = "Password must be at least 8 characters long.";
      }
    } else if (name === "phoneNumber") {
      if (value.trim() === "") {
        errorMessage = "Phone number is required."; // Based on your schema's `required: true`
      } else if (!validatePhoneNumber(value)) {
        errorMessage = "Please enter a valid phone number.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading at the very beginning

    // --- Client-side Validation ---
    let newErrors = {};
    if (formData.name.trim() === "") newErrors.name = "Name is required.";
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    // Phone number validation for REQUIRED field
    if (formData.phoneNumber.trim() === "") {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }

    setErrors(newErrors); // Update state for inline error messages

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      setIsLoading(false); // Stop loading if validation fails
      let toastDescription = "";
      if (errorKeys.length === 1) {
        toastDescription = newErrors[errorKeys[0]];
      } else {
        toastDescription = (
          <div className="flex flex-col gap-1">
            <p>Please correct the following errors:</p>
            <ul className="list-disc pl-5">
              {Object.values(newErrors).map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      }
      toast({
        title: "Validation Error",
        description: toastDescription,
        variant: "destructive",
        duration: 5000,
      });
      return; // Stop form submission here if validation fails
    }

    // --- If client-side validation passes, attempt API call ---
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
        formData
      );

      console.log("Signup API Success Response:", response.data);

      if (response.data.user) {
        login(response.data.user); // <--- Use login from AuthContext
      }

      toast({
        title: "Success",
        description:
          response.data.message || "Account created successfully! Welcome.",
        variant: "success",
        duration: 3000,
      });

      // Navigate immediately after success toast
      navigate("/");
    } catch (error) {
      console.error("Signup API error:", error);

      let errorMessage = "An unexpected error occurred during signup.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage =
            error.response.data.message ||
            "Bad Request: Please check your input.";
        } else if (error.response.status === 409) {
          // Conflict: Email/phone already exists
          errorMessage =
            error.response.data.message ||
            "A user with that email or phone number already exists.";
        } else if (error.response.status === 500) {
          errorMessage =
            error.response.data.message ||
            "Server error: Please try again later.";
        } else {
          errorMessage = `Error: ${error.response.status} - ${
            error.response.data.message || "Unknown server response"
          }`;
        }
      } else if (error.request) {
        errorMessage =
          "Network Error: Could not connect to the server. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  // ... (rest of JSX, unchanged except placeholder/type for phoneNumber) ...
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-foreground/70 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Arrasté" className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl gradient-text">Welcome</CardTitle>
            <p className="text-foreground/70">Create a new Account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Enter your name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-secondary/50"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-secondary/50"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel" // Changed to type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required // Keep required if your schema still has it
                  className="bg-secondary/50"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="bg-secondary/50 pr-10"
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-foreground/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-foreground/50" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked })
                    }
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-foreground/50">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  {/* Google SVG */}
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  {/* Facebook SVG */}
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-foreground/70">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
