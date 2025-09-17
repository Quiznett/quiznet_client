// Author: Nishtha
// Register.jsx - User registration with redirect and dark mode persistence

// Import required dependencies
import { Link, useNavigate } from "react-router-dom"; // For navigation and link redirection
import { useForm } from "react-hook-form";            // For form handling and validation
import axios from "axios";                            // For making HTTP requests to backend
import Header from "../components/Header";            // Reusable header component
import Footer from "../components/Footer";            // Reusable footer component
import { useState, useEffect } from "react";          // React state and lifecycle hooks

export default function Register() {
  const navigate = useNavigate(); // Hook for  navigation (redirects)

  // Dark mode state (loaded from localStorage if set previously)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  // Apply dark mode to <html> tag and save preference whenever darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Setup React Hook Form (validation + field registration)
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // State for backend validation errors (e.g., duplicate username/email)
  const [serverErrors, setServerErrors] = useState({});

  // Loading state (used to disable button + show spinner text)
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setLoading(true); // Disable button while request is in progress

      // Send registration data to Django API
      const res = await axios.post("http://127.0.0.1:8000/api/v1/auth/register/", {
        username: data.username,
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      });

      // If registration successful (status 201: created)
      if (res.status === 201) {
        // Save authentication token and username for session persistence
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("username", res.data.user.username);

        // Redirect to welcome page
        navigate("/welcome");
      }
    } catch (err) {
      // Log error for debugging
      console.error("Register Error:", err.response?.data || err.message);

      // Display validation errors from backend or fallback error
      setServerErrors(err.response?.data || { general: "Registration failed. Try again." });
    } finally {
      setLoading(false); // Reset button state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Top navigation/header */}
      <Header />

      {/* Centered registration form */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Create an Account
          </h2>

          {/* Registration form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full name input */}
            <InputField
              label="Full Name"
              type="text"
              register={register("fullname", { required: "Full Name is required" })}
              error={errors.fullname?.message}
            />

            {/* Username input */}
            <InputField
              label="Username"
              type="text"
              register={register("username", { required: "Username is required" })}
              error={errors.username?.message || serverErrors.username?.[0]}
            />

            {/* Email input with regex validation */}
            <InputField
              label="Email"
              type="email"
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email format
                  message: "Invalid email format",
                },
              })}
              error={errors.email?.message || serverErrors.email?.[0]}
            />

            {/* Password input with min length validation */}
            <InputField
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters required" },
              })}
              error={errors.password?.message}
            />

            {/* Confirm password (must match password field) */}
            <InputField
              label="Confirm Password"
              type="password"
              register={register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
            />

            {/* General server-side error (e.g., username/email already taken) */}
            {serverErrors.general && (
              <p className="text-red-500 text-sm text-center">{serverErrors.general}</p>
            )}

            {/* Register button (disabled when loading) */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg shadow-md font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Link to login page */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium">
              Login
            </Link>
          </p>
        </div>
      </main>

      {/* Footer (bottom navigation) */}
      <Footer />
    </div>
  );
}

// Reusable InputField component for DRY code
function InputField({ label, type, register, error }) {
  return (
    <div>
      {/* Input label */}
      <label className="block text-gray-700 dark:text-gray-300 mb-1">{label}</label>

      {/* Input field (connected to react-hook-form via register) */}
      <input
        type={type}
        {...register}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Validation or server error message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
