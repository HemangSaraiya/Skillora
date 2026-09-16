import React from "react";
import {
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle2,
  MapPin,
  IndianRupee,
  BriefcaseBusiness,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isStudent = user?.role === "student";

  const handleExplore = () => {
    navigate("/internships");
  };

  const handleHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-20">

        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles size={16} />

            {isStudent
              ? "Opportunities matched for your journey"
              : "Find opportunities that fit you"}
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {isStudent ? (
              <>
                Discover internships
                <span className="block text-blue-600">
                  built around you.
                </span>
              </>
            ) : (
              <>
                Your skills deserve
                <span className="block text-blue-600">
                  the right opportunity.
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Skillora helps students discover internships based on their
            skills, interests, eligibility, and career goals.
          </p>

          {/* Search Box */}
          <div className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:flex-row">
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search
                size={20}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search internships, skills, or domains..."
                className="w-full bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleExplore}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Search
              <ArrowRight size={18} />
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleExplore}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Explore Internships
              <ArrowRight size={17} />
            </button>

            <button
              onClick={handleHowItWorks}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              How Skillora Works
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
              Skill-based matching
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
              Eligibility-aware
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
              Student focused
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT PRODUCT PREVIEW
        ====================================================== */}

        <div className="relative hidden lg:block">

          {/* Glow */}
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

          {/* =================================================
              STUDENT VERSION
          ================================================== */}

          {isStudent ? (
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm text-slate-500">
                    Personalized for you
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Internship Matches
                  </h2>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                  <Sparkles size={15} />
                  Smart Match
                </div>
              </div>

              {/* Recommendation Preview */}
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/40 p-5">

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Recommended
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      MERN Stack Developer Intern
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Technology Company
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
                    Great Match
                  </div>
                </div>

                {/* Internship details */}
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">

                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    Bangalore
                  </div>

                  <div className="flex items-center gap-1.5">
                    <IndianRupee size={15} />
                    ₹25K/month
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={15} />
                    Hybrid
                  </div>

                </div>

                {/* Skills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "React",
                    "Node.js",
                    "MongoDB",
                    "Express",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* View button */}
                <button
                  onClick={handleExplore}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  View Internship
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Bottom cards */}
              <div className="mt-4 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Skills matched
                    </p>

                    <CheckCircle2
                      size={17}
                      className="text-emerald-500"
                    />
                  </div>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    Skill fit
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on your profile
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Profile strength
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    85%
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[85%] rounded-full bg-blue-600" />
                  </div>
                </div>

              </div>

            </div>
          ) : (

            /* =================================================
               LOGGED OUT / COMPANY / ADMIN VERSION
            ================================================== */

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm text-slate-500">
                    Explore opportunities
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Find your next internship
                  </h2>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                  <BriefcaseBusiness size={15} />
                  Opportunities
                </div>
              </div>

              {/* Internship preview */}
              <div className="mt-6 rounded-2xl border border-slate-200 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Featured opportunity
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  MERN Stack Developer Intern
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Build real-world web applications
                </p>

                {/* Details */}
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">

                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    Bangalore
                  </div>

                  <div className="flex items-center gap-1.5">
                    <IndianRupee size={15} />
                    ₹25K/month
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={15} />
                    Hybrid
                  </div>

                </div>

                {/* Skills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "React",
                    "Node.js",
                    "MongoDB",
                    "Express",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={handleExplore}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Explore Internships
                  <ArrowRight size={16} />
                </button>

              </div>

              {/* Bottom cards */}
              <div className="mt-4 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Work modes
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    Remote · Hybrid
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Find what works for you
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Matching
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-emerald-500"
                    />

                    <span className="font-semibold text-slate-900">
                      Skill based
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Personalized after profile setup
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Hero;