import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/axios";

const MyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyInternships = async () => {
      try {
        const response = await api.get("/internship/my-internships");

        setInternships(response.data.internships || []);
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.message || "Failed to fetch internships"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyInternships();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading internships...</p>
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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Internships
            </h1>

            <p className="text-slate-500 mt-1">
              Manage internships posted by you
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border rounded-lg hover:bg-slate-100"
          >
            Back
          </button>
        </div>

        {internships.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No internships found
            </h2>

            <p className="text-slate-500 mt-2">
              You haven't posted any internships yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">
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

                <p className="text-slate-600 mt-4 line-clamp-2">
                  {internship.description}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <strong>Work Mode:</strong>{" "}
                    {internship.workMode}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {internship.location}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {internship.duration?.value}{" "}
                    {internship.duration?.unit}
                  </p>

                  <p>
                    <strong>Stipend:</strong>{" "}
                    ₹{internship.stipend?.amount} /{" "}
                    {internship.stipend?.period}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() =>
                      navigate(
                        `/company/internships/${internship._id}`
                      )
                    }
                    className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800"
                  >
                    Manage Internship
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyInternships;