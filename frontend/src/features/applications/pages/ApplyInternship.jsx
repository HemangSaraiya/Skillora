import {useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import { createApplication } from "../application.api";
import { useAuth } from "../../../context/Authcontext";
const ApplyInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const { user, loading: authLoading } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
useEffect(() => {
  if (!authLoading && !user) {
    navigate(`/login?redirect=/internships/${id}/apply`);
  }
}, [authLoading, user, id, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createApplication({
        internshipId: id,
        coverLetter,
      });

      navigate("/applications");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };
if (authLoading) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-slate-500">
          Checking your account...
        </p>
      </div>
    </div>
  );
}


if (!user) {
  return null;
}
if (user.role !== "student") {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Students only
        </h1>

        <p className="mt-2 text-slate-500">
          Only students can apply for internships.
        </p>

        <button
          onClick={() => navigate(`/internships/${id}`)}
          className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Back to internship
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
          <div className="mx-auto max-w-3xl px-6 py-12">

            <button
              onClick={() => navigate(`/internships/${id}`)}
              className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to internship
            </button>

            <p className="text-sm font-semibold text-blue-600">
              APPLICATION
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Apply for this internship
            </h1>

            <p className="mt-3 text-slate-500">
              Tell the company why you're interested in this opportunity.
            </p>

          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-3xl px-6">

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <div>
                <label
                  htmlFor="coverLetter"
                  className="text-sm font-semibold text-slate-700"
                >
                  Cover Letter
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Briefly explain your skills, experience, and why you're
                  interested in this internship.
                </p>

                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={10}
                  placeholder="Write your cover letter..."
                  className="mt-4 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">

                <button
                  type="button"
                  onClick={() => navigate(`/internships/${id}`)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />

                  {loading
                    ? "Submitting..."
                    : "Submit Application"}
                </button>

              </div>

            </form>

          </div>
        </section>
      </main>
    </div>
  );
};

export default ApplyInternship;