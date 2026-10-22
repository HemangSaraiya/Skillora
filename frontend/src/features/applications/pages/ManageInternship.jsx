import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Code2,
  MapPin,
  Pencil,
  RefreshCw,
  Users,
  Wallet,
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

const formatDeadline = (value) => {
  if (!value) return "Not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const DetailItem = ({ icon: Icon, label, value, hint }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
      <Icon size={15} /> {label}
    </div>
    <p className="mt-2 break-words text-sm font-bold text-slate-800">{value || "Not specified"}</p>
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

const ManageInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchInternship = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const response = await api.get(`/internship/${id}`);
      setInternship(response.data?.internship || null);
      if (!response.data?.internship) {
        setError("The internship details could not be found.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch internship. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInternship();
  }, [fetchInternship]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5">
          <div className="h-8 w-40 rounded-lg bg-slate-200" />
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="h-5 w-28 rounded bg-slate-100" />
            <div className="mt-4 h-9 w-2/3 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-24 rounded-xl bg-slate-100" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><CircleAlert size={23} /></div>
          <h1 className="mt-4 text-xl font-bold text-slate-950">Unable to load internship</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => fetchInternship()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"><RefreshCw size={15} /> Try again</button>
            <button onClick={() => navigate("/company/my-internships")} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back to listings</button>
          </div>
        </div>
      </div>
    );
  }

  if (!internship) return null;

  const statusKey = String(internship.status || "unknown").toLowerCase();
  const statusClass = statusStyles[statusKey] || "bg-slate-100 text-slate-600 ring-slate-500/20";
  const requiredSkills = Array.isArray(internship.requiredSkills) ? internship.requiredSkills : [];
  const preferredSkills = Array.isArray(internship.preferredSkills) ? internship.preferredSkills : [];
  const eligibility = internship.eligibility || {};
  const deadlineDate = internship.applicationDeadline ? new Date(internship.applicationDeadline) : null;
  const deadlinePassed = deadlineDate && !Number.isNaN(deadlineDate.getTime()) && deadlineDate < new Date();

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate("/company/my-internships")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
          >
            <ArrowLeft size={16} /> Back to my internships
          </button>
          <button
            onClick={() => fetchInternship(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh details
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <CircleAlert size={18} className="shrink-0" /> {error}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
            <div className="absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
                  <BriefcaseBusiness size={14} /> Internship overview
                </span>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${statusClass}`}>
                  {formatStatus(internship.status)}
                </span>
                {deadlinePassed && <span className="rounded-full bg-rose-500/15 px-3 py-1.5 text-xs font-bold text-rose-200 ring-1 ring-inset ring-rose-300/20">Deadline passed</span>}
              </div>
              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold text-indigo-200">{internship.domain || "General domain"}</p>
                  <h1 className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{internship.title || "Untitled internship"}</h1>
                  <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-6 text-slate-300">
                    {internship.description || "No description has been added for this internship."}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/company/internships/${internship._id}/edit`)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
                  >
                    <Pencil size={16} /> Edit internship
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
            <DetailItem icon={MapPin} label="Work mode" value={internship.workMode ? internship.workMode.replace(/[_-]/g, " ") : "Not specified"} hint={internship.location || "Location not specified"} />
            <DetailItem icon={Clock3} label="Duration" value={[internship.duration?.value, internship.duration?.unit].filter(Boolean).join(" ") || "Not specified"} />
            <DetailItem icon={Wallet} label="Stipend" value={formatStipend(internship.stipend)} />
            <DetailItem icon={CalendarDays} label="Application deadline" value={formatDeadline(internship.applicationDeadline)} hint={deadlinePassed ? "Applications deadline has passed" : "Deadline for applications"} />
          </div>

          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_300px]">
            <div className="space-y-7">
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><Code2 size={17} /></span>
                  <h2 className="text-base font-bold text-slate-950">Required skills</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{requiredSkills.length}</span>
                </div>
                {requiredSkills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((skill) => <span key={skill} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800">{skill}</span>)}
                  </div>
                ) : <p className="text-sm text-slate-500">No required skills have been listed.</p>}
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><SparklesIcon /></span>
                  <h2 className="text-base font-bold text-slate-950">Preferred skills</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{preferredSkills.length}</span>
                </div>
                {preferredSkills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {preferredSkills.map((skill) => <span key={skill} className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-800">{skill}</span>)}
                  </div>
                ) : <p className="text-sm text-slate-500">No preferred skills have been added.</p>}
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><CheckCircle2 size={18} /></span>
                <h2 className="font-bold text-slate-950">Eligibility criteria</h2>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">Eligible academic years</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {eligibility.minYear != null && eligibility.maxYear != null ? `Year ${eligibility.minYear} – Year ${eligibility.maxYear}` : "Not specified"}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-medium text-slate-400">Minimum CGPA</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{eligibility.minimumCGPA != null ? eligibility.minimumCGPA : "Not specified"}</p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-medium text-slate-400">Location</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-800">{internship.location || (internship.workMode === "remote" ? "Remote" : "Not specified")}</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="font-bold text-slate-900">Ready to manage this opportunity?</p>
              <p className="mt-1 text-sm text-slate-500">Review applicants or update the details of this listing.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => navigate(`/company/internships/${internship._id}/applicants`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700"
              >
                <Users size={16} /> View applicants <ArrowUpRight size={15} />
              </button>
              <button
                onClick={() => navigate(`/company/internships/${internship._id}/edit`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <Pencil size={16} /> Edit listing
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const SparklesIcon = () => <Code2 size={17} />;

export default ManageInternship;
