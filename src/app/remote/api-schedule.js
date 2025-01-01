import { api } from "./api";

const getSchedules = async (params) => {
  const res = await api.get("/reservations/schedules", { params });
  return res.data;
};

export { getSchedules };
