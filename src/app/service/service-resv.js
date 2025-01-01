import { getCourses } from "../remote/api-courses";
import { getReservations, getCancelInclude } from "../remote/api-reservations";
import {
  deleteReservation,
  deleteReservationTip,
  getReservationSchedulesByDate,
  getReservationSchedulesByTime,
  getScheduleListByWeek,
  getReservationTips,
  postReservation,
  postReservationTip,
  putReservation,
  putReservationTip,
} from "../remote/api-resv";

const TAG = "[service-resv]";

// 회원 예약
const ServiceResv = {
  getCourseList: async (memberId, data) => {
    console.log(TAG, "getCourseList", "memberId", memberId, "data", data);
    return await getCourses(memberId, {
      status: data.status,
      limit: data.limit,
      page: data.page,
    });
  },
  getList: (memberId, courseId, data) => {
    console.log(TAG, "getList", "memberId", memberId, "courseId", courseId, "data", data);
    return getReservations(memberId, {
      courseId,
      page: data?.page,
      limit: data?.limit,
      dateFrom: data?.startDate,
      dateTo: data?.endDate,
      excludeCancel: data?.excludeCancel,
      excludeAttendance: data?.excludeAttendance,
    });
  },
  getCancelInclude: (memberId, courseId, data) => {
    return getCancelInclude(memberId, {
      courseId: courseId,
      dateFrom: data?.startDate,
      dateTo: data?.endDate,
      excludeCancel: data.excludeCancel,
      excludeAttendance: data.excludeAttendance,
      limit: data.limit,
      page: data.page,
    });
  },

  /**
   * @description  @ 날짜별 스케줄 조회
   * @param {number} userId 유저 id
   * @param {string} data.dateFrom 조회할 날짜 ~부터 (yyyy-MM-dd)
   * @param {string} data.dateTo 조회할 날짜 ~까지 (yyyy-MM-dd)
   * @param {string} data.teacherId 조회할 담임강사 식별키
   * @param {string} data.assistantTeacherId 조회할 부담임 강사 식별키
   */
  getScheduleListByDate: async (userId, data) => {
    console.log(TAG, "getScheduleListByDate", "userId", userId, "data", data);
    return await getReservationSchedulesByDate(userId, data);
  },
  getScheduleListByTime: async (userId, data) => {
    console.log(TAG, "getScheduleListByTime", "userId", userId, "data", data);
    return await getReservationSchedulesByTime(userId, data);
  },
  getScheduleListByWeek: async (userId, parammeter) => {
    return await getScheduleListByWeek(userId, parammeter);
  },
  createSchedule: (userId, data) => {
    return postReservation(userId, data);
  },
  delete: (memberId, courseId, resvId, reason) => {
    console.log(
      TAG,
      "delete",
      "memberId",
      memberId,
      "courseId",
      courseId,
      "resvId",
      resvId,
      "reason",
      reason
    );
    return deleteReservation(memberId, courseId, resvId, reason);
  },
  getTipList: (memberId, courseId) => {
    console.log(TAG, "getTipList", "memberId", memberId);
    return getReservationTips(memberId, courseId);
  },
  registerTip: (memberId, courseId, content) => {
    console.log(TAG, "registerTip", "memberId", memberId, "courseId", courseId, "content", content);
    return postReservationTip(memberId, courseId, content);
  },
  updateTip: (tipId, content) => {
    return putReservationTip(tipId, content);
  },
  deleteTip: (tipId) => {
    console.log(TAG, "deleteTip", "tipId", tipId);
    return deleteReservationTip(tipId);
  },
  cancelReservations: (id, data) => {
    return putReservation(id, data);
  },
};

export default ServiceResv;
