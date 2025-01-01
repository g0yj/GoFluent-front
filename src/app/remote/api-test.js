import storage from "../local/local-storage";
import { api } from "./api";

const TAG = "[api-test]";

// [GET]/users/{id}/test
const getUserTestList = async (id) => {
  console.log(TAG, `getUserTest([GET]/users/{id}/test)`, "id", id);

  const res = await api.get(`/users/${id}/levelTests`);
  return res.data;
};
const getUserTest = async (id, testId) => {
  const res = await api.get(`/users/${id}/levelTests/${testId}`);
  return res.data;
};

// [GET]/users/{id}/test/excel
const getUserTestExcel = async (id) => {
  console.log(TAG, `getUserTestExcel([GET]/users/{id}/test/excel)`, "id", id);
  await new Promise((resolve) => setTimeout(resolve, 300));
  // const res = await api.get(`/users/${id}/test/excel`);
  // return res.data;

  return "";
};

// [POST]/users/{id}/test
const postUserTest = async (id, data) => {
  const token = await storage.loginedToken.get();

  await api.post(`/users/${id}/levelTests`, data, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: token,
    },
  });
};

// [PUT]/users/{id}/test
const putUserTest = async (id, testId, data) => {
  const token = await storage.loginedToken.get();
  await api.put(`/users/${id}/levelTests/${testId}`, data, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: token,
    },
  });
};

// [DELETE]/users/{id}/test
const deleteUserTest = async (id, testId) => {
  console.log(TAG, `postUserTest([DELETE]/users/{id}/test)`, "id", id);
  await api.delete(`/users/${id}/levelTests/${testId}`);
};

export {
  deleteUserTest,
  getUserTest,
  getUserTestExcel,
  getUserTestList,
  postUserTest,
  putUserTest,
};
