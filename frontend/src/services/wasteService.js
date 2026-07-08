import API from "./api";

/**
 * Waste Listing Service API Client
 * Seamlessly bridges the frontend components to backend endpoints.
 * Integrates directly with the MongoDB database via the MERN backend.
 */

export const createWasteListing = async (listingData) => {
  console.log("[wasteService] createWasteListing request:", listingData);
  const response = await API.post("/listings", listingData);
  return response.data;
};

export const getAllWasteListings = async () => {
  console.log("[wasteService] getAllWasteListings request");
  const response = await API.get("/listings");
  return response.data;
};

export const getMyWasteListings = async () => {
  console.log("[wasteService] getMyWasteListings request");
  const response = await API.get("/listings/my");
  return response.data;
};

export const updateWasteListing = async (id, listingData) => {
  console.log(`[wasteService] updateWasteListing request for ID ${id}:`, listingData);
  const response = await API.put(`/listings/${id}`, listingData);
  return response.data;
};

export const deleteWasteListing = async (id) => {
  console.log(`[wasteService] deleteWasteListing request for ID ${id}`);
  const response = await API.delete(`/listings/${id}`);
  return response.data;
};
