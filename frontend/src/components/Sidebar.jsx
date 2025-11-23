import {
  Menu,
  X,
  Home,
  PlusSquare,
  LogIn,
  ListChecks,
  BarChart2,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen, openCreateForm }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: Home, path: "/user" },
    { label: "Create a Quiz", icon: PlusSquare, action: "openForm" },
    { label: "Join Live Quiz", icon: LogIn, path: "/join-quiz" },
    { label: "My Quizzes", icon: ListChecks, path: "/myQuizzes" },
    { label: "Attempted Quizzes", icon: CheckCircle, path: "/given-quizzes" },
    { label: "My Performance", icon: BarChart2, path: "/performance" },
  ];

  return (
    <aside
      className={`transition-all ${
        sidebarOpen ? "w-56" : "w-16"
      } duration-300 bg-white dark:bg-gray-800 shadow-md flex flex-col justify-between`}
    >
      <div className="grow flex flex-col">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 m-2 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center"
        >
          {sidebarOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        <nav
          className={`grow flex flex-col gap-2 p-2 text-gray-700 dark:text-gray-200 overflow-hidden ${
            !sidebarOpen && "py-0"
          }`}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div
                key={index}
                onClick={() => {
                  if (item.action === "openForm") {
                    openCreateForm();         // <-- Opens CreateQuizForm
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all
                  ${
                    isActive && sidebarOpen
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <Icon size={22} />
                <span
                  className={`transition-all duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  } text-base`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
