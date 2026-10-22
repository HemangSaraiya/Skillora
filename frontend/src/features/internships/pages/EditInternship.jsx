import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Code2,
  FileText,
  MapPin,
  Save,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import api from "../../../services/axios";

const skillOptions = [
  "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js",
  "MongoDB", "Python", "Java", "C++", "Git", "Docker", "REST API",
  "SQL", "TypeScript", "Next.js", "Tailwind CSS", "Firebase",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
const sectionClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

const Field = ({ label, hint, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
    {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
  </div>
);

const SectionHeading = ({ icon: Icon, title, description }) => (
  <div className="mb-6 flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
      <Icon size={19} />
    </div>
    <div>
      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    requiredSkills: [],
    preferredSkills: [],
    location: "",
    workMode: "remote",
    durationValue: "",
    durationUnit: "months",
    stipendAmount: "",
    stipendPeriod: "monthly",
    applicationDeadline: "",
    minYear: "",
    maxYear: "",
    minimumCGPA: "",
    status: "draft",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchInternship = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/internship/${id}`);
        const internship = response.data.internship;

        if (!isMounted) return;

        setFormData({
          title: internship.title || "",
          description: internship.description || "",
          domain: internship.domain || "",
          requiredSkills: internship.requiredSkills || [],
          preferredSkills: internship.preferredSkills || [],
          location: internship.location || "",
          workMode: internship.workMode || "remote",
          durationValue: internship.duration?.value ?? "",
          durationUnit: internship.duration?.unit || "months",
          stipendAmount: internship.stipend?.amount ?? "",
          stipendPeriod: internship.stipend?.period || "monthly",
          applicationDeadline: internship.applicationDeadline
            ? new Date(internship.applicationDeadline).toISOString().slice(0, 16)
            : "",
          minYear: internship.eligibility?.minYear ?? "",
          maxYear: internship.eligibility?.maxYear ?? "",
          minimumCGPA: internship.eligibility?.minimumCGPA ?? "",
          status: internship.status || "draft",
        });
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch internship. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInternship();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSkillChange = (skill, type, checked) => {
    setFormData((prev) => {
      const currentSkills = prev[type];
      return {
        ...prev,
        [type]: checked
          ? currentSkills.includes(skill) ? currentSkills : [...currentSkills, skill]
          : currentSkills.filter((item) => item !== skill),
      };
    });
    setError("");
    setSuccess("");
  };

  const filteredSkills = useMemo(
    () => skillOptions.filter((skill) => skill.toLowerCase().includes(skillSearch.toLowerCase())),
    [skillSearch]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.requiredSkills.length === 0) {
      setError("Please select at least one required skill.");
      return;
    }
    if (
      formData.minYear !== "" &&
      formData.maxYear !== "" &&
      Number(formData.minYear) > Number(formData.maxYear)
    ) {
      setError("Minimum eligible year cannot be greater than maximum eligible year.");
      return;
    }
    if (formData.applicationDeadline && new Date(formData.applicationDeadline) <= new Date()) {
      setError("The application deadline must be in the future.");
      return;
    }

    const durationValue = Number(formData.durationValue);
    const stipendAmount = Number(formData.stipendAmount);
    const minimumCGPA = formData.minimumCGPA === "" ? undefined : Number(formData.minimumCGPA);

    if (!Number.isFinite(durationValue) || durationValue < 1) {
      setError("Please enter a valid internship duration.");
      return;
    }
    if (!Number.isFinite(stipendAmount) || stipendAmount < 0) {
      setError("Please enter a valid stipend amount.");
      return;
    }
    if (minimumCGPA !== undefined && (minimumCGPA < 0 || minimumCGPA > 10)) {
      setError("Minimum CGPA must be between 0 and 10.");
      return;
    }

    const internshipData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      domain: formData.domain.trim(),
      requiredSkills: formData.requiredSkills,
      preferredSkills: formData.preferredSkills,
      location: formData.location.trim(),
      workMode: formData.workMode,
      duration: { value: durationValue, unit: formData.durationUnit },
      stipend: {
        amount: formData.stipendPeriod === "unpaid" ? 0 : stipendAmount,
        currency: "INR",
        period: formData.stipendPeriod,
      },
      applicationDeadline: formData.applicationDeadline,
      eligibility: {
        minYear: formData.minYear === "" ? undefined : Number(formData.minYear),
        maxYear: formData.maxYear === "" ? undefined : Number(formData.maxYear),
        minimumCGPA,
      },
      status: formData.status,
    };

    try {
      setSaving(true);
      await api.patch(`/internship/${id}`, internshipData);
      setSuccess("Your internship has been updated.");
      navigate(`/company/internships/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update internship. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-40 rounded-3xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-white" />
          <div className="h-64 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`/company/internships/${id}`)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} /> Back to internship
        </button>

        <header className="relative mb-7 overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                <Sparkles size={14} /> Internship management
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Edit internship</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Keep your opportunity up to date. Changes here will be reflected in the internship listing.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:self-auto">
              <BriefcaseBusiness size={20} className="text-indigo-300" />
              <div>
                <p className="text-xs text-slate-400">Listing ID</p>
                <p className="max-w-36 truncate text-sm font-semibold">{id}</p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <X size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
            <button type="button" onClick={() => setError("")} className="ml-auto rounded-lg p-1 hover:bg-rose-100" aria-label="Dismiss error">
              <X size={16} />
            </button>
          </div>
        )}
        {success && (
          <div role="status" className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <Check size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className={sectionClass}>
            <SectionHeading icon={FileText} title="The opportunity" description="Give candidates a clear picture of the role." />
            <div className="space-y-5">
              <Field label="Internship title">
                <input className={inputClass} name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer Intern" required minLength={3} />
              </Field>
              <Field label="Description" hint="Include responsibilities, what candidates will learn, and what makes this opportunity valuable.">
                <textarea className={inputClass} name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Describe the role and its key responsibilities..." required minLength={20} />
              </Field>
              <Field label="Domain">
                <input className={inputClass} name="domain" value={formData.domain} onChange={handleChange} placeholder="e.g. Web Development, Data Science" required />
              </Field>
            </div>
          </section>

          <section className={sectionClass}>
            <SectionHeading icon={Code2} title="Skills & requirements" description="Choose the skills candidates should bring to the role." />
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <input className={`${inputClass} pr-10`} value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} placeholder="Search skills..." aria-label="Search skills" />
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500">{formData.requiredSkills.length} required · {formData.preferredSkills.length} preferred selected</p>
            </div>

            <p className="mb-3 text-sm font-semibold text-slate-700">Required skills <span className="text-rose-500">*</span></p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {filteredSkills.map((skill) => {
                const selected = formData.requiredSkills.includes(skill);
                return (
                  <label key={`required-${skill}`} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${selected ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                    <input className="h-4 w-4 accent-indigo-600" type="checkbox" checked={selected} onChange={(e) => handleSkillChange(skill, "requiredSkills", e.target.checked)} />
                    <span>{skill}</span>
                    {selected && <Check size={14} className="ml-auto shrink-0" />}
                  </label>
                );
              })}
            </div>
            {filteredSkills.length === 0 && <p className="py-4 text-sm text-slate-500">No skills match that search.</p>}

            <div className="my-6 border-t border-slate-100" />
            <p className="mb-3 text-sm font-semibold text-slate-700">Preferred skills <span className="font-normal text-slate-400">(optional)</span></p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {filteredSkills.map((skill) => {
                const selected = formData.preferredSkills.includes(skill);
                return (
                  <label key={`preferred-${skill}`} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${selected ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                    <input className="h-4 w-4 accent-violet-600" type="checkbox" checked={selected} onChange={(e) => handleSkillChange(skill, "preferredSkills", e.target.checked)} />
                    <span>{skill}</span>
                    {selected && <Check size={14} className="ml-auto shrink-0" />}
                  </label>
                );
              })}
            </div>
          </section>

          <section className={sectionClass}>
            <SectionHeading icon={MapPin} title="Work arrangement" description="Tell candidates where and how they will work." />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Location" hint="For remote roles, you can enter 'Anywhere in India'.">
                <input className={inputClass} name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bengaluru, India or Remote" />
              </Field>
              <Field label="Work mode">
                <select className={inputClass} name="workMode" value={formData.workMode} onChange={handleChange}>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </Field>
            </div>
          </section>

          <section className={sectionClass}>
            <SectionHeading icon={Clock3} title="Duration & compensation" description="Set the length of the internship and its stipend." />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Duration">
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputClass} type="number" name="durationValue" value={formData.durationValue} onChange={handleChange} min="1" step="1" placeholder="e.g. 3" required />
                  <select className={inputClass} name="durationUnit" value={formData.durationUnit} onChange={handleChange}>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </Field>
              <Field label="Stipend amount (₹)" hint="Enter 0 for an unpaid internship.">
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputClass} type="number" name="stipendAmount" value={formData.stipendAmount} onChange={handleChange} min="0" step="1" placeholder="e.g. 10000" required />
                  <select className={inputClass} name="stipendPeriod" value={formData.stipendPeriod} onChange={handleChange}>
                    <option value="monthly">Per month</option>
                    <option value="total">Total stipend</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </Field>
            </div>
          </section>

          <section className={sectionClass}>
            <SectionHeading icon={Users} title="Eligibility" description="Set the academic requirements for applicants." />
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Minimum year">
                <select className={inputClass} name="minYear" value={formData.minYear} onChange={handleChange}>
                  <option value="">Any year</option>
                  <option value="1">1st year</option><option value="2">2nd year</option><option value="3">3rd year</option><option value="4">4th year</option>
                </select>
              </Field>
              <Field label="Maximum year">
                <select className={inputClass} name="maxYear" value={formData.maxYear} onChange={handleChange}>
                  <option value="">Any year</option>
                  <option value="1">1st year</option><option value="2">2nd year</option><option value="3">3rd year</option><option value="4">4th year</option>
                </select>
              </Field>
              <Field label="Minimum CGPA" hint="Out of 10. Leave blank if there is no minimum.">
                <input className={inputClass} type="number" name="minimumCGPA" value={formData.minimumCGPA} onChange={handleChange} min="0" max="10" step="0.1" placeholder="e.g. 7.0" />
              </Field>
            </div>
          </section>

          <section className={sectionClass}>
            <SectionHeading icon={CalendarDays} title="Deadline & listing status" description="Control when applications close and how the listing appears." />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Application deadline">
                <input className={inputClass} type="datetime-local" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required />
              </Field>
              <Field label="Listing status">
                <select className={inputClass} name="status" value={formData.status} onChange={handleChange}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </Field>
            </div>
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-900">
              <p className="font-semibold">Status guide</p>
              <p className="mt-1 text-indigo-800/80">Draft keeps the listing unpublished; Active makes it available to eligible candidates; Closed stops new applications.</p>
            </div>
          </section>

          <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="hidden text-sm text-slate-500 sm:block">Review your changes before saving.</p>
            <div className="flex gap-3 sm:ml-auto">
              <button type="button" onClick={() => navigate(`/company/internships/${id}`)} className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none">
                <Save size={17} /> {saving ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInternship;
