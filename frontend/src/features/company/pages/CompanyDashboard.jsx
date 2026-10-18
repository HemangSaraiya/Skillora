
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import api from "../../../services/axios";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/internship/company-stats");

      setStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching company statistics:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Internships",
      value: stats.totalInternships,
      description: "Internships you have posted",
      color: "text-blue-600",
    },
    {
      title: "Active Internships",
      value: stats.activeInternships,
      description: "Currently available opportunities",
      color: "text-emerald-600",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      description: "Applications received",
      color: "text-violet-600",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      description: "Applications awaiting review",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {user?.name}
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your internships and applicants from here.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Statistics"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p>{error}</p>
            <button
              onClick={fetchStats}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <p className={`mt-3 text-3xl font-bold ${card.color}`}>
                {loading ? "—" : card.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* My Internships */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              My Internships
            </h2>

            <p className="text-slate-500 mt-2">
              View and manage the internships you have posted.
            </p>

            <button
              onClick={() => navigate("/company/my-internships")}
              className="mt-5 px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              View My Internships
            </button>
          </div>

          {/* Post Internship */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              Post Internship
            </h2>

            <p className="text-slate-500 mt-2">
              Create a new internship opportunity for students.
            </p>

            <button
              onClick={() => navigate("/company/internships/create")}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post Internship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
