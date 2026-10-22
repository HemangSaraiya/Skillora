import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Code2,
  FileText,
  MapPin,
  Plus,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import api from "../../../services/axios";

const skillOptions = [
  "JavaScript", "TypeScript", "React", "Node.js", "Express.js", "MongoDB",
  "HTML", "CSS", "Tailwind CSS", "Python", "Java", "C++", "SQL", "Git",
  "REST API", "Docker", "AWS", "Machine Learning",
];

const initialForm = {
  title: "",
  description: "",
  domain: "",
  requiredSkills: [],
  preferredSkills: [],
  location: "",
  workMode: "remote",
  durationValue: "3",
  durationUnit: "months",
  stipendAmount: "0",
  stipendPeriod: "monthly",
  applicationDeadline: "",
  minYear: "1",
  maxYear: "4",
  minimumCGPA: "0",
  status: "draft",
};

const inputClass =
  "mt-2.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";
const labelClass = "block text-sm font-semibold text-slate-700";

const SectionHeading = ({ icon: Icon, eyebrow, title, description }) => (
  <div className="mb-5 flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
      <Icon size={19} />
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-indigo-600">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-bold text-slate-950 sm:text-xl">{title}</h2>
      {description && <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>}
    </div>
  </div>
);

const CreateInternship = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skillSearch, setSkillSearch] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSkillChange = (skill, type, checked) => {
    setFormData((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], skill]
        : prev[type].filter((item) => item !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim() || !formData.domain.trim() || !formData.description.trim()) {
      setError("Please complete the title, domain, and description.");
      return;
    }
    if (formData.requiredSkills.length === 0) {
      setError("Please select at least one required skill.");
      return;
    }
    if (Number(formData.minYear) > Number(formData.maxYear)) {
      setError("Minimum eligible year cannot exceed maximum year.");
      return;
    }
    if (!formData.applicationDeadline || new Date(formData.applicationDeadline) <= new Date()) {
      setError("Application deadline must be in the future.");
      return;
    }
    if (
      Number(formData.durationValue) <= 0 ||
      !Number.isFinite(Number(formData.durationValue)) ||
      Number(formData.stipendAmount) < 0 ||
      !Number.isFinite(Number(formData.stipendAmount)) ||
      Number(formData.minimumCGPA) < 0 ||
      Number(formData.minimumCGPA) > 10
    ) {
      setError("Check the duration, stipend, and CGPA values.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        domain: formData.domain.trim(),
        requiredSkills: formData.requiredSkills,
        preferredSkills: formData.preferredSkills,
        location: formData.location.trim(),
        workMode: formData.workMode,
        duration: {
          value: Number(formData.durationValue),
          unit: formData.durationUnit,
        },
        stipend: {
          amount: Number(formData.stipendAmount),
          currency: "INR",
          period: formData.stipendPeriod,
        },
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
        eligibility: {
          minYear: Number(formData.minYear),
          maxYear: Number(formData.maxYear),
          minimumCGPA: Number(formData.minimumCGPA),
        },
        status: formData.status,
      };

      const response = await api.post("/internship", payload);
      const createdInternship = response.data?.internship;
      if (!createdInternship?._id) {
        setSuccess("Internship created successfully!");
        navigate("/company/my-internships", {
          state: { message: "Internship created successfully!" },
        });
        return;
      }
      navigate(`/company/internships/${createdInternship._id}`, {
        state: { message: "Internship created successfully!" },
      });
    } catch (err) {
      console.error("Error creating internship:", err);
      setError(err.response?.data?.message || "Failed to create internship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skillOptions.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase().trim())
  );

  const renderSkillOptions = (type) => {
    const isRequired = type === "requiredSkills";
    return (
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            {isRequired ? "Candidates should have these skills." : "Helpful extras, but not essential."}
          </p>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {formData[type].length} selected
          </span>
        </div>
        {isRequired && (
          <div className="relative mb-3">
            <Code2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Find a skill..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(isRequired ? filteredSkills : skillOptions).map((skill) => {
            const selected = formData[type].includes(skill);
            return (
              <label
                key={`${type}-${skill}`}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  selected
                    ? "border-indigo-300 bg-indigo-50/70 ring-1 ring-indigo-200"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => handleSkillChange(skill, type, e.target.checked)}
                  className="sr-only"
                />
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-transparent"
                }`}>
                  <Check size={13} strokeWidth={3} />
                </span>
                <span className={`text-sm ${selected ? "font-semibold text-indigo-900" : "text-slate-700"}`}>{skill}</span>
              </label>
            );
          })}
        </div>
        {isRequired && filteredSkills.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No skills match your search.</p>
        )}
      </div>
    );
  };

  const field = (name, label, options) => (
    <label className={labelClass}>
      {label}
      {options}
    </label>
  );

  const minDeadline = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <button
          type="button"
          onClick={() => navigate("/company/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <div className="mb-8 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-900/10">
          <div className="relative px-6 py-8 sm:px-9 sm:py-10">
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
            <div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                  <Sparkles size={14} /> Company hiring workspace
                </span>
                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Post an internship</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Share a meaningful opportunity, define the skills you need, and help students take their next step.
                </p>
              </div>
              <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-indigo-200 sm:flex">
                <BriefcaseBusiness size={38} />
              </div>
            </div>
            <div className="relative mt-7 flex flex-wrap gap-3 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2"><FileText size={14} /> Role details</span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2"><Code2 size={14} /> Skills & eligibility</span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2"><Clock3 size={14} /> Deadline & status</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading icon={FileText} eyebrow="Step 01" title="Basic information" description="Start with a clear title and explain what the intern will work on." />
            <div className="grid gap-5">
              {field("title", "Internship title *", (
                <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. MERN Stack Developer Intern" required maxLength={150} />
              ))}
              {field("domain", "Domain *", (
                <input name="domain" value={formData.domain} onChange={handleChange} className={inputClass} placeholder="e.g. Full Stack Development" required maxLength={100} />
              ))}
              {field("description", "Role description *", (
                <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} resize-y`} rows={5} placeholder="Describe responsibilities, projects, expectations, and what the intern will learn." required maxLength={10000} />
              ))}
              <p className="-mt-3 text-right text-xs text-slate-400">{formData.description.length} characters</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading icon={Code2} eyebrow="Step 02" title="Skills & expertise" description="Choose the essentials and optionally add bonus skills." />
            <h3 className="mb-3 text-sm font-bold text-slate-800">Required skills <span className="text-rose-500">*</span></h3>
            {renderSkillOptions("requiredSkills")}
            <div className="my-7 border-t border-slate-100" />
            <h3 className="mb-3 text-sm font-bold text-slate-800">Preferred skills <span className="font-normal text-slate-400">(optional)</span></h3>
            {renderSkillOptions("preferredSkills")}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading icon={MapPin} eyebrow="Step 03" title="Work details" description="Set expectations for where and how the internship will happen." />
            <div className="grid gap-5 sm:grid-cols-2">
              {field("location", "Location", (
                <input name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. Bengaluru, India" />
              ))}
              {field("workMode", "Work mode *", (
                <select name="workMode" value={formData.workMode} onChange={handleChange} className={inputClass} required>
                  <option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option>
                </select>
              ))}
              {field("durationValue", "Duration *", (
                <div className="relative">
                  <input type="number" name="durationValue" value={formData.durationValue} onChange={handleChange} min="1" step="1" className={`${inputClass} pr-16`} required />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">length</span>
                </div>
              ))}
              {field("durationUnit", "Duration unit *", (
                <select name="durationUnit" value={formData.durationUnit} onChange={handleChange} className={inputClass} required>
                  <option value="weeks">Weeks</option><option value="months">Months</option>
                </select>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading icon={Wallet} eyebrow="Step 04" title="Stipend" description="Be transparent about compensation for the role." />
            <div className="grid gap-5 sm:grid-cols-2">
              {field("stipendAmount", "Stipend amount (INR) *", (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                  <input type="number" name="stipendAmount" value={formData.stipendAmount} onChange={handleChange} min="0" step="1" className={`${inputClass} pl-9`} required />
                </div>
              ))}
              {field("stipendPeriod", "Payment type *", (
                <select name="stipendPeriod" value={formData.stipendPeriod} onChange={handleChange} className={inputClass} required>
                  <option value="monthly">Per month</option><option value="total">Total for internship</option><option value="unpaid">Unpaid</option>
                </select>
              ))}
            </div>
            {formData.stipendPeriod === "unpaid" && <p className="mt-3 text-xs text-amber-700">This listing will be marked as unpaid. The amount field will still be sent to the API as entered.</p>}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading icon={Check} eyebrow="Step 05" title="Eligibility" description="Specify which academic years and CGPA are suitable for the role." />
            <div className="grid gap-5 sm:grid-cols-3">
              {field("minYear", "Minimum year *", (
                <select name="minYear" value={formData.minYear} onChange={handleChange} className={inputClass} required>
                  {[1, 2, 3, 4].map((year) => <option key={year} value={year}>Year {year}</option>)}
                </select>
              ))}
              {field("maxYear", "Maximum year *", (
                <select name="maxYear" value={formData.maxYear} onChange={handleChange} className={inputClass} required>
                  {[1, 2, 3, 4].map((year) => <option key={year} value={year}>Year {year}</option>)}
                </select>
              ))}
              {field("minimumCGPA", "Minimum CGPA *", (
                <input type="number" name="minimumCGPA" value={formData.minimumCGPA} onChange={handleChange} min="0" max="10" step="0.01" className={inputClass} required />
              ))}
            </div>
            {Number(formData.minYear) > Number(formData.maxYear) && (
              <p className="mt-3 flex items-center gap-2 text-sm text-rose-600"><CircleAlert size={15} /> Minimum year cannot exceed maximum year.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading icon={Clock3} eyebrow="Step 06" title="Publishing details" description="Choose when applications close and whether the listing should be visible." />
            <div className="grid gap-5 sm:grid-cols-2">
              {field("applicationDeadline", "Application deadline *", (
                <input type="datetime-local" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} min={minDeadline} className={inputClass} required />
              ))}
              {field("status", "Listing status *", (
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass} required>
                  <option value="draft">Draft — save for later</option><option value="active">Active — publish now</option>
                </select>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm leading-5 text-indigo-900">
              <span className="font-bold">{formData.status === "draft" ? "Draft selected:" : "Publish selected:"}</span>{" "}
              {formData.status === "draft" ? "The internship will be saved as a draft and may not appear in public listings." : "The internship will be created with active status, subject to your platform's publishing rules."}
            </div>
          </section>

          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <CircleAlert size={18} className="mt-0.5 shrink-0" /><p>{error}</p>
              <button type="button" onClick={() => setError("")} className="ml-auto rounded-md p-1 hover:bg-rose-100" aria-label="Dismiss error"><X size={15} /></button>
            </div>
          )}
          {success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

          <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-900/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="hidden text-xs text-slate-500 sm:block"><span className="text-rose-500">*</span> Required fields</p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button type="button" onClick={() => navigate("/company/my-internships")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Creating internship...</> : <><Plus size={17} /> Create internship</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInternship;
