import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/axios";

const InternshipApplicants = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await api.get(
                    `/application/internship/${id}`
                );

                setApplicants(response.data.applicants || []);
            } catch (err) {
                console.log(err);

                if (err.response?.status === 404) {
                    setApplicants([]);
                } else {
                    setError(
                        err.response?.data?.message ||
                        "Failed to fetch applicants"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading applicants...</p>
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

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Applicants
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Students who applied for this internship
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate(`/company/internships/${id}`)
                        }
                        className="px-4 py-2 border rounded-lg hover:bg-slate-100"
                    >
                        Back
                    </button>
                </div>

                {/* Empty State */}
                {applicants.length === 0 ? (
                    <div className="bg-white rounded-xl p-10 text-center shadow-sm border">
                        <h2 className="text-xl font-semibold">
                            No applicants yet
                        </h2>

                        <p className="text-slate-500 mt-2">
                            No students have applied for this internship.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {applicants.map((application) => {
                            const student = application.studentId;

                            return (
                                <div
                                    key={application._id}
                                    className="bg-white rounded-xl p-6 shadow-sm border"
                                >

                                    {/* Student Header */}
                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                {student?.name || "Student"}
                                            </h2>

                                            <p className="text-slate-500 mt-1">
                                                {student?.email || "Email not available"}
                                            </p>
                                        </div>

                                        <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                                            {application.status}
                                        </span>

                                    </div>

                                    {/* Cover Letter */}
                                    <div className="mt-5">
                                        <h3 className="font-semibold text-slate-900">
                                            Cover Letter
                                        </h3>

                                        <p className="text-slate-600 mt-2">
                                            {application.coverLetter ||
                                                "No cover letter provided."}
                                        </p>
                                    </div>

                                    {/* Applied Date */}
                                    <div className="mt-4">
                                        <p className="text-sm text-slate-500">
                                            Applied on
                                        </p>

                                        <p className="text-sm font-medium">
                                            {new Date(
                                                application.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() =>
                                                navigate(`/company/applications/${application._id}`)
                                            }
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            View Profile
                                        </button>
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
};

export default InternshipApplicants;