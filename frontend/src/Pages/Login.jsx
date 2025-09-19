// Import required libraries and components
import { useForm } from "react-hook-form";            // For form handling (validation + state management)
import { Link, useNavigate } from "react-router-dom"; // For navigation and linking without reload
import Header from "../components/Header";            // Reusable header component
import Footer from "../components/Footer";            // Reusable footer component
import axios from "axios";                            // For making API calls
import { useState, useEffect } from "react";          // React hooks

export default function Login() {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // Destructure helpers from react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  // State for handling login errors
  const [loginError, setLoginError] = useState("");

  // Dark mode state (persistent across reloads)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  // Apply dark mode and store preference in localStorage whenever darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Form submit handler
  const onSubmit = async (data) => {
    try {
      // Make API request to login endpoint
      const response = await axios.post("http://localhost:8000/api/v1/auth/login/", {
        username: data.username,
        password: data.password,
      });

      // Save token and username in localStorage for authentication persistence
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("fullname", response.data.user.fullname);

      setLoginError("");      // Clear any previous error
      navigate("/welcome");   // Redirect user to welcome page
    } catch (error) {
      // Log the error for debugging
      console.error("Login Error:", error.response?.data || error.message);

      // Show user-friendly error message
      setLoginError("Wrong username or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Header (Top Navigation) */}
      <Header />

      {/* Centered login form */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Page Title */}
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Login
          </h2>

          {/* Form (username + password fields) */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username input */}
            <InputField
              label="Username"
              type="text"
              register={register("username", { required: "Username is required" })}
              error={errors.username?.message}
            />

            {/* Password input */}
            <InputField
              label="Password"
              type="password"
              register={register("password", { required: "Password is required" })}
              error={errors.password?.message}
            />

            {/* Error message if login fails */}
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}

            {/* Login button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              Login
            </button>
          </form>

          {/* Link to register page */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>

      {/* Footer (Bottom Navigation) */}
      <Footer />
    </div>
  );
}

// Reusable input field component
function InputField({ label, type, register, error }) {
  return (
    <div>
      {/* Label for input */}
      <label className="block mb-1 text-gray-700 dark:text-gray-300">{label}</label>

      {/* Input box */}
      <input
        type={type}
        {...register} // Connects this input with react-hook-form
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Validation error (if any) */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
