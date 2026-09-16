import api from "../../services/axios";
export const signup=async (userData)=>{
    const response=await api.post("/auth/register",userData)
    return response.data
}
export const login=async (userData)=>{
    const response=await api.post("/auth/login",userData)
    return response.data 
}
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};