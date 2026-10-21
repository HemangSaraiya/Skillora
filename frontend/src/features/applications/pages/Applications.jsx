import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  FileText,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { getMyApplications } from "../application.api";

const FILTERS = [
  { label: "All applications", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_META = {
  pending: {
    label: "Pending review",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
    dot: "bg-amber-500",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: Sparkles,
    dot: "bg-blue-500",
  },
  accepted: {
    label: "Accepted",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Not selected",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
    dot: "bg-rose-500",
  },
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatus = (status) => STATUS_META[status?.toLowerCase()] || STATUS_META.pending;

const ApplicationSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <div className="flex gap-4">
      <div className="h-12 w-12 rounded-xl bg-slate-100" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-5 w-2/3 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="h-7 w-24 rounded-full bg-slate-100" />
    </div>
    <div className="mt-6 h-px bg-slate-100" />
    <div className="mt-5 h-4 w-32 rounded bg-slate-100" />
  </div>
);

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyApplications();
      setApplications(response?.applications || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setApplications([]);
      } else {
        setError(err.response?.data?.message || "We couldn't load your applications. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const counts = useMemo(() => {
    const result = { all: applications.length, pending: 0, shortlisted: 0, accepted: 0, rejected: 0 };
    applications.forEach((application) => {
      const status = application.status?.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(result, status)) result[status] += 1;
    });
    return result;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter((application) => {
      const internship = application.internshipId || {};
      const status = application.status?.toLowerCase() || "pending";
      const matchesFilter = activeFilter === "all" || status === activeFilter;
      const searchableText = [
        internship.title,
        internship.domain,
        internship.workMode,
        internship.companyName,
        internship.company?.name,
      ].filter(Boolean).join(" ").toLowerCase();
      return matchesFilter && (!query || searchableText.includes(query));
    });
  }, [applications, activeFilter, search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 top-20 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <button
              onClick={() => navigate("/")}
              className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <ArrowLeft size={17} /> Back to home
            </button>

            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  <FileText size={14} /> Student workspace
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  My applications<span className="text-blue-600">.</span>
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Keep track of your internship journey, see the latest status, and revisit opportunities you applied for.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">Total applications</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{loading ? "—" : counts.all}</p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
                  <p className="text-xs font-semibold text-blue-700">Shortlisted</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-blue-800">{loading ? "—" : counts.shortlisted}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your application activity</h2>
              <p className="mt-1 text-sm text-slate-500">Review each application and its current status.</p>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search role or domain..."
                aria-label="Search applications"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <XCircle size={16} />
                </button>
              )}
            </label>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((filter) => {
              const selected = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {filter.label}
                  <span className={`rounded-md px-1.5 py-0.5 text-xs ${selected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {loading ? "—" : counts[filter.value]}
                  </span>
                </button>
              );
            })}
          </div>

          {loading && (
            <div className="space-y-4" aria-label="Loading applications">
              <ApplicationSkeleton />
              <ApplicationSkeleton />
              <ApplicationSkeleton />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><XCircle size={23} /></div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Couldn't load applications</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{error}</p>
              <button onClick={fetchApplications} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><BriefcaseBusiness size={28} /></div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">Your next opportunity starts here</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">You haven't applied for an internship yet. Explore available roles and find one that fits your goals.</p>
              <button onClick={() => navigate("/internships")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Browse internships <ArrowUpRight size={16} />
              </button>
            </div>
          )}

          {!loading && !error && applications.length > 0 && filteredApplications.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
              <Search size={28} className="mx-auto text-slate-300" />
              <h3 className="mt-4 font-bold text-slate-900">No matching applications</h3>
              <p className="mt-1 text-sm text-slate-500">Try another search or choose a different status filter.</p>
              <button onClick={() => { setSearch(""); setActiveFilter("all"); }} className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800">Clear filters</button>
            </div>
          )}

          {!loading && !error && filteredApplications.length > 0 && (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const internship = application.internshipId || {};
                const status = getStatus(application.status);
                const StatusIcon = status.icon;
                const hasInternship = Boolean(internship._id);

                return (
                  <article key={application._id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700">
                        <BriefcaseBusiness size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{internship.domain || "Internship opportunity"}</p>
                            <h3 className="mt-1.5 break-words text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                              {internship.title || "Internship no longer available"}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                              {internship.workMode && <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness size={15} /> {internship.workMode}</span>}
                              <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> Applied {formatDate(application.createdAt)}</span>
                            </div>
                          </div>

                          <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}>
                            <StatusIcon size={14} /> {status.label}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs leading-5 text-slate-400">Application ID: <span className="font-medium text-slate-500">{application._id || "Unavailable"}</span></p>
                          {hasInternship ? (
                            <button onClick={() => navigate(`/internships/${internship._id}`)} className="inline-flex items-center gap-2 self-start text-sm font-bold text-blue-700 transition hover:text-blue-900 sm:self-auto">
                              View internship <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">Internship details unavailable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <p className="mt-6 text-center text-xs text-slate-400">
              Showing {filteredApplications.length} of {applications.length} application{applications.length === 1 ? "" : "s"}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Applications;
