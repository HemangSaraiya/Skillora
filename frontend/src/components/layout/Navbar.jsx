import { Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            S
          </div>

          <span className="text-xl font-bold text-slate-900">
            Skillora
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          {/* Common Navigation */}
          <button
            onClick={() => navigate("/internships")}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Internships
          </button>

          {/* Student Navigation */}
          {user?.role === "student" && (
            <>
              <button
                onClick={() => navigate("/applications")}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Applications
              </button>

              <button
                onClick={() => navigate("/recommendations")}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Recommendations
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Profile
              </button>
            </>
          )}

          {/* Company Navigation */}
          {user?.role === "company" && (
            <>
              <button
                onClick={() => navigate("/company/dashboard")}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/company/my-internships")}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                My Internships
              </button>

              <button
                onClick={() => navigate("/company/internships/create")}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Post Internship
              </button>
            </>
          )}

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <button
            className="hidden rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 sm:block"
          >
            <Search size={20} />
          </button>

          {user ? (
            <>
              {/* User */}
              <button
                onClick={() =>
                  navigate(
                    user.role === "company"
                      ? "/company/dashboard"
                      : "/profile"
                  )
                }
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-50"
              >
                <User size={18} />

                <span className="hidden text-sm font-medium text-slate-700 sm:block">
                  {user.name}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Login
              </button>

              {/* Sign Up */}
              <button
                onClick={() => navigate("/signup")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Sign Up
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;