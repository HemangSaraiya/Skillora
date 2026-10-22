import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
  XCircle,
  Globe,
  Building2,
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

const formatDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not provided"
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const displayValue = (value) =>
  value !== undefined && value !== null && value !== "" ? value : "Not provided";

const Section = ({ icon: Icon, title, subtitle, children, className = "" }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const InfoItem = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-800">{displayValue(value)}</p>
  </div>
);

const ApplicantProfile = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const fetchApplicant = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/application/${applicationId}/details`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applicant details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplicant();
  }, [fetchApplicant]);

  const handleStatusChange = async (status) => {
    if (!data?.application || data.application.status === status) return;

    try {
      setUpdating(true);
      setError("");
      setStatusMessage("");
      const response = await api.patch(`/application/${applicationId}/status`, { status });
      setData((prev) => prev ? { ...prev, application: response.data.application } : prev);
      setStatusMessage(`Application marked as ${status}.`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update application status.");
    } finally {
      setUpdating(false);
    }
  };

  const profile = data?.profile;
  const student = data?.student;
  const application = data?.application;
  const currentStatus = application?.status || "pending";
  const StatusIcon = statusIcons[currentStatus] || Clock3;

  const projectCount = profile?.projects?.length || 0;
  const experienceCount = profile?.experience?.length || 0;
  const skillCount = profile?.skills?.length || 0;

  const completionItems = useMemo(() => [
    { label: "Contact details", complete: Boolean(student?.name && student?.email) },
    { label: "Education", complete: Boolean(profile?.education?.degree || profile?.education?.university) },
    { label: "Skills", complete: skillCount > 0 },
    { label: "Projects", complete: projectCount > 0 },
    { label: "Experience", complete: experienceCount > 0 },
  ], [student, profile, skillCount, projectCount, experienceCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-5">
          <div className="h-44 rounded-3xl bg-slate-200" />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="h-64 rounded-2xl bg-white lg:col-span-2" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
          <div className="h-52 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><CircleAlert size={23} /></div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Unable to load applicant</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Go back</button>
            <button onClick={fetchApplicant} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"><RefreshCw size={15} /> Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const education = profile?.education || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} /> Back to applicants
        </button>

        <header className="relative mb-6 overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-3xl font-bold text-indigo-100 shadow-inner">
              {(student?.name || "S").trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100"><Sparkles size={13} /> Candidate overview</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[currentStatus] || statusStyles.pending}`}>
                  <StatusIcon size={13} /> {formatStatus(currentStatus)}
                </span>
              </div>
              <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">{student?.name || "Applicant profile"}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 break-all"><Mail size={15} /> {student?.email || "Email not available"}</span>
                {profile?.currentYear && <span className="inline-flex items-center gap-2"><GraduationCap size={15} /> Year {profile.currentYear}</span>}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-indigo-200"><BriefcaseBusiness size={20} /></div>
              <div><p className="text-xs text-slate-400">Profile CGPA</p><p className="text-xl font-bold">{profile?.cgpa ?? "—"}<span className="ml-1 text-xs font-medium text-slate-400">/ 10</span></p></div>
            </div>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <CircleAlert size={18} className="mt-0.5 shrink-0" /><p className="flex-1">{error}</p>
            <button onClick={() => setError("")} aria-label="Dismiss error" className="rounded-lg p-1 hover:bg-rose-100"><X size={16} /></button>
          </div>
        )}
        {statusMessage && (
          <div role="status" className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={18} /> {statusMessage}
            <button onClick={() => setStatusMessage("")} aria-label="Dismiss message" className="ml-auto rounded-lg p-1 hover:bg-emerald-100"><X size={16} /></button>
          </div>
        )}

        <div className="grid items-start gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Section icon={UserRound} title="Personal information" subtitle="Contact and academic snapshot.">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem label="Full name" value={student?.name} />
                <InfoItem label="Email address" value={student?.email} />
                <InfoItem label="Current year" value={profile?.currentYear ? `Year ${profile.currentYear}` : undefined} />
                <InfoItem label="CGPA" value={profile?.cgpa != null && profile.cgpa !== "" ? `${profile.cgpa} / 10` : undefined} />
              </div>
            </Section>

            <Section icon={GraduationCap} title="Education" subtitle="Academic background provided by the applicant.">
              {profile?.education && Object.values(education).some((value) => value !== "" && value != null) ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem label="Degree" value={education.degree} />
                  <InfoItem label="Field of study" value={education.field} />
                  <InfoItem label="University / institute" value={education.university} />
                  <InfoItem label="Graduation year" value={education.graduationYear} />
                </div>
              ) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Education information has not been provided.</p>}
            </Section>

            <Section icon={Code2} title="Skills" subtitle={`${skillCount} skill${skillCount === 1 ? "" : "s"} listed`}>
              {skillCount > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={`${skill}-${index}`} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">{skill}</span>
                  ))}
                </div>
              ) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No skills provided.</p>}
            </Section>

            <Section icon={BriefcaseBusiness} title="Projects" subtitle={`${projectCount} project${projectCount === 1 ? "" : "s"} shared`}>
              {projectCount > 0 ? (
                <div className="space-y-4">
                  {profile.projects.map((project, index) => (
                    <article key={project._id || `${project.title}-${index}`} className="rounded-xl border border-slate-200 p-4 sm:p-5">
                      <h3 className="break-words font-bold text-slate-900">{project.title || "Untitled project"}</h3>
                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">{project.description || "No description provided."}</p>
                      {project.technologies?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{project.technologies.map((tech, techIndex) => <span key={`${tech}-${techIndex}`} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{tech}</span>)}</div>}
                      {(project.githubUrl || project.liveUrl) && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-600"> GitHub <ExternalLink size={13} /></a>}
                          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-600"><Globe size={15} /> Live project <ExternalLink size={13} /></a>}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No projects provided.</p>}
            </Section>

            <Section icon={Building2} title="Experience" subtitle={`${experienceCount} experience entr${experienceCount === 1 ? "y" : "ies"} shared`}>
              {experienceCount > 0 ? (
                <div className="space-y-4">
                  {profile.experience.map((experience, index) => (
                    <article key={experience._id || `${experience.title}-${index}`} className="relative rounded-xl border border-slate-200 p-4 pl-5 sm:p-5 sm:pl-6">
                      <div className="absolute bottom-5 left-0 top-5 w-1 rounded-r-full bg-indigo-400" />
                      <h3 className="break-words font-bold text-slate-900">{experience.title || "Role not specified"}</h3>
                      <p className="mt-1 text-sm font-medium text-indigo-600">{experience.organization || "Organization not provided"}</p>
                      <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-600">{experience.description || "No description provided."}</p>
                      <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400"><CalendarDays size={14} /> {formatDate(experience.startDate)} – {experience.endDate ? formatDate(experience.endDate) : "Present"}</p>
                    </article>
                  ))}
                </div>
              ) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No experience provided.</p>}
            </Section>

            <Section icon={FileText} title="Cover letter" subtitle="The applicant's message for this opportunity.">
              <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
                <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-700">{application?.coverLetter || "No cover letter provided."}</p>
              </div>
              {application?.createdAt && <p className="mt-4 text-xs text-slate-400">Applied on {formatDate(application.createdAt)}</p>}
            </Section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><ShieldCheck size={19} /></div>
                <div><h2 className="font-bold text-slate-900">Application decision</h2><p className="mt-1 text-sm text-slate-500">Review and update the current status.</p></div>
              </div>
              <div className={`mb-5 flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold ${statusStyles[currentStatus] || statusStyles.pending}`}>
                <StatusIcon size={17} /> Current status: {formatStatus(currentStatus)}
              </div>
              <div className="space-y-2.5">
                <button type="button" onClick={() => handleStatusChange("shortlisted")} disabled={updating || currentStatus === "shortlisted"} className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50">
                  <Users size={17} /> {updating ? "Updating..." : "Shortlist applicant"}
                </button>
                <button type="button" onClick={() => handleStatusChange("accepted")} disabled={updating || currentStatus === "accepted"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <CheckCircle2 size={17} /> Accept applicant
                </button>
                <button type="button" onClick={() => handleStatusChange("rejected")} disabled={updating || currentStatus === "rejected"} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">
                  <XCircle size={17} /> Reject applicant
                </button>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-400">Status updates are saved to the application. Choose the status that reflects your hiring decision.</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-slate-900">Profile snapshot</h2>
              <p className="mt-1 text-sm text-slate-500">Information available in this profile.</p>
              <div className="mt-5 space-y-4">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    {item.complete ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><CheckCircle2 size={15} /> Added</span> : <span className="text-xs font-medium text-slate-400">Missing</span>}
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm"><span className="text-slate-500">Projects</span><span className="font-semibold text-slate-800">{projectCount}</span></div>
                <div className="mt-3 flex items-center justify-between text-sm"><span className="text-slate-500">Experience entries</span><span className="font-semibold text-slate-800">{experienceCount}</span></div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
