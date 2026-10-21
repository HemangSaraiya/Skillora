
import {
  ArrowUpRight,
  MapPin,
  IndianRupee,
  Clock3,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatDeadline = (date) => {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const InternshipCard = ({ internship }) => {
  const navigate = useNavigate();

  const companyName =
    internship.companyId?.companyName ||
    internship.companyId?.name ||
    internship.company?.companyName ||
    internship.company?.name ||
    "";

  const skills = internship.requiredSkills || [];

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700">
            <BriefcaseBusiness size={22} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-wider text-blue-600">
              {internship.domain || "Internship"}
            </p>
            <h3 className="mt-1 break-words text-lg font-bold leading-6 text-slate-950">
              {internship.title}
            </h3>
            {companyName && (
              <p className="mt-1 truncate text-sm text-slate-500">
                {companyName}
              </p>
            )}
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
          {internship.workMode || "Flexible"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <IndianRupee size={14} />
            Stipend
          </div>
          <p className="mt-1.5 text-sm font-semibold text-slate-800">
            {internship.stipend?.amount != null &&
            internship.stipend.amount !== ""
              ? `₹${Number(internship.stipend.amount).toLocaleString("en-IN")}`
              : "Unpaid"}
            {internship.stipend?.amount != null &&
              internship.stipend.amount !== "" && (
                <span className="font-normal text-slate-500">
                  /{internship.stipend?.period || "month"}
                </span>
              )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock3 size={14} />
            Duration
          </div>
          <p className="mt-1.5 text-sm font-semibold capitalize text-slate-800">
            {internship.duration?.value
              ? `${internship.duration.value} ${internship.duration.unit || ""}`
              : "Not specified"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 text-sm text-slate-500">
        <MapPin size={16} className="mt-0.5 shrink-0" />
        <span>{internship.location || "Location not specified"}</span>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Required skills
        </p>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-blue-100 bg-blue-50/70 px-2.5 py-1.5 text-xs font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}

            {skills.length > 4 && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No specific skills listed
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-6">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays size={14} />
            Deadline
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {formatDeadline(internship.applicationDeadline)}
          </p>
        </div>

        <button
          onClick={() => navigate(`/internships/${internship._id}`)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-600"
        >
          Details
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
};

export default InternshipCard;
