import API from "./api";

export const registerUser = (userData) => {
  return API.post("/auth/register", userData);
};

export const loginUser = (loginData) => {
  return API.post("/auth/login", loginData);
};

export const getProfile = () => {
  return API.get("/auth/profile");
};

export const updateProfile = (profileData) => {
  return API.put("/auth/profile", profileData);
};

export const changePassword = (passwordData) => {
  return API.put("/auth/change-password", passwordData);
};

export const googleLogin = (idToken) => {
  return API.post("/auth/google", { idToken });
};