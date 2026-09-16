import api from "../../services/axios";

export const getAllInternships = async () => {
  const response = await api.get("/internship");
  return response.data;
};