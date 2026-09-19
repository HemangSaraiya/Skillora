import { useAuth } from "../../../context/Authcontext";
import { useNavigate } from "react-router-dom";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.name} 
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your internships and applicants from here.
          </p>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* My Internships */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold">
              My Internships
            </h2>

            <p className="text-slate-500 mt-2">
              View and manage the internships you have posted.
            </p>

            <button
              onClick={() => navigate("/company/my-internships")}
              className="mt-5 px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              View My Internships
            </button>
          </div>

          {/* Post Internship */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold">
              Post Internship
            </h2>

            <p className="text-slate-500 mt-2">
              Create a new internship opportunity for students.
            </p>

            <button
              onClick={() => navigate("/company/internships/create")}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post Internship
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CompanyDashboard;