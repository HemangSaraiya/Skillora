import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X ,ArrowLeft} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import InternshipCard from "../components/InternshipCard";
import { getAllInternships } from "../internship.api";
import { useNavigate } from "react-router-dom";
const Internships = () => {
    const navigate=useNavigate()
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [workMode, setWorkMode] = useState("all");

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

  // Get unique domains from internships
  const domains = useMemo(() => {
    return [
      ...new Set(
        internships
          .map((internship) => internship.domain)
          .filter(Boolean)
      ),
    ];
  }, [internships]);

  // Filter internships
  const filteredInternships = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return internships.filter((internship) => {
      const matchesSearch =
        !searchValue ||
        internship.title?.toLowerCase().includes(searchValue) ||
        internship.domain?.toLowerCase().includes(searchValue) ||
        internship.description
          ?.toLowerCase()
          .includes(searchValue) ||
        internship.requiredSkills?.some((skill) =>
          skill.toLowerCase().includes(searchValue)
        );

      const matchesDomain =
        domain === "all" ||
        internship.domain === domain;

      const matchesWorkMode =
        workMode === "all" ||
        internship.workMode === workMode;

      return (
        matchesSearch &&
        matchesDomain &&
        matchesWorkMode
      );
    });
  }, [internships, search, domain, workMode]);

  const clearFilters = () => {
    setSearch("");
    setDomain("all");
    setWorkMode("all");
  };

  const hasFilters =
    search !== "" ||
    domain !== "all" ||
    workMode !== "all";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
        <button
              onClick={() => navigate("/")}
              className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Home
            </button>
            <p className="text-sm font-semibold text-blue-600">
              EXPLORE OPPORTUNITIES
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Find your next internship
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500">
              Search and explore active internship opportunities
              that match your skills and career goals.
            </p>

          </div>
        </section>

        {/* Search + Filters */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6">

            <div className="flex flex-col gap-4 lg:flex-row">

              {/* Search */}
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 focus-within:border-blue-500">
                <Search
                  size={20}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search internships, skills, or domains..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Domain */}
              <div className="flex items-center gap-3">
                <SlidersHorizontal
                  size={18}
                  className="hidden text-slate-400 sm:block"
                />

                <select
                  value={domain}
                  onChange={(e) =>
                    setDomain(e.target.value)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">
                    All Domains
                  </option>

                  {domains.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                {/* Work mode */}
                <select
                  value={workMode}
                  onChange={(e) =>
                    setWorkMode(e.target.value)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">
                    All Work Modes
                  </option>

                  <option value="remote">
                    Remote
                  </option>

                  <option value="hybrid">
                    Hybrid
                  </option>

                  <option value="onsite">
                    Onsite
                  </option>
                </select>
              </div>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredInternships.length}
                  </span>{" "}
                  results
                </p>

                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Internship Results */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6">

            {!hasFilters && (
              <div className="mb-6">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {internships.length}
                  </span>{" "}
                  active internships
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="py-20 text-center">
                <p className="text-slate-500">
                  Loading internships...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Results */}
            {!loading &&
              !error &&
              filteredInternships.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredInternships.map(
                    (internship) => (
                      <InternshipCard
                        key={internship._id}
                        internship={internship}
                      />
                    )
                  )}
                </div>
              )}

            {/* No results */}
            {!loading &&
              !error &&
              filteredInternships.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Search
                      size={22}
                      className="text-slate-400"
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No internships found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>

                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Clear filters
                    </button>
                  )}

                </div>
              )}

          </div>
        </section>
      </main>
    </div>
  );
};

export default Internships;