import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios"; 
import Header from "../components/Header";

import { useState, useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [darkMode] = useState(localStorage.getItem("darkMode") === "true" || false);
  const [serverErrors, setServerErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerErrors({});

      const res = await api.post("register/", {
        username: data.username,
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      });

      if (res.status === 201) {
      
        sessionStorage.setItem("access", res.data.access);
        sessionStorage.setItem("username", res.data.user.username);
        sessionStorage.setItem("fullname", res.data.user.fullname);

        navigate("/welcome");
      }
    } catch (err) {
      console.error("Register Error:", err.response?.data || err.message);
      setServerErrors(err.response?.data || { general: "Registration failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              register={register("fullname", { required: "Full Name is required" })}
              error={errors.fullname?.message}
            />

            <InputField
              label="Username"
              type="text"
              register={register("username", { required: "Username is required" })}
              error={errors.username?.message || serverErrors.username?.[0]}
            />

            <InputField
              label="Email"
              type="email"
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              error={errors.email?.message || serverErrors.email?.[0]}
            />

            <InputField
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters required" },
              })}
              // ✅ Combine frontend + backend password errors
              error={
                errors.password?.message ||
                (serverErrors.password && serverErrors.password.join(", "))
              }
            />

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

            {serverErrors.general && (
              <p className="text-red-500 text-sm text-center">{serverErrors.general}</p>
            )}

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
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium">
              Login
            </Link>
          </p>
        </div>
      </main>

      
    </div>
  );
}

function InputField({ label, type, register, error }) {
  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        {...register}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
