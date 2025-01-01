import {
  deleteUserTest,
  getUserTest,
  getUserTestExcel,
  getUserTestList,
  postUserTest,
  putUserTest,
} from "../remote/api-test";

const TAG = "[service-test]";

// 회원 테스트
const ServiceTest = {
  getList: (id) => {
    return getUserTestList(id);
  },
  get: (id, testId) => {
    return getUserTest(id, testId);
  },
  downloadExcel: (id) => {
    console.log(TAG, "downloadExcel", "id", id);
    return getUserTestExcel(id);
  },
  register: (id, data) => {
    console.log(TAG, "register", "id", id, "data", data);
    return postUserTest(id, data);
  },
  update: (id, testId, data) => {
    return putUserTest(id, testId, data);
  },
  delete: (id, testId) => {
    console.log(TAG, "delete", "id", id);
    return deleteUserTest(id, testId);
  },
};

export default ServiceTest;
