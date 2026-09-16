import { useEffect, useState } from "react";
import RecommendationCard from "./RecommendationCard";
import { getRecommendations } from "../recommendation.api";
import { useAuth } from "../../../context/Authcontext";

const RecommendationList = () => {
  const { user, loading: authLoading } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Wait until AuthContext finishes checking authentication
    if (authLoading) {
      return;
    }

    // Only students should get recommendations
    if (!user || user.role !== "student") {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRecommendations();

        setRecommendations(data.recommendations || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load recommendations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, authLoading]);

  // Don't show anything for logged-out users
  // or non-student users.
  if (!authLoading && (!user || user.role !== "student")) {
    return null;
  }

  // Auth is still loading
  if (authLoading || loading) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-slate-500">
            Finding internships for you...
          </p>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900">
              No personalized recommendations yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Explore the internships below and complete your profile
              to get personalized recommendations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No recommendations
  if (recommendations.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600">
              PERSONALIZED FOR YOU
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Recommended Internships
            </h2>

            <p className="mt-2 text-slate-500">
              Complete your profile and add your skills to get
              personalized recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="font-semibold text-slate-900">
              No personalized matches yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Browse the active internships below and update your
              profile to improve your recommendations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              PERSONALIZED FOR YOU
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Recommended Internships
            </h2>

            <p className="mt-2 text-slate-500">
              Opportunities matched with your skills and profile.
            </p>
          </div>

          <button className="hidden text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:block">
            View all →
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.slice(0, 3).map((recommendation) => (
            <RecommendationCard
              key={recommendation.internship._id}
              recommendation={recommendation}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecommendationList;