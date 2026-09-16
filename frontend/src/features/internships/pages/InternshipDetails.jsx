import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Clock,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import api from "../../../services/axios";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/internship/${id}`);

        setInternship(response.data.internship);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load internship"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-slate-500">
            Loading internship...
          </p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-medium text-red-600">
              {error || "Internship not found"}
            </p>
          </div>

          <button
            onClick={() => navigate("/internships")}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12">

            <button
              onClick={() => navigate("/internships")}
              className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to internships
            </button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  {internship.domain}
                </p>

                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                  {internship.title}
                </h1>

                <p className="mt-3 text-slate-500">
                  Company
                </p>
              </div>

              <button
              onClick={() => navigate(`/internships/${id}/apply`)}
                className="rounded-xl bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700" 
              >
                Apply Now
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">

              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {internship.location || "Remote"}
              </div>

              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={18} />
                <span className="capitalize">
                  {internship.workMode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <IndianRupee size={18} />
                {internship.stipend?.amount
                  ? `${internship.stipend.amount}/${internship.stipend.period}`
                  : "Unpaid"}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={18} />
                {internship.duration?.value
                  ? `${internship.duration.value} ${internship.duration.unit}`
                  : "Flexible"}
              </div>

            </div>
          </div>
        </section>

        {/* Details */}
        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3">

            {/* Main content */}
            <div className="space-y-8 lg:col-span-2">

              {/* Description */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  About the internship
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                  {internship.description}
                </p>
              </div>

              {/* Required Skills */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Required skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {internship.requiredSkills?.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              {internship.preferredSkills?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Preferred skills
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {internship.preferredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <aside className="space-y-6">

              {/* Eligibility */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Eligibility
                </h2>

                <div className="mt-5 space-y-4 text-sm">

                  {internship.eligibility?.minYear !== undefined && (
                    <div>
                      <p className="text-slate-400">
                        Year
                      </p>
                      <p className="mt-1 font-medium text-slate-700">
                        {internship.eligibility.minYear} -{" "}
                        {internship.eligibility.maxYear}
                      </p>
                    </div>
                  )}

                  {internship.eligibility?.minimumCGPA !== undefined && (
                    <div>
                      <p className="text-slate-400">
                        Minimum CGPA
                      </p>
                      <p className="mt-1 font-medium text-slate-700">
                        {internship.eligibility.minimumCGPA}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Deadline */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={19}
                    className="text-blue-600"
                  />

                  <h2 className="font-bold text-slate-900">
                    Application deadline
                  </h2>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-700">
                  {new Date(
                    internship.applicationDeadline
                  ).toLocaleDateString()}
                </p>
              </div>

            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InternshipDetails;