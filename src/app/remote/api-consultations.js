import storage from "../local/local-storage";
import { api } from "./api";

const TAG = "[api-consultations]";

// 회원 상담 목록
// [GET]/admin/v1/users/{id}/consultations
const getConsultations = async (queryParams) => {
  const res = await api.get(`/consultations`, { params: queryParams });
  return res.data;
};
const getConsultation = async (userId, id) => {
  console.log(TAG, `getConsultationsDetail([GET]/admin/v1/consultations`);
  const res = await api.get(`users/${userId}/consultations/${id}`);
  return res.data;
};
const getConsultationsFromUserId = async (id) => {
  console.log(TAG, `getConsultations([GET]/admin/v1/consultations`);
  const res = await api.get(`users/${id}/consultations`);
  return res.data;
};
const getConsultationsDetail = async (id) => {
  const res = await api.get(`/consultations/${id}`);
  return res.data;
};
const getConsultationsDetailHistory = async (id) => {
  console.log(TAG, `getConsultationsDetailHistory([GET]/admin/v1/consultations`);
  const res = await api.get(`/consultations/history/${id}`);
  return res.data;
};
//상담 회원 등록
const postConsultationUser = async (id, data) => {
  await api.post(`/consultations/${id}/users`, data);
};

const modifyConsult = async (id, data) => {
  const token = await storage.loginedToken.get();
  await api.put(`/consultations/${id}`, data, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: token,
    },
  });
};
const createConsult = async (data) => {
  const token = await storage.loginedToken.get();
  await api.post(`/consultations`, data, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: token,
    },
  });
};
const deleteConsult = async (id) => {
  await api.delete(`/consultations/${id}`);
};
const deleteSms = async (ids) => {
  await api.delete(`/statistics/sms`, { smsId: ids });
};

const postConsultations = async (userId, data) => {
  console.log(TAG, `postConsultations([POST]/admin/v1/users/{id}/consultations`, "userId", userId);
  const res = await api.post(`users/${userId}/consultations`, data);
  return res.data;
};
const putConsultations = async (userId, id, data) => {
  const res = await api.put(`users/${userId}/consultations/${id}`, data);
  return res.data;
};

const postHistory = async (id, data) => {
  await api.post(`consultations/history/${id}`, data);
};
const deleteHistory = async (id) => {
  await api.delete(`consultations/history/${id}`);
};

export {
  createConsult,
  deleteConsult,
  deleteHistory,
  deleteSms,
  getConsultation,
  getConsultations,
  getConsultationsDetail,
  getConsultationsDetailHistory,
  getConsultationsFromUserId,
  modifyConsult,
  postConsultations,
  postConsultationUser,
  postHistory,
  putConsultations,
};
