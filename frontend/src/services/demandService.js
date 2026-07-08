import API from "./api";

/**
 * Demand Service API Client
 * Centralized client to communicate with MERN backend demands endpoints.
 */

export const createDemand = async (demandData) => {
  console.log("[demandService] createDemand request:", demandData);
  const response = await API.post("/demands", demandData);
  return response.data;
};

export const getAllDemands = async () => {
  console.log("[demandService] getAllDemands request");
  const response = await API.get("/demands");
  return response.data;
};

export const getMyDemands = async () => {
  console.log("[demandService] getMyDemands request");
  const response = await API.get("/demands/my");
  return response.data;
};

export const updateDemand = async (id, demandData) => {
  console.log(`[demandService] updateDemand request for ID ${id}:`, demandData);
  const response = await API.put(`/demands/${id}`, demandData);
  return response.data;
};

export const deleteDemand = async (id) => {
  console.log(`[demandService] deleteDemand request for ID ${id}`);
  const response = await API.delete(`/demands/${id}`);
  return response.data;
};