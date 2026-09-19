import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/axios";

const ApplicantProfile = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const handleStatusChange = async (status) => {
        try {
            setUpdating(true);

            const response = await api.patch(
                `/application/${applicationId}/status`,
                { status }
            );

            setData((prev) => ({
                ...prev,
                application: response.data.application,
            }));
        } catch (err) {
            console.log(err);

            alert(
                err.response?.data?.message ||
                "Failed to update application status"
            );
        } finally {
            setUpdating(false);
        }
    };
    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                const response = await api.get(
                    `/application/${applicationId}/details`
                );

                setData(response.data);
            } catch (err) {
                console.log(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to fetch applicant details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplicant();
    }, [applicationId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading applicant profile...</p>
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

    const { student, profile, application } = data;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Applicant Profile
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Review applicant details before making a decision
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded-lg hover:bg-slate-100"
                    >
                        Back
                    </button>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Basic Information
                    </h2>

                    <div className="space-y-2">
                        <p>
                            <strong>Name:</strong> {student?.name}
                        </p>

                        <p>
                            <strong>Email:</strong> {student?.email}
                        </p>

                        <p>
                            <strong>Current Year:</strong>{" "}
                            {profile?.currentYear || "Not provided"}
                        </p>

                        <p>
                            <strong>CGPA:</strong>{" "}
                            {profile?.cgpa || "Not provided"}
                        </p>
                    </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Education
                    </h2>

                    {profile?.education ? (
                        <div className="space-y-2">
                            <p>
                                <strong>Degree:</strong>{" "}
                                {profile.education.degree}
                            </p>

                            <p>
                                <strong>Field:</strong>{" "}
                                {profile.education.field}
                            </p>

                            <p>
                                <strong>University:</strong>{" "}
                                {profile.education.university}
                            </p>

                            <p>
                                <strong>Graduation Year:</strong>{" "}
                                {profile.education.graduationYear}
                            </p>
                        </div>
                    ) : (
                        <p className="text-slate-500">
                            Education information not provided.
                        </p>
                    )}
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Skills
                    </h2>

                    {profile?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">
                            No skills provided.
                        </p>
                    )}
                </div>

                {/* Projects */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Projects
                    </h2>

                    {profile?.projects?.length > 0 ? (
                        <div className="space-y-5">
                            {profile.projects.map((project) => (
                                <div
                                    key={project._id}
                                    className="border rounded-lg p-4"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-600 mt-2">
                                        {project.description}
                                    </p>

                                    {project.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {project.technologies.map(
                                                (tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-slate-100 rounded text-sm"
                                                    >
                                                        {tech}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-4 mt-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                GitHub
                                            </a>
                                        )}

                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Live Project
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">
                            No projects provided.
                        </p>
                    )}
                </div>

                {/* Experience */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Experience
                    </h2>

                    {profile?.experience?.length > 0 ? (
                        <div className="space-y-5">
                            {profile.experience.map((experience) => (
                                <div
                                    key={experience._id}
                                    className="border rounded-lg p-4"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {experience.title}
                                    </h3>

                                    <p className="text-slate-600">
                                        {experience.organization}
                                    </p>

                                    <p className="text-slate-600 mt-2">
                                        {experience.description}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-3">
                                        {new Date(
                                            experience.startDate
                                        ).toLocaleDateString()}{" "}
                                        -{" "}
                                        {experience.endDate
                                            ? new Date(
                                                experience.endDate
                                            ).toLocaleDateString()
                                            : "Present"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">
                            No experience provided.
                        </p>
                    )}
                </div>

                {/* Cover Letter */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Cover Letter
                    </h2>

                    <p className="text-slate-600 whitespace-pre-line">
                        {application?.coverLetter ||
                            "No cover letter provided."}
                    </p>
                </div>

                {/* Application Status */}
                {/* Application Status */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Application Status
                    </h2>

                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                        {application?.status}
                    </span>

                    <div className="flex flex-wrap gap-3 mt-6">

                        <button
                            onClick={() => handleStatusChange("shortlisted")}
                            disabled={updating}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Shortlist
                        </button>

                        <button
                            onClick={() => handleStatusChange("rejected")}
                            disabled={updating}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            Reject
                        </button>

                        <button
                            onClick={() => handleStatusChange("accepted")}
                            disabled={updating}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            Accept
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantProfile;