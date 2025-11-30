export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100 dark:bg-gray-900 z-[9999]">
      <div className="animate-pulse w-10/12 max-w-2xl space-y-6">

        {/* Top block */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mx-auto"></div>

        {/* Several lines */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-4/6"></div>

        {/* Large block */}
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl w-full"></div>

        {/* More lines */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-11/12"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-9/12"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-7/12"></div>

      </div>
    </div>
  );
}
