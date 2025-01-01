import { api } from "./api";

// [POST]/sms/send
const postSms = async (data) => {
  await api.post(`/sms/send`, data);
};

const getSmsUsers = async (paramsQuery) => {
  const res = await api.get("/sms/users", { params: paramsQuery });
  return res.data;
};
const getEmailUsers = async (paramsQuery) => {
  const res = await api.get("/email/users", { params: paramsQuery });
  return res.data;
};

// [POST]/email/send
const postEmail = async (data) => {
  await api.post(`/email/send`, data);
};

const postPhone = async (data) => {
  await api.post(`/consultations/cellphone`, data);
};

const getTemplates = async () => {
  const res = await api.get("templates/1");
  return res.data;
};

const putTemplates = async (data) => {
  const res = await api.put("/templates/1", data)
  return res.data;
}

const getCodeGroup = async (id) => {
  const res = await api.get(`/code/${id}`);
  return res.data;
};

const getAllCodeGroup = async () => {
  const res = await api.get('/commonCodeGroup');
  return res.data;
};

const getCommonCode = async (data) => {
  const res = await api.get("/commonCode", {params: data});
  return res.data;
};
const createCommonCode = async (data) => {
  const res = await api.post("/commonCode", data);
  return res.data;
};

const putCommonCode = async (codeId, data) => {
  const res = await api.put(`commonCode/${codeId}`, data)
  return res.data;
}

export {
  putCommonCode,
  createCommonCode,
  getCodeGroup,
  getAllCodeGroup,
  getCommonCode,
  getEmailUsers,
  getSmsUsers,
  getTemplates,
  postEmail,
  postPhone,
  postSms,
  putTemplates
};
