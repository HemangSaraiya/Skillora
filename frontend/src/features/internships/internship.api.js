import api from "../../services/axios";

export const getAllInternships = async (page = 1, limit = 9) => {
  const response = await api.get("/internship", {
    params: { page, limit },
  });

  return response.data;
};