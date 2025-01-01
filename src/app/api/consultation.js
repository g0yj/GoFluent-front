import storage from "../local/local-storage";
import { apiV2 } from "../remote/api";

/**
 *
 * @description 상담고객 목록
 * @param https://ilovecorea.github.io/lms-docs/#tag/%ED%9A%8C%EC%9B%90/operation/createUser
 *
 */
export const listConsultation = async (data) => {
  const res = await apiV2.get(`/consultation/v1`, { params: data });
  return res.data;
};
/**
 *
 * @description 상담 관리 등록
 * @param https://ilovecorea.github.io/lms-docs/#tag/%EC%83%81%EB%8B%B4%EA%B4%80%EB%A6%AC/operation/listConsultation
 *
 */
export const createConsultation = async (data) => {
  const token = await storage.loginedToken.get();
  const res = await apiV2.post(`/consultation/v1`, data, {
    headers: { "content-type": "multipart/form-data", Authorization: token },
  });
  return res.data;
};
