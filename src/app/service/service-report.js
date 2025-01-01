import { getReport, getReports, putReport,getReportExcel } from "../remote/api-report";

const TAG = "[service-report]";

const ServiceReport = {
  /**
   *
   * @param {object} data
   * @param {date} data.dateFrom
   * @param {date} data.dateTo
   * @param {number} data.teacherId
   * @param {string} data.search
   * @param {string} data.keyword
   * @param {string} data.courseStatus
   * @param {string} data.reportCondition
   * @param {number} data.limit
   * @param {number} data.page
   * @param {object} data.order
   * @param {string} data.direction
   *
   */
  getReportList: async (data) => {
    console.log(TAG, "getReportList", "data", data);
    return await getReports(data);
  },

  getReport: async (id) => {
    return await getReport(id);
  },
  setReport: async (id, data) => {
    return await putReport(id, data);
  },
  getReportExcel: async (data) => {
    return await getReportExcel(data);
  },
};

export default ServiceReport;
