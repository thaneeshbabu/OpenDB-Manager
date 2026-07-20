import api from "./api";

// Get all records
export const getRecords = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/records", {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

// Create a new record
export const createRecord = async (recordData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/records", recordData, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

// Update Record
export const updateRecord = async (id, recordData) => {
  const token = localStorage.getItem("token");

  const response = await api.put(`/records/${id}`, recordData, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};



// Delete Record
export const deleteRecord = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(`/records/${id}`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};