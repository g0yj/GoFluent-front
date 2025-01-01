import { api } from "./api";

const TAG = "[api-courses]";

/**
 * [GET]/users/{userId}/courses
 * @param {string} userId // 회원 식별키
 * @param {string} queryParams // 쿼리파람
 * @param {string} queryParams.status //조회할 수강 상태 (VALID: 기본 조회, ATTENDING: 수강중, WAITING: 대기중, COMPLETE: 수강완료, REFUND: 환불)
 * @param {number} queryParams.limit
 * @param {number} queryParams.page
 */
const getCourses = async (userId, queryParams) => {
  console.log(
    TAG,
    `getCourses([GET]/users/{userId}/courses)`,
    "userId",
    userId,
    "queryParams",
    queryParams
  );
  const res = await api.get(`/users/${userId}/courses`, { params: queryParams });

  return res.data;
};

export { getCourses };
