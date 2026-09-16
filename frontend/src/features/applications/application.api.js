import api from "../../services/axios"

export const createApplication=async (applicationData)=>{
    const response=await api.post("/application",applicationData)
    return response
}
export const getMyApplications = async () => {
  const response = await api.get("/application/my-applications");
  return response.data;
};