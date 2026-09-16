import {
  ArrowUpRight,
  MapPin,
  IndianRupee,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const InternshipCard = ({ internship }) => {
  const navigate = useNavigate();
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">
            {internship.domain}
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {internship.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Company
          </p>
        </div>

        {/* Work mode */}
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
          {internship.workMode}
        </span>
      </div>

      {/* Details */}
      <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">

        <div className="flex items-center gap-1.5">
          <MapPin size={16} />
          {internship.location || "Remote"}
        </div>

        <div className="flex items-center gap-1.5">
          <IndianRupee size={16} />
          {internship.stipend?.amount
            ? `${internship.stipend.amount}/month`
            : "Unpaid"}
        </div>

        <div className="flex items-center gap-1.5">
          <Clock size={16} />
          {internship.duration?.value
            ? `${internship.duration.value} ${internship.duration.unit}`
            : "Flexible"}
        </div>

      </div>

      {/* Skills */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Required skills
        </p>

        <div className="flex flex-wrap gap-2">
          {internship.requiredSkills?.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

        <div>
          <p className="text-xs text-slate-400">
            Application deadline
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {new Date(
              internship.applicationDeadline
            ).toLocaleDateString()}
          </p>
        </div>

        <button
         onClick={() => navigate(`/internships/${internship._id}`)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition group-hover:bg-blue-600"
        >
          View Details
          <ArrowUpRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default InternshipCard;