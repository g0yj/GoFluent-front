import {
  putCommonCode,
  createCommonCode,
  getCodeGroup,
  getAllCodeGroup,
  getCommonCode,
  getEmailUsers,
  getSmsUsers,
  getTemplates,
  postEmail,
  postPhone,
  postSms,
  putTemplates,
} from "../remote/api-common";

const ServiceCommon = {
  /**
   * data: {
   *    senderEmail: string, // 발신자 이메일
   *    title: string, // 이메일 제목
   *    contents: string, // 이메일 내용
   *    list: array<string>, // 수신 이메일 목록
   * }
   * */
  sendEmail: async (data) => {
    return await postEmail(data);
  },
  getEmailUsers: async (paramsQuery) => {
    return await getEmailUsers(paramsQuery);
  },
  getSmsUsers: async (paramsQuery) => {
    return await getSmsUsers(paramsQuery);
  },
  sendSms: async (data) => {
    return await postSms(data);
  },
  checkPhone: async (data) => {
    return await postPhone(data);
  },
  getTemplates: async () => {
    return await getTemplates();
  },
  updateTemplates: async (data) => {
    return await putTemplates(data);
  },
  /**
   *
   * @description - 상담관리 : 상담구분(100) , 처리상태(200), 카드종류(300)
   */
  getCodeGroup: async (id) => {
    return await getCodeGroup(id);
  },
  getAllCodeGroup: async () => {
    return await getAllCodeGroup();
  },
  getCommonCode: async (data) => {
    return await getCommonCode(data);
  },
  createCommonCode: async (data) => {
    await createCommonCode(data);
  },
  modifyCommonCode: async (codeId, data) => {
    await putCommonCode(codeId, data);
  },
};

export default ServiceCommon;
