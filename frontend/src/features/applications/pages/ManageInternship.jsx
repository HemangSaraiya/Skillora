import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/axios";

const ManageInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await api.get(`/internship/${id}`);

        setInternship(response.data.internship);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading internship...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!internship) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Internship
            </h1>

            <p className="text-slate-500 mt-1">
              View and manage your internship
            </p>
          </div>

          <button
            onClick={() => navigate("/company/my-internships")}
            className="px-4 py-2 border rounded-lg hover:bg-slate-100"
          >
            Back
          </button>
        </div>

        {/* Internship Details */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {internship.title}
              </h2>

              <p className="text-slate-500 mt-1">
                {internship.domain}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              {internship.status}
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">
              Description
            </h3>

            <p className="text-slate-600 mt-2">
              {internship.description}
            </p>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div>
              <p className="text-sm text-slate-500">
                Work Mode
              </p>
              <p className="font-medium">
                {internship.workMode}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Location
              </p>
              <p className="font-medium">
                {internship.location || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Duration
              </p>
              <p className="font-medium">
                {internship.duration?.value}{" "}
                {internship.duration?.unit}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Stipend
              </p>
              <p className="font-medium">
                ₹{internship.stipend?.amount} /{" "}
                {internship.stipend?.period}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Minimum CGPA
              </p>
              <p className="font-medium">
                {internship.eligibility?.minimumCGPA || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Eligible Years
              </p>
              <p className="font-medium">
                Year {internship.eligibility?.minYear} -{" "}
                Year {internship.eligibility?.maxYear}
              </p>
            </div>

          </div>

          {/* Required Skills */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">
              Required Skills
            </h3>

            <div className="flex flex-wrap gap-2 mt-3">
              {internship.requiredSkills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          {internship.preferredSkills?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">
                Preferred Skills
              </h3>

              <div className="flex flex-wrap gap-2 mt-3">
                {internship.preferredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-8">

            <button
              onClick={() =>
                navigate(
                  `/company/internships/${internship._id}/applicants`
                )
              }
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Applicants
            </button>

            <button
              onClick={() =>
                navigate(
                  `/company/internships/${internship._id}/edit`
                )
              }
              className="px-5 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              Edit Internship
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageInternship;