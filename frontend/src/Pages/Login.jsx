import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add login logic here
    console.log("Login attempt:", form);
    alert("Login functionality not implemented yet.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-left text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-left text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              Login
            </button>
          </form>

          {/* Redirect to Signup */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
