import api from "./api";

// Get uploaded NSE data
export const getRecords = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/nse-data", {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

// Create Record (Not used because data comes from CSV upload)
export const createRecord = async () => {
  return null;
};

// Update uploaded row
export const updateRecord = async (id, recordData) => {
  const token = localStorage.getItem("token");

  const response = await api.put(`/nse-data/${id}`, recordData, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

// Delete uploaded row
export const deleteRecord = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(`/nse-data/${id}`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};