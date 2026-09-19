import api from "../../services/axios";

export const createApplication = async (applicationData) => {
  const response = await api.post("/application", applicationData);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/application/my-applications");
  return response.data;
};

export const getInternshipApplicants = async (internshipId) => {
  const response = await api.get(
    `/application/internship/${internshipId}`
  );
  return response.data;
};

export const changeApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await api.patch(
    `/application/${applicationId}/status`,
    { status }
  );
  return response.data;
};