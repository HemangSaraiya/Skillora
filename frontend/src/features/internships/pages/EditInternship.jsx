import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    const fetchInternship = async () => {
      try {
        const response = await api.get(`/internship/${id}`);

        const internship = response.data.internship;

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
            ? internship.applicationDeadline.slice(0, 16)
            : "",

          minYear: internship.eligibility?.minYear ?? "",
          maxYear: internship.eligibility?.maxYear ?? "",
          minimumCGPA: internship.eligibility?.minimumCGPA ?? "",

          status: internship.status || "draft",
        });
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.message ||
            "Failed to fetch internship"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (skill, type, checked) => {
    setFormData((prev) => {
      const currentSkills = prev[type];

      if (checked) {
        return {
          ...prev,
          [type]: [...currentSkills, skill],
        };
      }

      return {
        ...prev,
        [type]: currentSkills.filter((item) => item !== skill),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const internshipData = {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,

        requiredSkills: formData.requiredSkills,

        preferredSkills: formData.preferredSkills,

        location: formData.location,

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

        applicationDeadline: formData.applicationDeadline,

        eligibility: {
          minYear: Number(formData.minYear),
          maxYear: Number(formData.maxYear),
          minimumCGPA: Number(formData.minimumCGPA),
        },

        status: formData.status,
      };

      await api.patch(`/internship/${id}`, internshipData);

      navigate(`/company/internships/${id}`);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Failed to update internship"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading internship...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Edit Internship
            </h1>

            <p className="text-slate-500 mt-1">
              Update your internship details
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/company/internships/${id}`)
            }
            className="px-4 py-2 border rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border p-6 space-y-6"
        >

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">
              Internship Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block mb-2 font-medium">
              Domain
            </label>

            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block mb-3 font-medium">
              Required Skills
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skillOptions.map((skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.requiredSkills.includes(skill)}
                    onChange={(e) =>
                      handleSkillChange(
                        skill,
                        "requiredSkills",
                        e.target.checked
                      )
                    }
                  />

                  <span className="text-sm">
                    {skill}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block mb-3 font-medium">
              Preferred Skills
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skillOptions.map((skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.preferredSkills.includes(skill)}
                    onChange={(e) =>
                      handleSkillChange(
                        skill,
                        "preferredSkills",
                        e.target.checked
                      )
                    }
                  />

                  <span className="text-sm">
                    {skill}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bangalore, India"
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block mb-2 font-medium">
              Work Mode
            </label>

            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-2 font-medium">
              Duration
            </label>

            <div className="flex gap-3">
              <input
                type="number"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />

              <select
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              >
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          {/* Stipend */}
          <div>
            <label className="block mb-2 font-medium">
              Stipend
            </label>

            <div className="flex gap-3">
              <input
                type="number"
                name="stipendAmount"
                value={formData.stipendAmount}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />

              <select
                name="stipendPeriod"
                value={formData.stipendPeriod}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              >
                <option value="monthly">Monthly</option>
                <option value="total">Total</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block mb-2 font-medium">
              Application Deadline
            </label>

            <input
              type="datetime-local"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          {/* Eligibility */}
          <div>
            <label className="block mb-3 font-medium">
              Eligibility
            </label>

            <div className="grid md:grid-cols-3 gap-4">

              {/* Minimum Year */}
              <div>
                <label className="block mb-2 text-sm text-slate-600">
                  Minimum Year
                </label>

                <select
                  name="minYear"
                  value={formData.minYear}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-white"
                >
                  <option value="">
                    Select year
                  </option>

                  <option value="1">
                    1st Year
                  </option>

                  <option value="2">
                    2nd Year
                  </option>

                  <option value="3">
                    3rd Year
                  </option>

                  <option value="4">
                    4th Year
                  </option>
                </select>
              </div>

              {/* Maximum Year */}
              <div>
                <label className="block mb-2 text-sm text-slate-600">
                  Maximum Year
                </label>

                <select
                  name="maxYear"
                  value={formData.maxYear}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-white"
                >
                  <option value="">
                    Select year
                  </option>

                  <option value="1">
                    1st Year
                  </option>

                  <option value="2">
                    2nd Year
                  </option>

                  <option value="3">
                    3rd Year
                  </option>

                  <option value="4">
                    4th Year
                  </option>
                </select>
              </div>

              {/* Minimum CGPA */}
              <div>
                <label className="block mb-2 text-sm text-slate-600">
                  Minimum CGPA
                </label>

                <input
                  type="number"
                  name="minimumCGPA"
                  value={formData.minimumCGPA}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="e.g. 7.0"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>

            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="draft">
                Draft
              </option>

              <option value="active">
                Active
              </option>

              <option value="closed">
                Closed
              </option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() =>
                navigate(`/company/internships/${id}`)
              }
              className="px-5 py-2 border rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditInternship;