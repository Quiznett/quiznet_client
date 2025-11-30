import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "../components/Header";
import { useState } from "react";
import InputField from "../components/InputField";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();   // <-- for auto-login after register

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    setFieldErrors({});

    try {
      // 1️⃣ Register user
      await axiosInstance.post("/api/v1/auth/register/", {
        username: data.username,
        email: data.email,
        password: data.password,
        fullname: data.fullName,
      });

      // 2️⃣ Auto login user
      await login({
        username: data.username,
        password: data.password,
      });

      // 3️⃣ Redirect to /user page
      navigate("/user");

    } catch (err) {
      const d = err.response?.data;

      if (typeof d === "object" && d !== null) {
        setFieldErrors(d);
      }

      setServerError(d?.message || d?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Create an Account
          </h2>

          {serverError && (
            <p className="text-red-600 text-center mb-4">{serverError}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <InputField
              label="Full Name"
              type="text"
              register={register("fullName", {
                required: "Full name is required",
              })}
              error={errors.fullName?.message || fieldErrors.fullname?.[0]}
            />

            <InputField
              label="Username"
              type="text"
              register={register("username", {
                required: "Username is required",
              })}
              error={errors.username?.message || fieldErrors.username?.[0]}
            />

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

            <InputField
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              error={errors.password?.message || fieldErrors.password?.[0]}
            />

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
