
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecommendationCard from "./RecommendationCard";
import { getRecommendations } from "../recommendation.api";
import { useAuth } from "../../../context/Authcontext";

const RecommendationList = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "student") {
      setLoading(false);
      setRecommendations([]);
      return;
    }

    let active = true;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRecommendations();

        if (active) {
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "We couldn't load your recommendations."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  // Never show recommendations to companies, admins, or logged-out visitors.
  if (authLoading || !user || user.role !== "student") {
    return null;
  }

  const retry = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't load your recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="recommendations"
      className="scroll-mt-24 border-b border-slate-200 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
              <Sparkles size={14} />
              Personalized opportunities
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Recommended for you
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-slate-500">
              Explore opportunities based on your skills and profile.
            </p>
          </div>

          <button
            onClick={() => navigate("/internships")}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            Browse all internships
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 p-6"
              >
                <div className="h-5 w-24 rounded bg-slate-200" />
                <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-5 h-16 rounded-xl bg-slate-100" />
                <div className="mt-5 h-10 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h3 className="font-bold text-slate-900">
              Recommendations are temporarily unavailable
            </h3>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              onClick={retry}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <UserRound size={25} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No matches to show yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your skills and career interests to your profile, then
              check back for personalized internship recommendations.
            </p>

            <button
              onClick={() => navigate("/student/profile")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Update my profile
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((recommendation) => (
              <RecommendationCard
                key={recommendation.internship._id}
                recommendation={recommendation}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendationList;
