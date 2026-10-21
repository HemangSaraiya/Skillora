
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Authcontext";
import api from "../../../services/axios";

const skillOptions = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Python",
  "Java",
  "C++",
  "Git",
  "Docker",
  "REST API",
  "SQL",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Firebase",
];

const domainOptions = [
  "Web Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "App Development",
  "DevOps",
  "UI/UX Design",
];

const initialForm = {
  education: {
    degree: "",
    field: "",
    university: "",
    graduationYear: "",
  },
  currentYear: "",
  cgpa: "",
  skills: [],
  preferredDomains: [],
  projects: [],
  experience: [],
};

const StudentProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch existing profile
  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "student") {
      setLoading(false);
      return;
    }

   const fetchProfile = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await api.get("/profile");
    const existingProfile = response.data.profile;

    setProfile(existingProfile);

    setFormData({
      education: {
        degree: existingProfile.education?.degree || "",
        field: existingProfile.education?.field || "",
        university: existingProfile.education?.university || "",
        graduationYear:
          existingProfile.education?.graduationYear ?? "",
      },
      currentYear: existingProfile.currentYear ?? "",
      cgpa: existingProfile.cgpa ?? "",
      skills: existingProfile.skills || [],
      preferredDomains: existingProfile.preferredDomains || [],
      projects: existingProfile.projects || [],
      experience: existingProfile.experience || [],
    });
  } catch (err) {
    if (err.response?.status === 404) {
      // Student has no profile yet
      setProfile(null);
      setFormData({
        education: {
          degree: "",
          field: "",
          university: "",
          graduationYear: "",
        },
        currentYear: "",
        cgpa: "",
        skills: [],
        preferredDomains: [],
        projects: [],
        experience: [],
      });
    } else {
      setError(
        err.response?.data?.message ||
          "Failed to load your profile."
      );
    }
  } finally {
    setLoading(false);
  }
};

    fetchProfile();
  }, [user, authLoading]);

  // Handle education fields
  const handleEducationChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value,
      },
    }));
  };

  // Handle normal fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a skill
  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const alreadyExists = formData.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }

    setSkillInput("");
  };

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // Handle preferred domains
  const toggleDomain = (domain, checked) => {
    setFormData((prev) => ({
      ...prev,
      preferredDomains: checked
        ? [...prev.preferredDomains, domain]
        : prev.preferredDomains.filter(
            (item) => item !== domain
          ),
    }));
  };

  // Handle skill checkbox options
  const toggleSkillOption = (skill, checked) => {
    setFormData((prev) => ({
      ...prev,
      skills: checked
        ? prev.skills.includes(skill)
          ? prev.skills
          : [...prev.skills, skill]
        : prev.skills.filter((item) => item !== skill),
    }));
  };

  // Create or update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const profileData = {
        education: {
          degree: formData.education.degree,
          field: formData.education.field,
          university: formData.education.university,
          graduationYear:
            formData.education.graduationYear === ""
              ? undefined
              : Number(formData.education.graduationYear),
        },
        currentYear:
          formData.currentYear === ""
            ? undefined
            : Number(formData.currentYear),
        cgpa:
          formData.cgpa === "" ? undefined : Number(formData.cgpa),
        skills: formData.skills,
        preferredDomains: formData.preferredDomains,
        projects: formData.projects,
        experience: formData.experience,
      };

      
      const response = profile
        ? await api.patch("/profile", profileData)
        : await api.post("/profile", profileData);

      setProfile(response.data.profile);

      setMessage(
        profile
          ? "Profile updated successfully!"
          : "Profile created successfully!"
      );
    } catch (err) {
  console.error("Profile save error:", err);
  console.error("Backend response:", err.response?.data);

  setError(
    err.response?.data?.message ||
    err.message ||
    "Failed to save your profile."
  );
} finally {
  setSaving(false);
}
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  // Loading
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  // Student-only page
  if (!user || user.role !== "student") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Student access required
          </h2>
          <p className="mt-2 text-slate-500">
            Please log in with a student account to manage your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Student Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your education, skills, and career interests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="self-start rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100 sm:self-auto"
          >
            Back to Home
          </button>
        </div>

        {/* Student information */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {(user.name || user.email || "S")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900">
                {user.name || "Student"}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-500">
                {user.email}
              </p>
              <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {profile ? "Profile ready to edit" : "New profile"}
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Education */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Education
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tell companies about your academic background.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Degree
                <input
                  name="degree"
                  value={formData.education.degree || ""}
                  onChange={handleEducationChange}
                  placeholder="e.g. B.Tech"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Field of study
                <input
                  name="field"
                  value={formData.education.field || ""}
                  onChange={handleEducationChange}
                  placeholder="e.g. Computer Science"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                University / College
                <input
                  name="university"
                  value={formData.education.university || ""}
                  onChange={handleEducationChange}
                  placeholder="Your university or college"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Graduation year
                <input
                  type="number"
                  name="graduationYear"
                  min="2020"
                  max="2100"
                  value={formData.education.graduationYear}
                  onChange={handleEducationChange}
                  placeholder="e.g. 2028"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Current academic year
                <select
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select academic year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                CGPA (out of 10)
                <input
                  type="number"
                  name="cgpa"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.4"
                  className={inputClass}
                />
              </label>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select skills from the list or add your own.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {skillOptions.map((skill) => (
                <label
                  key={skill}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-sm transition ${
                    formData.skills.includes(skill)
                      ? "border-blue-300 bg-blue-50 text-blue-800"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={(e) =>
                      toggleSkillOption(skill, e.target.checked)
                    }
                    className="accent-blue-600"
                  />
                  {skill}
                </label>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add another skill"
                className={inputClass + " mt-0"}
              />

              <button
                type="button"
                onClick={addSkill}
                className="shrink-0 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    className="font-bold hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}

              {formData.skills.length === 0 && (
                <p className="text-sm text-slate-400">
                  No skills selected yet.
                </p>
              )}
            </div>
          </section>

          {/* Preferred domains */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Preferred Domains
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the fields you are interested in working in.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {domainOptions.map((domain) => (
                <label
                  key={domain}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm transition ${
                    formData.preferredDomains.includes(domain)
                      ? "border-blue-300 bg-blue-50 text-blue-800"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.preferredDomains.includes(domain)}
                    onChange={(e) =>
                      toggleDomain(domain, e.target.checked)
                    }
                    className="accent-blue-600"
                  />
                  {domain}
                </label>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse justify-end gap-3 pb-8 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : profile
                ? "Save Changes"
                : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
