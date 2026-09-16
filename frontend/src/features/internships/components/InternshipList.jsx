import { useEffect, useState } from "react";
import InternshipCard from "./InternshipCard";
import { getAllInternships } from "../internship.api";

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllInternships();

        setInternships(data.internships || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load internships"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Loading
  if (loading) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-slate-500">
            Loading internships...
          </p>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            EXPLORE OPPORTUNITIES
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Latest Internships
          </h2>

          <p className="mt-2 text-slate-500">
            Explore active internships and find your next opportunity.
          </p>
        </div>

        {/* Internships */}
        {internships.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internships.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="font-semibold text-slate-900">
              No internships available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Check back later for new opportunities.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default InternshipList;