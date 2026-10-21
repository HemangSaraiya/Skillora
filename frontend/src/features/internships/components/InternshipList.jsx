
import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InternshipCard from "./InternshipCard";
import { getAllInternships } from "../internship.api";

const InternshipList = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllInternships();
      setInternships(data.internships || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load internships."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <section id="internships" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Explore opportunities
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Latest internships
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-slate-500">
              Discover opportunities, build practical experience, and take
              your next career step.
            </p>
          </div>

          {!loading && !error && internships.length > 0 && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
              <BriefcaseBusiness size={16} className="text-blue-600" />
              {internships.length} {internships.length === 1 ? "opportunity" : "opportunities"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-8 h-4 w-full rounded bg-slate-100" />
                <div className="mt-3 h-4 w-4/5 rounded bg-slate-100" />
                <div className="mt-8 h-10 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-slate-900">
              We couldn't load internships
            </p>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              onClick={fetchInternships}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : internships.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {internships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BriefcaseBusiness size={25} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No internships available yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              New opportunities will appear here when companies publish them.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InternshipList;
