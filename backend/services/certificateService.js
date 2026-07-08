import api from "./api";

/**
 * Get certificate HTML for a specific listing
 */
export const getCertificates = async (listingId, token) => {
  try {
    const response = await api.get(`/certificate/${listingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "text", // important for HTML response
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch certificate";
    throw new Error(message);
  }
};

/**
 * Generate certificate (server-side creation)
 */
export const generateCertificate = async (listingId, token) => {
  try {
    const response = await api.post(
      `/certificate/generate/${listingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to generate certificate";
    throw new Error(message);
  }
};