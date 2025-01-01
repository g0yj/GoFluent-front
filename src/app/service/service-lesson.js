import { getLessons, putLessonReport } from "../remote/api-lesson";

const TAG = "[service-lesson]";

const ServiceLesson = {
  getList: (memberId, data) => {
    console.log(TAG, "getList");
    return getLessons(memberId, data);
  },
  updateReport: (memberId, learningId, data) => {
    console.log(TAG, "updateReport");
    return putLessonReport(memberId, learningId, data);
  },
};

export default ServiceLesson;
