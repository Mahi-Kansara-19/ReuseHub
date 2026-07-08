import API from "./api";

// Get all certificates of logged-in user
export const getCertificates = async () => {
  const response = await API.get("/certificates");
  return response.data;
};

// Generate new certificate
export const generateCertificate = async () => {
  const response = await API.post("/certificates/generate");
  return response.data;
};