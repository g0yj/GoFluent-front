import { api } from "./api";

const getSmsList = async (queryParams) => {
  const res = await api.get("/statistics/successSms", { params: queryParams });
  return res.data;
};

const getSms = async (id) => {
  const res = await api.get(`/statistics/sms/${id}`);
  return res.data;
};

const putSms = async (id, data) => {
  await api.put(`/statistics/sms/${id}`, data);
};

const deleteTeachers = async (id) => {
  const res = await api.delete(`/statistics/${id}`);
  return res.data;
};

const deleteConsult = async (id) => {
  await api.post(`/statistics/${id}`);
};

const getEvaluationList = async (queryParams) => {
  const res = await api.get("/statistics/evaluations", { params: queryParams });
  return res.data;
};
const getTargetMemberList = async (id, data) => {
  console.log(data);

  const res = await api.get(`statistics/sms/${id}/target`, { params: data });

  return res.data;
};

const getSmsHoldList = async (queryParams) => {
  const res = await api.get("statistics/waitingSms", { params: queryParams });
  return res.data;
};

const getGradeMember = async (queryParams) => {
  const res = await api.get("statistics/evaluations/users", {params: queryParams});
  return res.data;
};

const getSmsExcel = async (queryParams) => {
  const res = await api.get('templates/excel/sms', {params: queryParams});
  return res.data
}

export {
  deleteConsult,
  deleteTeachers,
  getEvaluationList,
  getSms,
  getSmsHoldList,
  getSmsList,
  getTargetMemberList,
  putSms,
  getGradeMember,
  getSmsExcel,
};
