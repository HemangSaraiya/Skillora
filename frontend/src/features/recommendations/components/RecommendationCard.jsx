import React from 'react'
import { ArrowUpRight, MapPin, IndianRupee } from "lucide-react";
const RecommendationCard = ({recommendation}) => {
    const { internship, score, matchedRequiredSkills, matchedPreferredSkills } =
    recommendation;
  return (
    <div>
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

        {/* Match Score */}
        <div className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
          {score}% Match
        </div>
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

      </div>

      {/* Skills */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Matching skills
        </p>

        <div className="flex flex-wrap gap-2">
          {matchedRequiredSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {skill}
            </span>
          ))}

          {matchedPreferredSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
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
            {new Date(internship.applicationDeadline).toLocaleDateString()}
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition group-hover:bg-blue-600">
          View Details
          <ArrowUpRight size={16} />
        </button>

      </div>
    </div>
    </div>
  )
}

export default RecommendationCard
