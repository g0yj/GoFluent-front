import { getOptions } from "../remote/api-options";
import {
  createTeacher,
  createTeacherSchedules,
  deleteTeachers,
  getAttendances,
  getAttendancesDay,
  getTeacher,
  getTeacherSchedules,
  getTeachers,
  putTeachers,
  getCgt,
  postCgttimes,
  putCgt,
  putDeletecgt,
  getWorked,
  getUserList,
  teacherSort,
} from "../remote/api.teachers";

const ServiceTeacher = {
  /**
   *
   * @param {string} fields TEACHERS(강사),CONSULTANTS(상담사)
   */
  getTeacherOptionsList: async (fields) => {
    const res = await getOptions(fields);
    return res;
  },
  getTeachers: async (queryParams) => {
    const res = await getTeachers(queryParams);
    return res;
  },

  getTeacher: async (id) => {
    const res = await getTeacher(id);
    return res;
  },
  modifyTeacher: async (id, data) => {
    const res = await putTeachers(id, data);
    return res;
  },
  deleteTeacher: async (id) => {
    const res = await deleteTeachers(id);
    return res;
  },
  getTeacherSchedules: async (id, queryParams) => {
    const res = await getTeacherSchedules(id, queryParams);
    return res;
  },
  createTeacherSchedules: async (id, data) => {
    const res = await createTeacherSchedules(id, data);
    return res;
  },
  createTeacher: async (data) => {
    await createTeacher(data);
  },

  getCgt: async  (queryParams) => {
    const res = await getCgt(queryParams);
    return res;
  },

  getCgttimes: async (queryParams) => {
    const res = await postCgttimes(queryParams);
    return res;
  },

  putCgt: async (data) => {
    const res = await putCgt(data);
    return res;
  },

  deleteCgt: async (data) => {
    const res = await putDeletecgt(data);
    return res;
  },

  getWorked: async (queryParams) => {
    const res = await getWorked(queryParams);
    return res;
  },
  /**
   *
   * @description status Y출석 N결석
   * @description yearMonth YYYY-MM
   *
   */
  getAttendances: async (queryParams) => {
    const res = await getAttendances(queryParams);
    return res;
  },
  getAttendancesDay: async (queryParams) => {
    const res = await getAttendancesDay(queryParams);
    return res;
  },
  getUserList: async (data) => {
    const res = await getUserList(data);
    return res;
  },
  teacherSort: async (data) => {
    const res = await await teacherSort(data);
    return res;
  }
};

export default ServiceTeacher;
