import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api/axios"; 
import { useState, useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const onSubmit = async (data) => {
    try {
     
      const response = await api.post(
        "login/",
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true } 
      );

   
      sessionStorage.setItem("access", response.data.access);
      sessionStorage.setItem("username", response.data.user.username);
      sessionStorage.setItem("fullname", response.data.user.fullname);

      setLoginError("");

     
      navigate("/welcome");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setLoginError("Wrong username or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <Header />

      <div className="absolute top-6 right-6">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Username"
              type="text"
              register={register("username", { required: "Username is required" })}
              error={errors.username?.message}
            />

            <InputField
              label="Password"
              type="password"
              register={register("password", { required: "Password is required" })}
              error={errors.password?.message}
            />

            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Register here
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
      <label className="block mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        {...register}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
