import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";
import api from "../../../services/axios";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  closed: "bg-slate-100 text-slate-600 ring-slate-500/20",
  paused: "bg-orange-50 text-orange-700 ring-orange-600/20",
};

const formatStatus = (status) =>
  String(status || "unknown").replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatStipend = (stipend) => {
  if (stipend?.amount == null) return "Not specified";
  const amount = Number(stipend.amount);
  const formatted = Number.isFinite(amount) ? amount.toLocaleString("en-IN") : stipend.amount;
  return `₹${formatted}${stipend?.period ? ` / ${stipend.period}` : ""}`;
};

const MyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchMyInternships = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const response = await api.get("/internship/my-internships");
      setInternships(Array.isArray(response.data?.internships) ? response.data.internships : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch internships. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMyInternships();
  }, [fetchMyInternships]);

  const statuses = useMemo(
    () => [...new Set(internships.map((item) => String(item.status || "unknown").toLowerCase()))],
    [internships]
  );

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();
    return internships.filter((item) => {
      const matchesSearch =
        !query ||
        [item.title, item.domain, item.description, item.location, item.workMode]
          .some((value) => String(value || "").toLowerCase().includes(query));
      const matchesStatus = statusFilter === "all" || String(item.status || "unknown").toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [internships, search, statusFilter]);

  const activeCount = internships.filter((item) =>
    ["active", "published", "open"].includes(String(item.status || "").toLowerCase())
  ).length;

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 sm:flex">
              <BriefcaseBusiness size={23} />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Company workspace</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">My Internships</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Keep track of your listings, review their status, and manage each opportunity from one place.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={() => navigate("/company/internships/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <Plus size={17} /> Post internship
            </button>
          </div>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total listings</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><BriefcaseBusiness size={19} /></span>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight">{internships.length}</p>
            <p className="mt-1 text-xs text-slate-400">All internships you have posted</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Active listings</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={19} /></span>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight">{activeCount}</p>
            <p className="mt-1 text-xs text-slate-400">Currently open to applicants</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Other statuses</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Clock3 size={19} /></span>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight">{internships.length - activeCount}</p>
            <p className="mt-1 text-xs text-slate-400">Draft, paused, or closed listings</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, domain, location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700">
                  <X size={15} />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <SlidersHorizontal size={16} /> Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="all">All statuses</option>
                {statuses.map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}
              </select>
              <button
                onClick={() => fetchMyInternships(true)}
                disabled={refreshing || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Showing {filteredInternships.length} of {internships.length} listings
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-5 flex justify-between gap-4">
                  <div className="flex-1 space-y-3"><div className="h-5 w-2/3 rounded bg-slate-200" /><div className="h-3 w-1/3 rounded bg-slate-100" /></div>
                  <div className="h-6 w-20 rounded-full bg-slate-100" />
                </div>
                <div className="space-y-2"><div className="h-3 rounded bg-slate-100" /><div className="h-3 w-4/5 rounded bg-slate-100" /></div>
                <div className="my-6 grid grid-cols-2 gap-3"><div className="h-16 rounded-xl bg-slate-100" /><div className="h-16 rounded-xl bg-slate-100" /><div className="h-16 rounded-xl bg-slate-100" /><div className="h-16 rounded-xl bg-slate-100" /></div>
                <div className="h-11 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><BriefcaseBusiness size={22} /></div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Couldn't load your internships</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{error}</p>
            <button onClick={() => fetchMyInternships()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><BriefcaseBusiness size={25} /></div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{internships.length === 0 ? "Your first internship starts here" : "No matching internships"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {internships.length === 0
                ? "You haven't posted any opportunities yet. Create a listing to start connecting with students."
                : "Try changing your search or status filter to find the listing you're looking for."}
            </p>
            {internships.length === 0 ? (
              <button onClick={() => navigate("/company/internships/create")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700">
                <Plus size={17} /> Post your first internship
              </button>
            ) : (
              <button onClick={() => { setSearch(""); setStatusFilter("all"); }} className="mt-6 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredInternships.map((internship) => {
              const statusKey = String(internship.status || "unknown").toLowerCase();
              const statusClass = statusStyles[statusKey] || "bg-slate-100 text-slate-600 ring-slate-500/20";
              const duration = [internship.duration?.value, internship.duration?.unit].filter(Boolean).join(" ") || "Not specified";

              return (
                <article key={internship._id} className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">{internship.domain || "General"}</p>
                      <h2 className="break-words text-xl font-bold leading-snug text-slate-950">{internship.title || "Untitled internship"}</h2>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${statusClass}`}>
                      {formatStatus(internship.status)}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {internship.description || "No description has been added yet."}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><MapPin size={15} /> Work mode & location</div>
                      <p className="mt-2 text-sm font-semibold capitalize text-slate-800">{internship.workMode || "Not specified"}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{internship.location || "Location not specified"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><CalendarDays size={15} /> Duration</div>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{duration}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 sm:col-span-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><Wallet size={15} /> Stipend</div>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{formatStipend(internship.stipend)}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => navigate(`/company/internships/${internship._id}`)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                    >
                      Manage internship <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default MyInternships;
