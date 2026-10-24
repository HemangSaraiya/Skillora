import api from "../../services/axios";

export const getAllInternships = async (page = 1, limit = 9,filters={}) => {
  const response = await api.get("/internship", {
    params: { page, limit,
      search:filters.search || "",
      domain: filters.domain || "all",
            workMode: filters.workMode || "all",
            sortBy: filters.sortBy || "newest"
     },
  });

  return response.data;
};