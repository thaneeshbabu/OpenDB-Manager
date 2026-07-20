import api from "./api";

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/dashboard", {
    headers: {
      Authorization: token,
    },
  });

   console.log("Axios Response:", response);
  console.log("Axios Response Data:", response.data);

  return response.data;
};