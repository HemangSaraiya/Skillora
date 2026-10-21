import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  UserRound,
  Code2,
  Compass,
  FolderGit2,
  BriefcaseBusiness,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  Save,
  Sparkles,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../../context/Authcontext";
import api from "../../../services/axios";

const skillOptions = [
  "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "MongoDB",
  "Python", "Java", "C++", "Git", "Docker", "REST API", "SQL", "TypeScript",
  "Next.js", "Tailwind CSS", "Firebase",
];

const domainOptions = [
  "Web Development", "Artificial Intelligence", "Machine Learning",
  "Data Science", "Cybersecurity", "Cloud Computing", "App Development",
  "DevOps", "UI/UX Design",
];

const emptyForm = () => ({
  education: { degree: "", field: "", university: "", graduationYear: "" },
  currentYear: "",
  cgpa: "",
  skills: [],
  preferredDomains: [],
  projects: [],
  experience: [],
});

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

const SectionHeading = ({ icon: Icon, eyebrow, title, description, count }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
      <Icon size={20} />
    </div>
    <div className="min-w-0 flex-1">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">{eyebrow}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
        {typeof count === "number" && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{count}</span>
        )}
      </div>
      {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
    </div>
  </div>
);

const StudentProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("education");

  const fetchProfile = useCallback(async () => {
    if (!user || user.role !== "student") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get("/profile");
      const existing = response.data.profile;
      setProfile(existing);
      setFormData({
        ...emptyForm(),
        education: {
          degree: existing.education?.degree || "",
          field: existing.education?.field || "",
          university: existing.education?.university || "",
          graduationYear: existing.education?.graduationYear ?? "",
        },
        currentYear: existing.currentYear ?? "",
        cgpa: existing.cgpa ?? "",
        skills: existing.skills || [],
        preferredDomains: existing.preferredDomains || [],
        projects: existing.projects || [],
        experience: existing.experience || [],
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
        setFormData(emptyForm());
      } else {
        setError(err.response?.data?.message || "We couldn't load your profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) fetchProfile();
  }, [authLoading, fetchProfile]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(formData.education.degree.trim()),
      Boolean(formData.education.field.trim()),
      Boolean(formData.education.university.trim()),
      Boolean(formData.education.graduationYear),
      Boolean(formData.currentYear),
      Boolean(formData.experience),
      Boolean(formData.projects),

      formData.cgpa !== "" && Number(formData.cgpa) >= 0 && Number(formData.cgpa) <= 10,
      formData.skills.length > 0,
      formData.preferredDomains.length > 0,
      formData.projects.length > 0,
  formData.experience.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [formData]);

  const updateEducation = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, education: { ...prev.education, [name]: value } }));
    setMessage("");
  };

  const updateField = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setMessage("");
  };

  const addSkill = (event) => {
    event?.preventDefault?.();
    const skill = skillInput.trim();
    if (!skill) return;
    if (!formData.skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput("");
    setMessage("");
  };

  const toggleSkill = (skill, checked) => {
    setFormData((prev) => ({
      ...prev,
      skills: checked
        ? prev.skills.some((item) => item.toLowerCase() === skill.toLowerCase())
          ? prev.skills
          : [...prev.skills, skill]
        : prev.skills.filter((item) => item !== skill),
    }));
    setMessage("");
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((item) => item !== skill) }));
    setMessage("");
  };

  const toggleDomain = (domain, checked) => {
    setFormData((prev) => ({
      ...prev,
      preferredDomains: checked
        ? prev.preferredDomains.includes(domain) ? prev.preferredDomains : [...prev.preferredDomains, domain]
        : prev.preferredDomains.filter((item) => item !== domain),
    }));
    setMessage("");
  };

  const updateListItem = (listName, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
    setMessage("");
  };

  const addListItem = (listName) => {
    const item = listName === "projects"
      ? { title: "", description: "", technologies: [], githubUrl: "", liveUrl: "" }
      : { title: "", organization: "", description: "", startDate: "", endDate: "" };
    setFormData((prev) => ({ ...prev, [listName]: [...prev[listName], item] }));
    setActiveSection(listName);
  };

  const removeListItem = (listName, index) => {
    setFormData((prev) => ({ ...prev, [listName]: prev[listName].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    // These two fields are required by the Profile Mongoose schema.
    if (formData.currentYear === "") {
      setError("Please select your current academic year.");
      setActiveSection("education");
      document.getElementById("section-education")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (formData.cgpa === "" || !Number.isFinite(Number(formData.cgpa))) {
      setError("Please enter your CGPA.");
      setActiveSection("education");
      document.getElementById("section-education")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      setError("CGPA must be between 0 and 10.");
      setActiveSection("education");
      document.getElementById("section-education")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (formData.education.graduationYear && (Number(formData.education.graduationYear) < 1900 || Number(formData.education.graduationYear) > 2100)) {
      setError("Please enter a valid graduation year.");
      return;
    }

    const payload = {
      education: {
        degree: formData.education.degree.trim(),
        field: formData.education.field.trim(),
        university: formData.education.university.trim(),
        graduationYear: formData.education.graduationYear === "" ? undefined : Number(formData.education.graduationYear),
      },
      currentYear: Number(formData.currentYear),
      cgpa: Number(formData.cgpa),
      skills: formData.skills,
      preferredDomains: formData.preferredDomains,
      projects: formData.projects.map((project) => ({
        title: project.title || "",
        description: project.description || "",
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : String(project.technologies || "").split(",").map((item) => item.trim()).filter(Boolean),
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
      })),
      experience: formData.experience.map((item) => ({
        title: item.title || "",
        organization: item.organization || "",
        description: item.description || "",
       
        startDate: item.startDate || null,
        endDate: item.endDate || null,
      })),
    };

    try {
      setSaving(true);
      const response = profile
        ? await api.patch("/profile", payload)
        : await api.post("/profile", payload);
      setProfile(response.data.profile || payload);
      setMessage(profile ? "Your profile has been updated successfully." : "Your profile has been created successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your profile. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
          <LoaderCircle className="animate-spin text-blue-600" size={30} />
          <p className="text-sm font-medium text-slate-600">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "student") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><UserRound size={25} /></div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Student access required</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with a student account to create and manage your profile.</p>
          <button type="button" onClick={() => navigate("/login")} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Go to login</button>
        </div>
      </div>
    );
  }

  const firstName = (user.name || user.email || "Student").split("@")[0].split(" ")[0];
  const navSections = [
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "interests", label: "Interests", icon: Compass },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate("/")} className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-4">
            <ArrowLeft size={17} /> Back to home
          </button>
          <span className="hidden text-sm font-bold tracking-tight text-slate-800 sm:block">Skillora <span className="font-normal text-slate-400">/ Student profile</span></span>
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">Student workspace</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Profile overview and section navigation */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <div className="relative pt-7">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 text-xl font-bold text-blue-700 shadow-sm">
                  {(user.name || user.email || "S").charAt(0).toUpperCase()}
                </div>
                <h1 className="mt-4 break-words text-xl font-bold tracking-tight text-slate-900">{user.name || "Student"}</h1>
                <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  <UserRound size={13} /> Student account
                </span>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Profile completion</span>
                  <span className="font-bold text-blue-700">{completion}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500" style={{ width: `${completion}%` }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">Complete your details to help companies understand your strengths.</p>
              </div>
            </div>

            <nav aria-label="Profile sections" className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              {navSections.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => { setActiveSection(id); document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeSection === id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <Icon size={18} /> {label}
                  {activeSection === id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
                </button>
              ))}
            </nav>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900"><Sparkles size={17} /> Profile tip</div>
              <p className="mt-2 text-sm leading-6 text-blue-800/80">Add relevant skills and project links to make your profile more useful for internship matching.</p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6">
              <p className="text-sm font-semibold text-blue-600">YOUR CAREER SPACE</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Build your profile, {firstName}.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Keep your academic background, skills, and interests up to date so your profile reflects where you want to go.</p>
            </div>

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                <AlertCircle className="mt-0.5 shrink-0" size={18} /><p>{error}</p>
                {error.toLowerCase().includes("load") && <button type="button" onClick={fetchProfile} className="ml-auto shrink-0 font-semibold underline">Retry</button>}
              </div>
            )}
            {message && (
              <div role="status" className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 shrink-0" size={18} /><p>{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <section id="section-education" onMouseEnter={() => setActiveSection("education")} className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading icon={GraduationCap} eyebrow="01 / Background" title="Education" description="Give employers a clear view of your academic journey." />
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">Degree
                    <input name="degree" value={formData.education.degree} onChange={updateEducation} placeholder="e.g. B.Tech" className={inputClass} />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">Field of study
                    <input name="field" value={formData.education.field} onChange={updateEducation} placeholder="e.g. Computer Science" className={inputClass} />
                  </label>
                  <label className="text-sm font-semibold text-slate-700 sm:col-span-2">University / college
                    <input name="university" value={formData.education.university} onChange={updateEducation} placeholder="Enter your institution name" className={inputClass} />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">Graduation year
                    <input type="number" name="graduationYear" min="1900" max="2100" value={formData.education.graduationYear} onChange={updateEducation} placeholder="e.g. 2028" className={inputClass} />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">Current academic year
                    <select name="currentYear" value={formData.currentYear} onChange={updateField} className={inputClass}>
                      <option value="">Select academic year</option>
                      {[1, 2, 3, 4, 5].map((year) => <option key={year} value={year}>{year}{year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"} year</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-700">CGPA <span className="font-normal text-slate-400">(out of 10)</span>
                    <input type="number" name="cgpa" min="0" max="10" step="0.01" value={formData.cgpa} onChange={updateField} placeholder="e.g. 8.4" className={inputClass} />
                  </label>
                </div>
              </section>

              <section id="section-skills" onMouseEnter={() => setActiveSection("skills")} className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading icon={Code2} eyebrow="02 / Strengths" title="Skills" description="Choose your skills and add any that are missing." count={formData.skills.length} />
                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {skillOptions.map((skill) => {
                    const checked = formData.skills.some((item) => item.toLowerCase() === skill.toLowerCase());
                    return (
                      <label key={skill} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-3 text-sm font-medium transition ${checked ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                        <input type="checkbox" checked={checked} onChange={(event) => toggleSkill(skill, event.target.checked)} className="h-4 w-4 accent-blue-600" />
                        <span>{skill}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Add a custom skill</span>
                    <input value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addSkill(event); }} placeholder="Add another skill (e.g. Figma)" className={inputClass + " mt-0"} />
                  </label>
                  <button type="button" onClick={addSkill} disabled={!skillInput.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={17} /> Add skill</button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Your selected skills</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">{skill}<button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)} className="rounded-full text-blue-500 hover:text-rose-600"><X size={14} /></button></span>)}
                    </div>
                  </div>
                )}
              </section>

              <section id="section-interests" onMouseEnter={() => setActiveSection("interests")} className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading icon={Compass} eyebrow="03 / Direction" title="Preferred domains" description="Select the fields you would like to explore." count={formData.preferredDomains.length} />
                <div className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {domainOptions.map((domain) => {
                    const checked = formData.preferredDomains.includes(domain);
                    return (
                      <label key={domain} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm font-medium transition ${checked ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                        <input type="checkbox" checked={checked} onChange={(event) => toggleDomain(domain, event.target.checked)} className="h-4 w-4 accent-blue-600" />
                        {domain}
                      </label>
                    );
                  })}
                </div>
              </section>

              <section id="section-projects" onMouseEnter={() => setActiveSection("projects")} className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <SectionHeading icon={FolderGit2} eyebrow="04 / What you've built" title="Projects" description="Show practical work, class projects, or personal experiments." count={formData.projects.length} />
                  <button type="button" onClick={() => addListItem("projects")} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"><Plus size={16} /> <span className="hidden sm:inline">Add</span></button>
                </div>
                {formData.projects.length === 0 ? (
                  <button type="button" onClick={() => addListItem("projects")} className="mt-6 flex w-full flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/50">
                    <FolderGit2 className="text-slate-400" size={25} /><span className="mt-3 text-sm font-semibold text-slate-700">Add your first project</span><span className="mt-1 text-xs text-slate-500">Include a title, description, and links if available.</span>
                  </button>
                ) : (
                  <div className="mt-6 space-y-4">
                    {formData.projects.map((project, index) => (
                      <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-slate-700">Project {index + 1}</p><button type="button" onClick={() => removeListItem("projects", index)} aria-label={`Remove project ${index + 1}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button></div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Project title<input value={project.title || ""} onChange={(e) => updateListItem("projects", index, "title", e.target.value)} placeholder="e.g. Internship finder app" className={inputClass} /></label>
                          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Description<textarea rows={3} value={project.description || ""} onChange={(e) => updateListItem("projects", index, "description", e.target.value)} placeholder="What did you build? What problem does it solve?" className={inputClass + " resize-y"} /></label>
                          <label className="text-sm font-semibold text-slate-700">GitHub URL<input type="url" value={project.githubUrl || ""} onChange={(e) => updateListItem("projects", index, "githubUrl", e.target.value)} placeholder="https://github.com/..." className={inputClass} /></label>
                          <label className="text-sm font-semibold text-slate-700">Live demo URL<input type="url" value={project.liveUrl || ""} onChange={(e) => updateListItem("projects", index, "liveUrl", e.target.value)} placeholder="https://..." className={inputClass} /></label>
                          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Technologies <span className="font-normal text-slate-400">(comma-separated)</span>
                            <input value={Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies || ""} onChange={(e) => updateListItem("projects", index, "technologies", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="React, Node.js, MongoDB" className={inputClass} />
                          </label>
                        </div>
                        {(project.githubUrl || project.liveUrl) && <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">GitHub <ExternalLink size={12} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">Live demo <ExternalLink size={12} /></a>}</div>}
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem("projects")} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"><Plus size={16} /> Add another project</button>
                  </div>
                )}
              </section>

              <section id="section-experience" onMouseEnter={() => setActiveSection("experience")} className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <SectionHeading icon={BriefcaseBusiness} eyebrow="05 / Experience" title="Experience" description="Add internships, part-time work, volunteering, or relevant roles." count={formData.experience.length} />
                  <button type="button" onClick={() => addListItem("experience")} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"><Plus size={16} /> <span className="hidden sm:inline">Add</span></button>
                </div>
                {formData.experience.length === 0 ? (
                  <button type="button" onClick={() => addListItem("experience")} className="mt-6 flex w-full flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/50">
                    <BriefcaseBusiness className="text-slate-400" size={25} /><span className="mt-3 text-sm font-semibold text-slate-700">Add experience</span><span className="mt-1 text-xs text-slate-500">No formal experience yet? You can leave this section empty.</span>
                  </button>
                ) : (
                  <div className="mt-6 space-y-4">
                    {formData.experience.map((item, index) => (
                      <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-slate-700">Experience {index + 1}</p><button type="button" onClick={() => removeListItem("experience", index)} aria-label={`Remove experience ${index + 1}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button></div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="text-sm font-semibold text-slate-700">Role / title<input value={item.title || ""} onChange={(e) => updateListItem("experience", index, "title", e.target.value)} placeholder="e.g. Web development intern" className={inputClass} /></label>
                          <label className="text-sm font-semibold text-slate-700">Organization<input value={item.organization || ""} onChange={(e) => updateListItem("experience", index, "organization", e.target.value)} placeholder="Company or organization" className={inputClass} /></label>
                          <label className="text-sm font-semibold text-slate-700">Start date<input type="date" value={item.startDate ? String(item.startDate).slice(0, 10) : ""} onChange={(e) => updateListItem("experience", index, "startDate", e.target.value)} className={inputClass} /></label>
                          <label className="text-sm font-semibold text-slate-700">End date <span className="font-normal text-slate-400">(optional)</span><input type="date" value={item.endDate ? String(item.endDate).slice(0, 10) : ""} onChange={(e) => updateListItem("experience", index, "endDate", e.target.value)} className={inputClass} /></label>
                          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Description<textarea rows={3} value={item.description || ""} onChange={(e) => updateListItem("experience", index, "description", e.target.value)} placeholder="Describe your responsibilities or impact." className={inputClass + " resize-y"} /></label>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem("experience")} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"><Plus size={16} /> Add another experience</button>
                  </div>
                )}
              </section>

              <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="hidden text-xs text-slate-500 sm:block">Your changes are saved when you select Save profile.</p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <button type="button" onClick={() => navigate("/")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}
                    {saving ? "Saving profile…" : profile ? "Save profile changes" : "Create profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
