import { api } from "./api";

const TAG = "[api-lecture]";

// [GET]/users/{userId}/lectures/{lectureId}
const getLecture = async (userId, lectureId) => {
  console.log(
    TAG,
    `getLecture([GET]/users/{userId}/lectures/{lectureId})`,
    "userId",
    userId,
    "lectureId",
    lectureId
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  // const res = await api.get(`/users/${id}/test/excel`);
  // return res.data;

  return {};
};

// [PUT]/users/${userId}/courses/${lectureId}
const putLecture = async (userId, courseId, data) => {
  const res = await api.put(`/users/${userId}/courses/${courseId}`, data);
  return res.data;
};

const getDetailLecture = async (userId, courseId) => {
  const res = await api.get(`/users/${userId}/courses/${courseId}`);
  return res.data;
}

// [GET]/users/{id}/courses/{courseId}/histories
const getLectureHistories = async (userId, courseId, page) => {
  const res = await api.get(`/users/${userId}/courses/${courseId}/histories`, {
    params: { page },
  });
  return res.data;
};

export { getLecture, getLectureHistories, putLecture, getDetailLecture };
