import { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { getMyApplications } from "../application.api";

const Applications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyApplications();

        setApplications(response.applications || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setApplications([]);
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to fetch applications"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200";

      case "shortlisted":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-12">

            <button
              onClick={() => navigate("/")}
              className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to home
            </button>

            <p className="text-sm font-semibold text-blue-600">
              APPLICATIONS
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              My Applications
            </h1>

            <p className="mt-3 text-slate-500">
              Track the internships you have applied for.
            </p>

          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-6">

            {loading && (
              <div className="py-20 text-center">
                <p className="text-slate-500">
                  Loading your applications...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && applications.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <Briefcase
                  size={40}
                  className="mx-auto text-slate-400"
                />

                <h2 className="mt-4 text-xl font-semibold text-slate-900">
                  No applications yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  You haven't applied for any internships yet.
                </p>

                <button
                  onClick={() => navigate("/internships")}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Browse Internships
                </button>
              </div>
            )}

            {!loading && !error && applications.length > 0 && (
              <div className="space-y-5">
                {applications.map((application) => {
                  const internship = application.internshipId;

                  return (
                    <div
                      key={application._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            {internship?.domain || "Internship"}
                          </p>

                          <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {internship?.title || "Internship"}
                          </h2>

                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                            {internship?.workMode && (
                              <div className="flex items-center gap-1.5">
                                <Briefcase size={15} />
                                {internship.workMode}
                              </div>
                            )}

                            {application.createdAt && (
                              <div className="flex items-center gap-1.5">
                                <CalendarDays size={15} />
                                Applied{" "}
                                {new Date(
                                  application.createdAt
                                ).toLocaleDateString()}
                              </div>
                            )}

                          </div>
                        </div>

                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-sm font-medium capitalize ${getStatusStyle(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <button
                          onClick={() =>
                            navigate(
                              `/internships/${internship?._id}`
                            )
                          }
                          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                          View Internship →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
};

export default Applications;