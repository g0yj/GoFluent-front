import { api } from "./api.js";

const TAG = "[api-users]";

// [GET]/users
const getUsers = async (requestParams) => {
  console.log(TAG, `getUsers([GET]/users)`, "requestParams", requestParams);
  const res = await api.get(`/users`, { params: requestParams });
  return res.data;
};

// [GET]/users/{id}
const getUser = async (id) => {
  console.log(TAG, `getUser([GET]/users/{id})`, "id", id);
  const res = await api.get(`/users/${id}`);
  return res.data;
};

// [POST]/users
const postUser = async (requestBody) => {
  console.log(TAG, `registerUser([POST]/users)`, "requestBody", requestBody);
  const res = await api.post(`/users`, requestBody);
  return res.data;
};

// [PUT]/users
const putUser = async (id, requestBody) => {
  console.log(TAG, `putUser([PUT]/users/{id})`, "id", id, "requestBody", requestBody);
  const res = await api.put(`/users/${id}`, requestBody);
  return res.data;
};

// [DELETE]/users
const deleteUser = async (id) => {
  console.log(TAG, `deleteUser([DELETE]/users)`, "id", id);
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

// [GET]/users/excel
const getUsersExcel = async (requestParams) => {
  console.log(TAG, `getUsersExcel([GET]/users/excel)`, "requestParams", requestParams);
  // await api.post(`/send-email`, data);
  await new Promise((resolve) => setTimeout(resolve, 300));
};

const getExcel = async (data) => {
  const res = await api.get("templates/excel/users", {params: data});
  return res.data;
}

export { deleteUser, getUser, getUsers, getUsersExcel, postUser, putUser, getExcel };
