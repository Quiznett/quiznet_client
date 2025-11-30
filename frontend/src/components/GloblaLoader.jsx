// -----------------------------------------------------------------------------
// GlobalLoader Component
// -----------------------------------------------------------------------------
// Full-screen skeleton-style loader used during major transitions such as:
//   • Initial auth validation
//   • Fetching quizzes
//   • Loading results / submissions
//
// Designed to dim the entire viewport and mimic page content using animated
// placeholder blocks.
// -----------------------------------------------------------------------------

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100 dark:bg-gray-900 z-[9999]">

      {/* Pulsing skeleton container */}
      <div className="animate-pulse w-10/12 max-w-2xl space-y-6">

        {/* Header placeholder */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mx-auto"></div>

        {/* Text line placeholders */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-4/6"></div>

        {/* Large content block */}
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl w-full"></div>

        {/* Additional smaller lines */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-11/12"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-9/12"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-7/12"></div>
      </div>

    </div>
  );
}
