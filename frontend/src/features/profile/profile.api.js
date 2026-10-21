import api from "../../services/axios";

export const getProfile = async () => {
  const response = await api.get("/profile/getprofile");
  return response.data;
};

export const createProfile = async (profileData) => {
  const response = await api.post(
    "/profile/createprofile",
    profileData
  );
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch(
    "/profile/updateprofile",
    profileData
  );
  return response.data;
};