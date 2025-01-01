import { apiV2 } from "../remote/api";

/**
 *
 * @description 회원 목록 조회
 * @param https://ilovecorea.github.io/lms-docs/#tag/%ED%9A%8C%EC%9B%90/operation/listUsers
 *
 */
export const listUsers = async (data) => {
  const res = await apiV2.get(`/users/v1`, { params: data });
  return res.data;
};
/**
 *
 * @description 회원 등록
 * @param https://ilovecorea.github.io/lms-docs/#tag/%ED%9A%8C%EC%9B%90/operation/createUser
 *
 */
export const createUser = async (data) => {
  const res = await apiV2.post(`/users/v1`, data);
  return res.data;
};
/**
 *
 * @description 회원 기본정보 조회
 * @param https://ilovecorea.github.io/lms-docs/#tag/%ED%9A%8C%EC%9B%90/operation/getUser
 *
 */
export const getUser = async (id) => {
  const res = await apiV2.get(`/users/${id}/v1`);
  return res.data;
};
