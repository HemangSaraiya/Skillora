
import { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";

  const links = [
    { label: "Internships", path: "/internships" },
    ...(isStudent
      ? [
          { label: "Applications", path: "/applications" },
          { label: "Recommendations", path: "/#recommendations" },
          { label: "My Profile", path: "/student/profile" },
        ]
      : []),
    ...(isCompany
      ? [
          { label: "Dashboard", path: "/company/dashboard" },
          { label: "My Internships", path: "/company/my-internships" },
          {
            label: "Post Internship",
            path: "/company/internships/create",
          },
        ]
      : []),
  ];

  const goTo = (path) => {
    setMenuOpen(false);

    if (path.includes("#")) {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(path.split("#")[1])
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    navigate(path);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <button
          onClick={() => navigate("/")}
          className="flex shrink-0 items-center gap-3"
          aria-label="Skillora home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md shadow-blue-200">
            S
          </span>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            Skillora
            <span className="ml-0.5 text-blue-600">.</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link.path)}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <>
              <button
                onClick={() =>
                  navigate(
                    isCompany
                      ? "/company/dashboard"
                      : isStudent
                      ? "/student/profile"
                      : "/"
                  )
                }
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                  {(user.name || user.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <span className="max-w-32 truncate text-sm font-semibold text-slate-700">
                  {user.name || "My account"}
                </span>
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                title="Log out"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Log in
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Get started
                <ArrowUpRight size={16} />
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  {isCompany ? (
                    <BriefcaseBusiness size={19} />
                  ) : (
                    <GraduationCap size={20} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {user.name || "Welcome"}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => goTo(link.path)}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </button>
            ))}

            {!user ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => goTo("/login")}
                  className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700"
                >
                  Log in
                </button>
                <button
                  onClick={() => goTo("/signup")}
                  className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
                >
                  Sign up
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-3 flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
