import { api } from "./api";

const TAG = "[api-reservations]";

/**
 * [GET]/users/{userId}/reservations
 * @param {string} userId // 회원 식별키
 * @param {object} queryParams // 쿼리 파람
 * @param {string} queryParams.courseId // 과정 id
 * @param {string} queryParams.dateFrom // yyyy-mm-dd
 * @param {string} queryParams.dateTo // yyyy-mm-dd
 * @param {string} queryParams.includeCancel // true: 취소포함
 * @param {string} queryParams.includeAttendance // true: 출결완료포함
 * @param {string} queryParams.page
 * @param {string} queryParams.limit
 */
const getReservations = async (userId, queryParams) => {
  console.log(
    TAG,
    `getReservations([GET]/users/{userId}/reservations`,
    "userId",
    userId,
    "queryParams",
    queryParams
  );
  const res = await api.get(`/users/${userId}/reservations`, { params: queryParams });
  return res.data;
};

const getCancelInclude = async (userId, queryParams) => {
  console.log(
    TAG,
    `getReservations([GET]/users/{userId}/reservations`,
    "userId",
    userId,
    "queryParams",
    queryParams
  );
  const res = await api.get(`/users/${userId}/reservations`, {params: queryParams});
  return res.data;
}

export { 
  getReservations,
  getCancelInclude,
};
