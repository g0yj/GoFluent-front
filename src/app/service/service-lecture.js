import { getLecture, getLectureHistories, putLecture, getDetailLecture } from "../remote/api-lecture";

const TAG = "[service-lecture]";

const ServiceLecture = {
  get: (memberId, lectureId) => {
    console.log(TAG, "get", "memberId", memberId, "lectureId", lectureId);
    return getLecture(memberId, lectureId);
  },
  update: (memberId, courseId, data) => {
    return putLecture(memberId, courseId, data);
  },
  getHistories: (memberId, courseId, page) => {
    return getLectureHistories(memberId, courseId, page);
  },
  getDetailLecture: (memberId, courseId) => {
    return getDetailLecture(memberId, courseId);
  },
};

export default ServiceLecture;
