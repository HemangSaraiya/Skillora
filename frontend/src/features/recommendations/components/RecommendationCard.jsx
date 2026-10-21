
import {
  ArrowUpRight,
  MapPin,
  IndianRupee,
  Clock3,
  CalendarDays,
  Sparkles,
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

const RecommendationCard = ({ recommendation }) => {
  const navigate = useNavigate();

  const {
    internship,
    score,
    matchedRequiredSkills = [],
    matchedPreferredSkills = [],
  } = recommendation;

  if (!internship) return null;

  const matchScore = Number(score);
  const validScore = Number.isFinite(matchScore)
    ? Math.max(0, Math.min(100, matchScore))
    : null;

  const companyName =
    internship.companyId?.companyName ||
    internship.companyId?.name ||
    internship.company?.companyName ||
    internship.company?.name ||
    "";

  const allMatchedSkills = [
    ...new Set([
      ...matchedRequiredSkills,
      ...matchedPreferredSkills,
    ]),
  ];

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-blue-100 text-violet-700">
            <Sparkles size={22} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-wider text-violet-700">
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

        {validScore !== null && (
          <div className="shrink-0 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-center">
            <p className="text-lg font-bold leading-none text-emerald-700">
              {validScore}%
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
              Match
            </p>
          </div>
        )}
      </div>

      {validScore !== null && (
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500"
            style={{ width: `${validScore}%` }}
          />
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
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
            Work mode
          </div>
          <p className="mt-1.5 text-sm font-semibold capitalize text-slate-800">
            {internship.workMode || "Not specified"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
        <MapPin size={16} className="mt-0.5 shrink-0" />
        <span>{internship.location || "Location not specified"}</span>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Your matching skills
        </p>

        {allMatchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allMatchedSkills.slice(0, 5).map((skill) => {
              const isRequired = matchedRequiredSkills.includes(skill);

              return (
                <span
                  key={skill}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                    isRequired
                      ? "border-blue-100 bg-blue-50 text-blue-700"
                      : "border-violet-100 bg-violet-50 text-violet-700"
                  }`}
                >
                  {skill}
                </span>
              );
            })}

            {allMatchedSkills.length > 5 && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                +{allMatchedSkills.length - 5} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Your profile may need more skills to show a detailed match.
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
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-violet-600"
        >
          View details
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
};

export default RecommendationCard;
