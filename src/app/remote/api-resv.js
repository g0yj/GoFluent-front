import { api } from "./api";

const TAG = "[api-resv]";

// [GET]/users/{userId}/courses/{courseId}/reservations/schedules
const getReservationSchedules = async (userId, courseId, date) => {
  console.log(
    TAG,
    `getReservationSchedules([GET]/users/{userId}/courses/{courseId}/reservations/schedules)`,
    "userId",
    userId,
    "courseId",
    courseId,
    "date",
    date
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  // const res = await api.get(`/users/${id}/test/excel`);
  // return res.data;

  return "";
};

/**
 * @description @ [GET] 회원 날짜별 스케줄 조회
 */
const getReservationSchedulesByDate = async (userId, queryParams) => {
  console.log(
    TAG,
    `getReservationSchedulesByDate([GET]/v1/users/{id}/schedules/by-date)`,
    userId,
    queryParams
  );
  const res = await api.get(`/users/${userId}/schedules/by-date`, { params: queryParams });
  return res.data;
};
const getReservationSchedulesByTime = async (userId, queryParams) => {
  console.log(
    TAG,
    `getReservationSchedulesByDate([GET]/v1/users/{id}/schedules/by-date)`,
    userId,
    queryParams
  );
  const res = await api.get(`/users/${userId}/schedules/by-time`, { params: queryParams });
  return res.data;
};

const getScheduleListByWeek = async (userId, queryParams) => {
  const res = await api.get(`users/${userId}/schedules/by-week`, {params: queryParams});
  return res.data;
}

// [POST]users/{id}/reservations
const postReservation = async (userId, data) => {
  await api.post(`users/${userId}/reservations`, data);
};

// [DELETE]/users/{userId}/courses/{courseId}/reservations/{resvId}
const deleteReservation = async (userId, courseId, resvId, reason) => {
  console.log(
    TAG,
    `deleteReservation([DELETE]/users/{userId}/courses/{courseId}/reservations/{resvId})`,
    "userId",
    userId,
    "courseId",
    courseId,
    "resvId",
    resvId,
    "reason",
    reason
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  // await api.post(`/users/${id}/test`);
};

// [GET]/users/${userId}/notes
const getReservationTips = async (userId, courseId) => {
  console.log(
    TAG,
    `need change real data !! getReservationTips([GET]/users/${userId}/notes)`,
    "userId",
    userId
  );
  const res = await api.get(`/users/${userId}/notes`, { params: { courseId } });
  return res.data;
};

// [POST]/users/{userId}/courses/{courseId}/reservations/tips
const postReservationTip = async (userId, courseId, content) => {
  console.log(
    TAG,
    `postReservationTip([POST]/users/{id}/notes)`,
    "userId",
    userId,
    "courseId",
    courseId,
    "content",
    content
  );
  await api.post(`/users/${userId}/notes`, { courseId, content });
};

// [PUT]/users/{userId}/courses/{courseId}/reservations/tips/{tipId}
const putReservationTip = async (id, content) => {
  const res = await api.put(`/users/notes/${id}`, { content });
  return res.data;
};

// [DELETE]/users/{userId}/courses/{courseId}/reservations/tips/{tipId}
const deleteReservationTip = async (tipId) => {
  const res = await api.delete(`/users/notes/${tipId}`);
  return res.data;
};

const putReservation = async (id, data) => {
  const res = await api.put(`users/${id}/reservations`, data);
  return res.data;
};

export {
  deleteReservation,
  deleteReservationTip,
  getReservationSchedules,
  getReservationSchedulesByDate,
  getReservationSchedulesByTime,
  getScheduleListByWeek,
  getReservationTips,
  postReservation,
  postReservationTip,
  putReservation,
  putReservationTip,
};
