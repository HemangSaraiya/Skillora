
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/axios";

const skillOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Python",
  "Java",
  "C++",
  "SQL",
  "Git",
  "REST API",
  "Docker",
  "AWS",
  "Machine Learning",
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

const CreateInternship = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (skill, type, checked) => {
    setFormData((prev) => {
      const currentSkills = prev[type];

      return {
        ...prev,
        [type]: checked
          ? [...currentSkills, skill]
          : currentSkills.filter((item) => item !== skill),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.requiredSkills.length === 0) {
      setError("Please select at least one required skill.");
      return;
    }

    if (
      Number(formData.minYear) > Number(formData.maxYear)
    ) {
      setError("Minimum eligible year cannot exceed maximum year.");
      return;
    }

    if (new Date(formData.applicationDeadline) <= new Date()) {
      setError("Application deadline must be in the future.");
      return;
    }

    if (
      Number(formData.durationValue) <= 0 ||
      Number(formData.stipendAmount) < 0
    ) {
      setError("Duration must be positive and stipend cannot be negative.");
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

        applicationDeadline: new Date(
          formData.applicationDeadline
        ).toISOString(),

        eligibility: {
          minYear: Number(formData.minYear),
          maxYear: Number(formData.maxYear),
          minimumCGPA: Number(formData.minimumCGPA),
        },

        status: formData.status,
      };

      const response = await api.post("/internship", payload);

      const createdInternship = response.data.internship;

      setSuccess("Internship created successfully!");

      navigate(`/company/internships/${createdInternship._id}`, {
        state: { message: "Internship created successfully!" },
      });
    } catch (err) {
      console.error("Error creating internship:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create internship. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSkillOptions = (type) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
      {skillOptions.map((skill) => (
        <label
          key={`${type}-${skill}`}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 cursor-pointer hover:border-blue-400"
        >
          <input
            type="checkbox"
            checked={formData[type].includes(skill)}
            onChange={(e) =>
              handleSkillChange(skill, type, e.target.checked)
            }
            className="h-4 w-4 accent-blue-600"
          />

          <span className="text-sm text-slate-700">{skill}</span>
        </label>
      ))}
    </div>
  );

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/company/dashboard")}
            className="mb-4 text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            Post an Internship
          </h1>

          <p className="mt-2 text-slate-500">
            Create an opportunity and find the right students for your team.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {/* Basic information */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label className={labelClass}>
                  Internship Title *
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. MERN Stack Developer Intern"
                    required
                    maxLength={150}
                  />
                </label>
              </div>

              <div>
                <label className={labelClass}>
                  Domain *
                  <input
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Full Stack Development"
                    required
                  />
                </label>
              </div>

              <div>
                <label className={labelClass}>
                  Description *
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={inputClass}
                    rows={5}
                    placeholder="Describe the role, responsibilities, and what the intern will learn."
                    required
                  />
                </label>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Required Skills *
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the skills a candidate must have.
            </p>

            {renderSkillOptions("requiredSkills")}

            <h3 className="mt-7 font-semibold text-slate-900">
              Preferred Skills
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              These skills are beneficial but not mandatory.
            </p>

            {renderSkillOptions("preferredSkills")}
          </section>

          <hr className="border-slate-200" />

          {/* Location and work mode */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Work Details
            </h2>

            <div className="mt-5 grid sm:grid-cols-2 gap-5">
              <label className={labelClass}>
                Location
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Bangalore, India"
                />
              </label>

              <label className={labelClass}>
                Work Mode *
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </label>

              <label className={labelClass}>
                Duration *
                <input
                  type="number"
                  name="durationValue"
                  value={formData.durationValue}
                  onChange={handleChange}
                  min="1"
                  className={inputClass}
                  required
                />
              </label>

              <label className={labelClass}>
                Duration Unit *
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </label>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Stipend */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Stipend
            </h2>

            <div className="mt-5 grid sm:grid-cols-2 gap-5">
              <label className={labelClass}>
                Stipend Amount (INR) *
                <input
                  type="number"
                  name="stipendAmount"
                  value={formData.stipendAmount}
                  onChange={handleChange}
                  min="0"
                  className={inputClass}
                  required
                />
              </label>

              <label className={labelClass}>
                Payment Type *
                <select
                  name="stipendPeriod"
                  value={formData.stipendPeriod}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="monthly">Per Month</option>
                  <option value="total">Total for Internship</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </label>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Eligibility */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Eligibility
            </h2>

            <div className="mt-5 grid sm:grid-cols-3 gap-5">
              <label className={labelClass}>
                Minimum Year *
                <select
                  name="minYear"
                  value={formData.minYear}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  {[1, 2, 3, 4].map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Maximum Year *
                <select
                  name="maxYear"
                  value={formData.maxYear}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  {[1, 2, 3, 4].map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Minimum CGPA *
                <input
                  type="number"
                  name="minimumCGPA"
                  value={formData.minimumCGPA}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.01"
                  className={inputClass}
                  required
                />
              </label>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Deadline and status */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Publishing Details
            </h2>

            <div className="mt-5 grid sm:grid-cols-2 gap-5">
              <label className={labelClass}>
                Application Deadline *
                <input
                  type="datetime-local"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16)}
                  className={inputClass}
                  required
                />
              </label>

              <label className={labelClass}>
                Internship Status *
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active — Publish Now</option>
                </select>
              </label>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Draft internships are saved but are not shown in public internship listings.
            </p>
          </section>

          {/* Feedback */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/company/my-internships")}
              className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Internship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInternship;
