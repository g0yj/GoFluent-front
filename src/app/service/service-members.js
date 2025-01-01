import {
  deleteUser,
  getUser,
  getUsers,
  getUsersExcel,
  postUser,
  putUser,
  getExcel,
} from "../remote/api-users";

const TAG = "[service-members]";

// 회원 기본
const ServiceMember = {
  /**
   * @param {*} data
   * data: { page, limit, startDate, endDate, isActive, isRegistered, search, keyword}
   */
  getList: (data) => {
    console.log(TAG, "getMemberList", "data", data);
    return getUsers(data);
  },
  get: (id) => {
    console.log(TAG, "getMember", "id", id);
    return getUser(id);
  },
  /**
   * @param {*} data
   * data: { page, limit, startDate, endDate, isActive, isRegistered, search, keyword}
   */
  register: (data) => {
    console.log(TAG, "registerMember", "data", data);
    return postUser(data);
  },
  update: (id, data) => {
    console.log(TAG, "updateMember", "id", id, "data", data);
    return putUser(id, data);
  },
  delete: (id) => {
    console.log(TAG, "deleteMember", "id", id);
    return deleteUser(id);
  },
  /**
   * @param {*} data
   * data: { page, limit, startDate, endDate, isActive, isRegistered, search, keyword}
   */
  downloadExcel: (data) => {
    console.log(TAG, "downloadMemberListExcel", "data", data);
    return getUsersExcel(data);
  },

  getExcel: (data) => {
    return getExcel(data);
  },
};

export default ServiceMember;
