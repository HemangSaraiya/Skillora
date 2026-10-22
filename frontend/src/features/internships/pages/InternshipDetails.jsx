import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Clock3,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  CheckCircle2,
  Code2,
  Building2,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import api from "../../../services/axios";

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not specified";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchInternship = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/internship/${id}`);

        if (active) {
          setInternship(response.data.internship || null);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "We couldn't load this internship."
          );
          setInternship(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchInternship();

    return () => {
      active = false;
    };
  }, [id, retryKey]);

  const companyName =
    internship?.companyId?.companyName ||
    internship?.companyId?.name ||
    internship?.company?.name ||
    internship?.companyName ||
    "Hiring company";

  const requiredSkills = Array.isArray(internship?.requiredSkills)
    ? internship.requiredSkills
    : [];
  const preferredSkills = Array.isArray(internship?.preferredSkills)
    ? internship.preferredSkills
    : [];

  const stipend = internship?.stipend?.amount
    ? `₹${Number(internship.stipend.amount).toLocaleString("en-IN")}${
        internship.stipend.period ? ` / ${internship.stipend.period}` : ""
      }`
    : "Unpaid";

  const duration = internship?.duration?.value
    ? `${internship.duration.value} ${internship.duration.unit || ""}`.trim()
    : "Flexible";

  const deadlinePassed =
    internship?.applicationDeadline &&
    new Date(internship.applicationDeadline).getTime() < Date.now();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-10 max-w-xl animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-3 h-5 max-w-sm animate-pulse rounded bg-slate-100" />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {[1, 2].map((item) => (
                <div key={item} className="h-48 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-2xl bg-white" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <BriefcaseBusiness size={26} />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Internship unavailable
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error || "This internship may have been removed or is no longer available."}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setRetryKey((value) => value + 1)}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                Try again
              </button>
              <button
                onClick={() => navigate("/internships")}
                className="cursor-pointer rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Browse internships
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <button
              onClick={() => navigate("/internships")}
              className="mb-8 inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-blue-700"
            >
              <ArrowLeft size={17} />
              All internships
            </button>

            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Sparkles size={13} />
                    {internship.domain || "Internship opportunity"}
                  </span>
                  {internship.workMode && (
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium capitalize text-slate-600">
                      {internship.workMode}
                    </span>
                  )}
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  {internship.title || "Internship opportunity"}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                    <Building2 size={17} className="text-slate-400" />
                    {companyName}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    {internship.location || "Location not specified"}
                  </span>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-64 lg:shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Monthly / total stipend
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stipend}</p>
                <button
                  onClick={() => navigate(`/internships/${id}/apply`)}
                  disabled={Boolean(deadlinePassed)}
                  className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {deadlinePassed ? "Applications closed" : "Apply now"}
                  {!deadlinePassed && <ArrowUpRight size={17} />}
                </button>
                <p className="mt-3 text-center text-xs text-slate-400">
                  Review the details before applying
                </p>
              </div>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                  <IndianRupee size={19} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Stipend</p>
                  <p className="mt-1 font-semibold text-slate-800">{stipend}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                  <Clock3 size={19} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Duration</p>
                  <p className="mt-1 font-semibold capitalize text-slate-800">{duration}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                  <BriefcaseBusiness size={19} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Work mode</p>
                  <p className="mt-1 font-semibold capitalize text-slate-800">
                    {internship.workMode || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                  <CalendarDays size={19} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Apply by</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(internship.applicationDeadline)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                    <BriefcaseBusiness size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">About this internship</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Role overview and responsibilities</p>
                  </div>
                </div>
                <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                  {internship.description || "No description has been provided for this internship yet."}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                    <Code2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Skills for this role</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Technologies and skills the team is looking for</p>
                  </div>
                </div>

                <h3 className="mt-6 text-sm font-semibold text-slate-700">Required skills</h3>
                {requiredSkills.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {requiredSkills.map((skill) => (
                      <span key={skill} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No specific required skills listed.</p>
                )}

                {preferredSkills.length > 0 && (
                  <>
                    <h3 className="mt-6 text-sm font-semibold text-slate-700">Nice to have</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {preferredSkills.map((skill) => (
                        <span key={skill} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                    <GraduationCap size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Eligibility</h2>
                </div>

                <div className="mt-5 space-y-4">
                  {internship.eligibility?.minYear !== undefined ||
                  internship.eligibility?.maxYear !== undefined ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Eligible study year</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {internship.eligibility?.minYear ?? "Any"} – {internship.eligibility?.maxYear ?? "Any"}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {internship.eligibility?.minimumCGPA !== undefined ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Minimum CGPA</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {internship.eligibility.minimumCGPA}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {internship.eligibility?.minYear === undefined &&
                  internship.eligibility?.maxYear === undefined &&
                  internship.eligibility?.minimumCGPA === undefined ? (
                    <p className="text-sm leading-6 text-slate-500">
                      No specific eligibility requirements have been provided.
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                    <CalendarDays size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Important dates</h2>
                </div>
                <div className="mt-5">
                  <p className="text-xs font-medium text-slate-400">Application deadline</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(internship.applicationDeadline)}
                  </p>
                  {deadlinePassed && (
                    <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      The application deadline has passed.
                    </p>
                  )}
                </div>
              </section>

              <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
                <p className="text-sm font-semibold">Interested in this role?</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Check the requirements and prepare your profile before submitting an application.
                </p>
                <button
                  onClick={() => navigate(`/internships/${id}/apply`)}
                  disabled={Boolean(deadlinePassed)}
                  className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deadlinePassed ? "Applications closed" : "Apply for this internship"}
                  {!deadlinePassed && <ArrowUpRight size={16} />}
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InternshipDetails;
