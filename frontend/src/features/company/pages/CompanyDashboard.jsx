import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import api from "../../../services/axios";
import Navbar from "../../../components/layout/Navbar";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/internship/company-stats");
      setStats({
        totalInternships: response.data?.stats?.totalInternships ?? 0,
        activeInternships: response.data?.stats?.activeInternships ?? 0,
        totalApplications: response.data?.stats?.totalApplications ?? 0,
        pendingApplications: response.data?.stats?.pendingApplications ?? 0,
      });
    } catch (err) {
      console.error("Error fetching company statistics:", err);
      setError(err.response?.data?.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total internships",
      value: stats.totalInternships,
      description: "Opportunities you've posted",
      icon: BriefcaseBusiness,
      iconStyle: "bg-blue-50 text-blue-700",
      accent: "text-blue-700",
    },
    {
      title: "Active internships",
      value: stats.activeInternships,
      description: "Currently available to students",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-700",
      accent: "text-emerald-700",
    },
    {
      title: "Total applications",
      value: stats.totalApplications,
      description: "Applications received so far",
      icon: Users,
      iconStyle: "bg-violet-50 text-violet-700",
      accent: "text-violet-700",
    },
    {
      title: "Pending applications",
      value: stats.pendingApplications,
      description: "Waiting for your review",
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-700",
      accent: "text-amber-700",
    },
  ];

  const displayName = user?.name?.trim()?.split(" ")[0] || "there";

  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-sm sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                <Sparkles size={14} /> Company workspace
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {displayName}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Your hiring overview, all in one place. Track opportunities and stay on top of applications from students.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/company/internships/create")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                <Plus size={17} /> Post an internship
              </button>
              <button
                onClick={fetchStats}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing…" : "Refresh stats"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Overview</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Hiring at a glance</h2>
            </div>
            {!loading && !error && (
              <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 sm:inline-flex">
                Live account statistics
              </span>
            )}
          </div>

          {error && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CircleAlert size={19} className="mt-0.5 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Couldn't load statistics</p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchStats}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60 sm:self-auto"
              >
                <RefreshCw size={15} /> Try again
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconStyle}`}>
                      <Icon size={21} />
                    </div>
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400">
                      {loading ? "…" : error ? "Unavailable" : "Updated"}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-medium text-slate-500">{card.title}</p>
                  <p className={`mt-1 text-3xl font-bold tracking-tight ${card.accent}`}>
                    {loading || error ? "—" : card.value.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{card.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Quick actions</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Keep your hiring moving</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <button
              onClick={() => navigate("/company/my-internships")}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-7"
            >
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <BriefcaseBusiness size={23} />
                </div>
                <ArrowUpRight size={20} className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-700" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Manage my internships</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Review your posted opportunities and keep their details up to date.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                View my internships <ArrowUpRight size={15} />
              </span>
            </button>

            <button
              onClick={() => navigate("/company/internships/create")}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-7"
            >
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <Plus size={23} />
                </div>
                <ArrowUpRight size={20} className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-700" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Create an opportunity</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Reach students by publishing a new internship with clear requirements.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
                Post an internship <ArrowUpRight size={15} />
              </span>
            </button>
          </div>
        </section>

        <footer className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Building2 size={18} />
          </div>
          <p>Keep your internship descriptions and eligibility requirements up to date to help students find the right fit.</p>
        </footer>
      </main>
    </div>
    </div>
  );
};

export default CompanyDashboard;
