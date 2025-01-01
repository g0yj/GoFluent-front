import { getLDF, getLDFDetail, getLDFs, getLdfList, postLdf, putLdf, postLdfEmail } from "../remote/api-ldf";

const TAG = "[service-ldf]";

const ServiceLDF = {
  /**
   *
   * @param {number} userId
   * @param {object} data
   * @param {date} data.date
   * @param {number} data.limit
   * @param {number} data.page
   *
   */
  getLdfList: async (userId, data) => {
    console.log(TAG, "getLdfList", "userId", userId, "data", data);
    return await getLDFs(userId, data);
  },
  /**
   *
   * @param {number} userId
   * @param {number} ldfId
   * @returns
   */
  getLdf: async (userId, ldfId) => {
    console.log(TAG, "getLdf", "userId", userId, "ldfId", ldfId);
    return await getLDF(userId, ldfId);
  },
  getLdfDetail: async (ldfId) => {
    return await getLDFDetail(ldfId);
  },
  getLdfLists: async (data) => {
    return await getLdfList(data);
  },
  registLdf: async (userId, data) => {
    return await postLdf(userId, data);
  },
  modifyLdf: async (ldfId, data) => {
    return await putLdf(ldfId, data);
  },
  emailLdf: async (data) => {
    return await postLdfEmail(data);
  }
};

export default ServiceLDF;
