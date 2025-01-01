import { api } from "./api";

const TAG = "[api-ldf]";

const getLDFs = async (userId, queryParams) => {
  console.log(TAG, "getLdfs([GET])", "userId", userId, "queryParams", queryParams);

  const res = await api.get(`users/${userId}/ldfs`, { params: queryParams });
  return res.data;
};
const getLDF = async (userId, ldfId) => {
  console.log(TAG, "getLdf([GET])", "userId", userId, "ldfId", ldfId);

  const res = await api.get(`users/${userId}/ldfs/${ldfId}`);
  return res.data;
};

const getLDFDetail = async (ldfId) => {
  const res = await api.get(`statistics/evaluations/${ldfId}`);
  return res.data;
};

const getLdfList = async (data) => {
  const res = await api.get("/statistics/evaluations/ldf", { params: data });
  return res.data;
}

const postLdf = async (userId, data) => {
  const res = await api.post(`/users/${userId}/ldfs`, data)
  return res.data;
};

const putLdf = async (ldfId, data) => {
  const res = await api.put(`/users/ldfs/${ldfId}`, data);
  return res.data
}

const postLdfEmail = async (data) => {
  const res = await api.post("/email/ldf/send", data);
  return res.data;
}

export { getLDF, getLDFDetail, getLDFs, getLdfList, postLdf, putLdf, postLdfEmail };
