import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowLeft,
  ArrowUpDown,
  BriefcaseBusiness,
  RotateCw,
  MapPin,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import InternshipCard from "../components/InternshipCard";
import { getAllInternships } from "../internship.api";


const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "stipend-high", label: "Highest stipend" },
  { value: "stipend-low", label: "Lowest stipend" },
];

const normalize = (value) => String(value ?? "").toLowerCase().trim();

const getCompanyName = (internship) =>
  internship.companyId?.companyName ||
  internship.companyId?.name ||
  internship.company?.companyName ||
  internship.company?.name ||
  "";

const getStipend = (internship) => {
  const amount = Number(internship.stipend?.amount ?? internship.stipend ?? 0);
  return Number.isFinite(amount) ? amount : 0;
};


const getCreatedTime = (internship) => {
  const value = new Date(internship.createdAt || internship.updatedAt || 0).getTime();
  return Number.isFinite(value) ? value : 0;
};

const Internships = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [domain, setDomain] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);


  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Update the URL as the search changes, without adding a history entry per keystroke.
  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    const value = search.trim();

    if (value) nextParams.set("search", value);
    else nextParams.delete("search");

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [search, searchParams, setSearchParams]);

  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllInternships();
      setInternships(Array.isArray(data?.internships) ? data.internships : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "We couldn't load internships. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const domains = useMemo(
    () =>
      [...new Set(internships.map((internship) => internship.domain).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [internships]
  );

  const filteredInternships = useMemo(() => {
    const searchValue = normalize(search);

    const filtered = internships.filter((internship) => {
      const searchableValues = [
        internship.title,
        internship.domain,
        internship.description,
        internship.location,
        internship.workMode,
        getCompanyName(internship),
        ...(Array.isArray(internship.requiredSkills) ? internship.requiredSkills : []),
        ...(Array.isArray(internship.preferredSkills) ? internship.preferredSkills : []),
      ];

      const matchesSearch =
        !searchValue || searchableValues.some((value) => normalize(value).includes(searchValue));

      const matchesDomain = domain === "all" || internship.domain === domain;
      const matchesWorkMode =
        workMode === "all" || normalize(internship.workMode) === normalize(workMode);

      return matchesSearch && matchesDomain && matchesWorkMode;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return getCreatedTime(a) - getCreatedTime(b);
        case "title-asc":
          return String(a.title || "").localeCompare(String(b.title || ""));
        case "stipend-high":
          return getStipend(b) - getStipend(a);
        case "stipend-low":
          return getStipend(a) - getStipend(b);
        case "newest":
        default:
          return getCreatedTime(b) - getCreatedTime(a);
      }
    });
  }, [internships, search, domain, workMode, sortBy]);

  const hasFilters = Boolean(search.trim()) || domain !== "all" || workMode !== "all";
  const activeFilterCount = Number(Boolean(search.trim())) + Number(domain !== "all") + Number(workMode !== "all");

  const clearFilters = () => {
    setSearch("");
    setDomain("all");
    setWorkMode("all");
  };

  const removeFilter = (filter) => {
    if (filter === "search") setSearch("");
    if (filter === "domain") setDomain("all");
    if (filter === "workMode") setWorkMode("all");
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        {/* Intro banner */}
        <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
          <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-4"
            >
              <ArrowLeft size={17} />
              Back to home
            </button>

            <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                  <Sparkles size={14} />
                  Explore opportunities
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Find work that moves
                  <span className="block text-blue-600">your future forward.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Explore internships, compare opportunities, and find a role that fits your skills and goals.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:min-w-52">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <BriefcaseBusiness size={21} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {loading ? "—" : internships.length}
                  </p>
                  <p className="text-sm text-slate-500">Available listings</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
                <Search size={19} className="shrink-0 text-slate-400" />
                <span className="sr-only">Search internships</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by role, company, skill, or keyword..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={17} />
                  </button>
                )}
              </label>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <label className="relative">
                  <span className="sr-only">Filter by domain</span>
                  <select
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    className="h-full min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 sm:min-w-40 sm:pl-4"
                  >
                    <option value="all">All domains</option>
                    {domains.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </label>

                <label className="relative">
                  <span className="sr-only">Filter by work mode</span>
                  <select
                    value={workMode}
                    onChange={(event) => setWorkMode(event.target.value)}
                    className="h-full min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 sm:min-w-40 sm:pl-4"
                  >
                    <option value="all">Any work mode</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </label>

                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:col-span-1"
                  aria-expanded={filtersOpen}
                >
                  <SlidersHorizontal size={17} />
                  Sort & options
                  <ChevronDown size={15} className={`transition ${filtersOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Sort opportunities</p>
                  <p className="mt-1 text-xs text-slate-500">Choose how you want to browse the results.</p>
                </div>
                <label className="flex items-center gap-3">
                  <ArrowUpDown size={17} className="text-slate-400" />
                  <span className="sr-only">Sort internships</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 sm:min-w-52"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500" aria-live="polite">
                {loading ? (
                  "Finding opportunities…"
                ) : (
                  <>
                    <span className="font-semibold text-slate-900">{filteredInternships.length}</span>{" "}
                    {filteredInternships.length === 1 ? "opportunity" : "opportunities"}
                    {hasFilters ? " match your filters" : " to explore"}
                  </>
                )}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                >
                  <X size={15} />
                  Clear all
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs">{activeFilterCount}</span>
                </button>
              )}
            </div>

            {hasFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {search.trim() && (
                  <button type="button" onClick={() => removeFilter("search")} className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                    Search: {search.trim()} <X size={13} />
                  </button>
                )}
                {domain !== "all" && (
                  <button type="button" onClick={() => removeFilter("domain")} className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                    {domain} <X size={13} />
                  </button>
                )}
                {workMode !== "all" && (
                  <button type="button" onClick={() => removeFilter("workMode")} className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium capitalize text-blue-700 hover:bg-blue-100">
                    {workMode === "onsite" ? "On-site" : workMode} <X size={13} />
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!loading && !error && filteredInternships.length > 0 && (
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {hasFilters ? "Matching opportunities" : "Explore internships"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review the details and choose the opportunities that fit you best.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/3 rounded bg-slate-200" />
                        <div className="h-4 w-2/3 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="mt-6 h-5 w-4/5 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
                    <div className="mt-6 flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-slate-100" />
                      <div className="h-6 w-20 rounded-full bg-slate-100" />
                    </div>
                    <div className="mt-7 h-10 rounded-lg bg-slate-100" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <RotateCw size={21} />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900">Couldn't load internships</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
                <button
                  type="button"
                  onClick={fetchInternships}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <RotateCw size={16} />
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredInternships.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInternships.map((internship) => (
                  <InternshipCard key={internship._id} internship={internship} />
                ))}
              </div>
            )}

            {!loading && !error && filteredInternships.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center sm:px-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  {hasFilters ? <Search size={23} /> : <MapPin size={23} />}
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {hasFilters ? "No matches just yet" : "No internships available"}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {hasFilters
                    ? "Try a different keyword or remove one of your filters to see more opportunities."
                    : "There aren't any published internship opportunities to show right now. Please check back soon."}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold text-slate-700">Skillora</p>
          <p>Discover opportunities. Build what’s next.</p>
        </div>
      </footer>
    </div>
  );
};

export default Internships;