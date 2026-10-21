
import { useState } from "react";
import {
  ArrowRight,
  Search,
  Sparkles,
  BriefcaseBusiness,
  UserRound,
  GraduationCap,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();
    navigate(
      query
        ? `/internships?search=${encodeURIComponent(query)}`
        : "/internships"
    );
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
      <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 -z-10 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {isCompany ? (
              <BriefcaseBusiness size={16} />
            ) : (
              <Sparkles size={16} />
            )}

            {isCompany
              ? "Your hiring workspace"
              : isStudent
              ? `Welcome${user?.name ? `, ${user.name.split(" ")[0]}` : " back"}`
              : "Your next opportunity starts here"}
          </div>

          <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {isCompany ? (
              <>
                Find people who
                <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  move ideas forward.
                </span>
              </>
            ) : isStudent ? (
              <>
                Turn your skills into
                <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  real opportunities.
                </span>
              </>
            ) : (
              <>
                Discover work that
                <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  moves you forward.
                </span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            {isCompany
              ? "Create internship opportunities, manage applicants, and connect with students ready to build their future."
              : isStudent
              ? "Explore internships, showcase your skills, and discover opportunities that align with your interests and career goals."
              : "Explore internships, discover new career paths, and find opportunities to put your skills into practice."}
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50 sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search className="shrink-0 text-slate-400" size={21} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search internships, skills, or domains"
                aria-label="Search internships"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Search
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            {isCompany ? (
              <>
                <button
                  onClick={() => navigate("/company/internships/create")}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Post an internship
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => navigate("/company/dashboard")}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Open dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/internships")}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Explore internships
                  <ArrowRight size={17} />
                </button>

                {isStudent && (
                  <button
                    onClick={() => navigate("/student/profile")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <UserRound size={17} />
                    My profile
                  </button>
                )}

                {!user && (
                  <button
                    onClick={() => navigate("/signup")}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Get started
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Role-aware feature panel, without fake internship data */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200/50 to-violet-200/50 blur-2xl" />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {isCompany ? (
                  <BriefcaseBusiness size={24} />
                ) : isStudent ? (
                  <GraduationCap size={25} />
                ) : (
                  <Compass size={24} />
                )}
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  {isCompany
                    ? "For employers"
                    : isStudent
                    ? "Your career journey"
                    : "Explore Skillora"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {isCompany
                    ? "Build your team"
                    : isStudent
                    ? "Your next chapter"
                    : "Find your direction"}
                </h2>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              {(isCompany
                ? [
                    {
                      icon: BriefcaseBusiness,
                      title: "Publish opportunities",
                      description:
                        "Create internship listings with the details you choose.",
                    },
                    {
                      icon: UserRound,
                      title: "Manage applicants",
                      description:
                        "Review applications and track candidate progress.",
                    },
                  ]
                : [
                    {
                      icon: Search,
                      title: "Explore opportunities",
                      description:
                        "Browse internships by domain, skills, and work mode.",
                    },
                    {
                      icon: Sparkles,
                      title: "Discover your matches",
                      description: isStudent
                        ? "See recommendations based on your profile and preferences."
                        : "Create a student account to access personalized recommendations.",
                    },
                  ]
              ).map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50/70"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                navigate(
                  isCompany
                    ? "/company/dashboard"
                    : isStudent
                    ? "/student/profile"
                    : "/internships"
                )
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {isCompany
                ? "Go to dashboard"
                : isStudent
                ? "Manage your profile"
                : "Browse opportunities"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
