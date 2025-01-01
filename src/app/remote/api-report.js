import { api } from "./api";

const TAG = "[api-report]";

const getReports = async (queryParams) => {
  console.log(TAG, `getReports([GET]/reservations/report)`, "queryParams", queryParams);
  const res = await api.get("/reservations/report", { params: queryParams });
  return res.data;
};

const getReport = async (id) => {
  const res = await api.get(`/reservations/report/${id}`);
  return res.data;
};

const putReport = async (id, data) => {
  await api.put(`/reservations/report/${id}`, data);
};

const getReportExcel = async (data) => {
  const res = await api.get("/templates/excel/report", {params: data});
  return res.data;
}

export { getReport, getReports, putReport, getReportExcel };
