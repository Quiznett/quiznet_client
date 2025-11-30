import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Displayable server-side login error (e.g., wrong password)
  const [serverError, setServerError] = useState(null);

  // Loading state during login request
  const [loading, setLoading] = useState(false);

  // Field-level validation errors returned by backend
  const [fieldErrors, setFieldErrors] = useState({});

  // react-hook-form setup (client-side validation)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ---------------------------------------------------------------
  // Handle form submission:
  // - Perform login request
  // - Redirect on success
  // - Store errors on failure
  // ---------------------------------------------------------------
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    setFieldErrors({}); // Clear old backend field errors

    try {
      await login({
        username: data.username,
        password: data.password,
      });

      navigate("/user"); // Redirect to dashboard
    } catch (err) {
      const res = err.response?.data;

      // Backend may return field-level errors (e.g., { username: ["Required"] })
      if (typeof res === "object" && res !== null) {
        setFieldErrors(res);
      }

      // Backend or generic login message
      setServerError(
        res?.message ||
        res?.error ||
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Public header */}
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

          {/* Page Title */}
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Login
          </h2>

          {/* General login error (wrong password, inactive user, etc.) */}
          {serverError && (
            <p className="text-red-600 text-center mb-4">{serverError}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Username field */}
            <InputField
              label="Username"
              type="text"
              register={register("username", {
                required: "Username is required",
              })}
              // Merge client-side error + backend field error
              error={errors.username?.message || fieldErrors.username?.[0]}
            />

            {/* Password field */}
            <InputField
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
              })}
              error={errors.password?.message || fieldErrors.password?.[0]}
            />

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
