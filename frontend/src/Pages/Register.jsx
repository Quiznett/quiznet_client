// -----------------------------------------------------------------------------
// File: Register.jsx
// Purpose:
//   - Handles new user registration with OTP verification.
//   - Sends OTP to the user's email and validates it before creating account.
//   - Performs full registration (full name, username, email, password).
//   - Shows both client-side and backend field-level validation errors.
//   - Automatically logs the user in after successful registration.
// -----------------------------------------------------------------------------



import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "../components/Header";
import { useState } from "react";
import InputField from "../components/InputField";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // OTP-related state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Form submit state
  const [loading, setLoading] = useState(false);

  // Error states
  const [serverError, setServerError] = useState(null); // General backend errors
  const [fieldErrors, setFieldErrors] = useState({}); // Field-level backend errors

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const emailValue = watch("email");

  // ---------------------------------------------------------------------------
  // Send OTP to the email provided
  // Triggered manually before registration
  // ---------------------------------------------------------------------------
  const handleSendOtp = async () => {
    if (!emailValue) return alert("Please enter an email first.");

    setOtpLoading(true);
    try {
      await axiosInstance.post("/api/v1/auth/send-otp/", {
        email: emailValue,
      });

      setOtpSent(true);
      alert("OTP sent! Check your email.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // User registration flow:
  // 1) Validate OTP
  // 2) Register new user
  // 3) Auto-login on success
  // ---------------------------------------------------------------------------
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    setFieldErrors({});

    if (!otpSent) {
      setLoading(false);
      alert("Please send OTP first.");
      return;
    }

    try {
      // Step 1: Verify OTP
      await axiosInstance.post("/api/v1/auth/verify-otp/", {
        email: data.email,
        otp: otp,
      });

      // Step 2: Create account
      await axiosInstance.post("/api/v1/auth/register/", {
        username: data.username,
        email: data.email,
        password: data.password,
        fullname: data.fullName,
      });

      // Step 3: Auto-login newly registered user
      await login({
        username: data.username,
        password: data.password,
      });

      navigate("/user");
    } catch (err) {
      const responseData = err.response?.data;

      // Handle backend field-level errors
      if (typeof responseData === "object") {
        setFieldErrors(responseData);
      }

      // General/global error message
      setServerError(
        responseData?.message || responseData?.error || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Page Title */}
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Create an Account
          </h2>

          {/* Backend global error */}
          {serverError && (
            <p className="text-red-600 text-center mb-4">{serverError}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* FULL NAME */}
            <InputField
              label="Full Name"
              type="text"
              register={register("fullName", {
                required: "Full name is required",
              })}
              error={errors.fullName?.message}
            />

            {/* USERNAME */}
            <InputField
              label="Username"
              type="text"
              register={register("username", {
                required: "Username is required",
              })}
              error={errors.username?.message || fieldErrors.username?.[0]}
            />

            {/* EMAIL */}
            <InputField
              label="Email"
              type="email"
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              error={errors.email?.message || fieldErrors.email?.[0]}
            />

            {/* PASSWORD */}
            <InputField
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              error={errors.password?.message}
            />

            {/* CONFIRM PASSWORD */}
            <InputField
              label="Confirm Password"
              type="password"
              register={register("confirmPassword", {
                required: "Please confirm password",
                validate: (v) =>
                  v === watch("password") || "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
            />

            {/* OTP SENDING */}
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-sm text-indigo-600 dark:text-indigo-400"
            >
              {otpLoading ? "Sending OTP..." : "Send OTP"}
            </button>

            {/* OTP INPUT (visible only after OTP is sent) */}
            {otpSent && (
              <>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 
                 text-black dark:text-white"
                />
              </>
            )}

            {/* REGISTER BUTTON */}
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

          {/* Redirect to login */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
