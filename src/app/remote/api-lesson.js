import { api } from "./api";

const TAG = "[api-lessons]";

/**
 * [GET]/users/{userId}/lessons
 * @param {string} userId // 회원 식별키
 * @param {object} queryParams // 쿼리 파람
 * @param {string} queryParams.year // 년
 * @param {string} queryParams.month // 월
 * @param {string} queryParams.day // 일
 * @param {string} queryParams.page
 * @param {string} queryParams.limit
 */
const getLessons = async (userId, queryParams) => {
  console.log(
    TAG,
    `getLessons([GET]/users/{userId}/lessons)`,
    "userId",
    userId,
    "queryParams",
    queryParams
  );
  const res = await api.get(`/users/${userId}/reservations`, { params: queryParams });
  return res.data;
};

/**
 * [PUT]/users/{userId}/lessons/{lessonId}/report
 * @param {string} userId // 회원 식별키
 * @param {string} lessonId // 학습 식별키
 * @param {object} requestBody // 요청 바디
 * @param {string} requestBody.todayLesson
 * @param {string} requestBody.lessonContent
 * @param {string} requestBody.nextLesson
 *
 */
const putLessonReport = async (userId, lessonId, requestBody) => {
  console.log(
    TAG,
    `putLessonReport([PUT]/users/{userId}/lessons/{lessonId}/report)`,
    "userId",
    userId,
    "lessonId",
    lessonId,
    "requestBody",
    requestBody
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  // const res = await api.put(`/users/${userId}/lessons/{lessonId}/report`, requestBody);
  // return res.data;

  return {
    label: "프랭크 왕초보",
    list: [
      {
        시간: "2024-04-04",
        과정: "PT 24회 3개월",
        콘텐츠: "",
        강사: "Olivia",
        "출결(admin)": "예약",
        "출결(tutor)": "-",
        보고서: "1.xxxx\n2.yyyy\n3.zzzz",
      },
      {
        시간: "2024-04-04",
        과정: "PT 24회 3개월",
        콘텐츠: "",
        강사: "Olivia",
        "출결(admin)": "예약",
        "출결(tutor)": "-",
        보고서: "",
      },
    ],
  };
};

export { getLessons, putLessonReport };
