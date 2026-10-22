import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Mail,
  RefreshCw,
  Search,
  Users,
  UserRound,
  FileText,
  ExternalLink,
  X,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import api from "../../../services/axios";

const statusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  shortlisted: "border-sky-200 bg-sky-50 text-sky-700",
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusIcons = {
  pending: Clock3,
  shortlisted: Users,
  accepted: CheckCircle2,
  rejected: XCircle,
};

const formatStatus = (status = "pending") =>
  status.charAt(0).toUpperCase() + status.slice(1);

const formatDate = (date) => {
  if (!date) return "Date unavailable";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "Date unavailable"
    : parsed.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <div className="flex gap-4">
      <div className="h-14 w-14 rounded-2xl bg-slate-200" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
    <div className="mt-6 h-3 w-full rounded bg-slate-100" />
    <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
  </div>
);

const InternshipApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchApplicants = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const response = await api.get(`/application/internship/${id}`);
      setApplicants(response.data.applicants || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setApplicants([]);
      } else {
        setError(err.response?.data?.message || "Failed to fetch applicants. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const counts = useMemo(() => {
    return applicants.reduce(
      (result, application) => {
        const status = application.status || "pending";
        result.total += 1;
        result[status] = (result[status] || 0) + 1;
        return result;
      },
      { total: 0, pending: 0, shortlisted: 0, accepted: 0, rejected: 0 }
    );
  }, [applicants]);

  const visibleApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applicants.filter((application) => {
      const student = application.studentId || {};
      const matchesSearch =
        !query ||
        (student.name || "").toLowerCase().includes(query) ||
        (student.email || "").toLowerCase().includes(query) ||
        (application.coverLetter || "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || (application.status || "pending") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applicants, search, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="h-44 animate-pulse rounded-3xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard /><SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`/company/internships/${id}`)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} /> Back to internship
        </button>

        <header className="relative mb-7 overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                <Users size={14} /> Talent overview
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Internship applicants</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Review applications, explore cover letters, and find the right people for your team.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:self-auto">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
                <UserRound size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Applications received</p>
                <p className="text-2xl font-bold">{counts.total}</p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <CircleAlert size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button type="button" onClick={() => fetchApplicants()} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 font-semibold hover:bg-rose-100">
              <RefreshCw size={14} /> Retry
            </button>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error" className="rounded-lg p-1 hover:bg-rose-100">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Pending review", value: counts.pending, icon: Clock3, tone: "text-amber-600 bg-amber-50" },
            { label: "Shortlisted", value: counts.shortlisted, icon: Users, tone: "text-sky-600 bg-sky-50" },
            { label: "Accepted", value: counts.accepted, icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
            { label: "Rejected", value: counts.rejected, icon: XCircle, tone: "text-rose-600 bg-rose-50" },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon size={18} /></div>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student, email, or cover letter..."
                aria-label="Search applicants"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                ["all", `All (${counts.total})`],
                ["pending", "Pending"],
                ["shortlisted", "Shortlisted"],
                ["accepted", "Accepted"],
                ["rejected", "Rejected"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${statusFilter === value ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => fetchApplicants(true)}
                disabled={refreshing}
                aria-label="Refresh applicants"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">
            {statusFilter === "all" ? "All applicants" : `${formatStatus(statusFilter)} applicants`}
          </h2>
          <p className="text-sm text-slate-500">{visibleApplicants.length} shown</p>
        </div>

        {applicants.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Users size={28} /></div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">No applicants yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">When students apply for this internship, their applications will appear here.</p>
            <button type="button" onClick={() => navigate(`/company/internships/${id}`)} className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Back to internship</button>
          </div>
        ) : visibleApplicants.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <Search size={26} className="mx-auto text-slate-400" />
            <h3 className="mt-3 font-bold text-slate-900">No matching applicants</h3>
            <p className="mt-1 text-sm text-slate-500">Try a different search term or status filter.</p>
            <button type="button" onClick={() => { setSearch(""); setStatusFilter("all"); }} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">Clear filters</button>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleApplicants.map((application) => {
              const student = application.studentId || {};
              const status = application.status || "pending";
              const StatusIcon = statusIcons[status] || Clock3;

              return (
                <article key={application._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-lg font-bold text-indigo-700">
                        {(student.name || "S").trim().charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-bold text-slate-900">{student.name || "Student"}</h3>
                        <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-500"><Mail size={15} className="shrink-0" /> {student.email || "Email not available"}</p>
                        <p className="mt-2 flex items-center gap-2 text-xs text-slate-400"><CalendarDays size={14} /> Applied {formatDate(application.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[status] || statusStyles.pending}`}>
                      <StatusIcon size={14} /> {formatStatus(status)}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"><FileText size={16} className="text-indigo-600" /> Cover letter</div>
                    <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                      {application.coverLetter || "No cover letter provided."}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">Application ID: <span className="font-mono">{application._id}</span></p>
                    <button
                      type="button"
                      onClick={() => navigate(`/company/applications/${application._id}`)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    >
                      View application <ExternalLink size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipApplicants;
