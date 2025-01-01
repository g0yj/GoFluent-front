import { deleteConsult, deleteSms } from "../remote/api-consultations";
import {
  deleteTeachers,
  getEvaluationList,
  getSms,
  getSmsHoldList,
  getSmsList,
  getTargetMemberList,
  putSms,
  getGradeMember,
  getSmsExcel,
} from "../remote/api-sms";

const ServiceSms = {
  /**
   *
   * @param {object} data
   * @param {date} data.sendDateFrom
   * @param {date} data.sendDateTo
   * @param {String} data.sendType
   * @param {string} data.search
   * @param {string} data.keyword
   *
   */
  getSmsList: async (data) => {
    return await getSmsList(data);
  },

  getSms: async (id) => {
    return await getSms(id);
  },
  setSms: async (id, data) => {
    return await putSms(id, data);
  },
  deleteTeacher: async (id) => {
    const res = await deleteTeachers(id);
    return res;
  },
  deleteConsult: async (id) => {
    return await deleteConsult(id);
  },
  deleteSms: async (ids) => {
    await deleteSms(ids);
  },
  getEvaluationList: async (data) => {
    return await getEvaluationList(data);
  },
  getTargetMemberList: async (id, data) => {
    return await getTargetMemberList(id, data);
  },
  getSmsHoldList: async (queryParams) => {
    return await getSmsHoldList(queryParams);
  },
  getGradeMember : async (queryParams) => {
    const res = await getGradeMember(queryParams);
    return res;
  },
  getSmsExcel: async (queryParams) => {
    const res = await getSmsExcel(queryParams);
    return res;
  }
};

export default ServiceSms;
