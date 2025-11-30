// -----------------------------------------------------------------------------
// InputField Component
// -----------------------------------------------------------------------------
// Reusable form input with label, validation support, and error display.
// Designed to work smoothly with react-hook-form's register() function.
// -----------------------------------------------------------------------------

export default function InputField({ label, type, register, error }) {
  return (
    <div>
      {/* Field Label */}
      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Input Element (react-hook-form register spreads validation props) */}
      <input
        type={type}
        {...register}
        className="
          w-full px-4 py-2 rounded-lg border border-gray-300
          dark:border-gray-600 dark:bg-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
      />

      {/* Validation / Server Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
