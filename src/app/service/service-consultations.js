import {
  createConsult,
  deleteConsult,
  deleteHistory,
  getConsultation,
  getConsultations,
  getConsultationsDetail,
  getConsultationsDetailHistory,
  getConsultationsFromUserId,
  modifyConsult,
  postConsultations,
  postConsultationUser,
  postHistory,
  putConsultations,
} from "../remote/api-consultations";

const TAG = "[service-resv]";

const ServiceConsultations = {
  getConsultationList: async (data) => {
    console.log(TAG, "getCourseList", "data", data);
    return await getConsultations(data);
  },
  getConsultation: async (userId, id) => {
    return await getConsultation(userId, id);
  },
  getConsultationListFromUserId: async (id) => {
    console.log(TAG, "getCourseList", "id", id);
    return await getConsultationsFromUserId(id);
  },
  getConsultationDetail: async (id) => {
    return await getConsultationsDetail(id);
  },
  getConsultationDetailHistory: async (id) => {
    console.log(TAG, "getCourseList", "id", id);
    return await getConsultationsDetailHistory(id);
  },
  createConsultation: async (memberId, data) => {
    console.log(TAG, "postConsultation", "memberId", memberId, JSON.stringify(data));
    return await postConsultations(memberId, data);
  },
  modifyConsultation: async (userId, id, data) => {
    return await putConsultations(userId, id, data);
  },
  createHistory: async (id, data) => {
    return await postHistory(id, data);
  },
  deleteHistory: async (id) => {
    return await deleteHistory(id);
  },
  registerConsultUser: async (id, data) => {
    return await postConsultationUser(id, data);
  },
  modifyConsult: async (id, data) => {
    return await modifyConsult(id, data);
  },
  createConsult: async (data) => {
    return await createConsult(data);
  },
  deleteConsult: async (id) => {
    return await deleteConsult(id);
  },
};

export default ServiceConsultations;
