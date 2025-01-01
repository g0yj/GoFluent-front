import { apiV2 } from "../remote/api";

/**
 *
 * @description 레벨 테스트 목록
 * @param https://ilovecorea.github.io/lms-docs/#tag/%ED%9A%8C%EC%9B%90/operation/listLevelTests
 *
 */
export const listLevelTests = async (id) => {
  const res = await apiV2.get(`/users/${id}/levelTests/v1`);
  return res.data;
};
