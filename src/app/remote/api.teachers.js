import storage from "../local/local-storage";
import { api, apiV3 } from "./api";

const getTeachers = async (queryParams) => {
  const res = await api.get("/teachers", { params: queryParams });
  return res.data;
};
const putTeachers = async (id, data) => {
  const token = await storage.loginedToken.get();
  const res = await api.put(`/teachers/${id}`, data, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: token,
    },
  });
  return res.data;
};
const deleteTeachers = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};
const getTeacher = async (id) => {
  const res = await api.get(`/teachers/${id}`);
  return res.data;
};

const getTeacherSchedules = async (id, queryParams) => {
  const res = await api.get(`/teachers/${id}/schedules`, { params: queryParams });
  return res.data;
};
const createTeacherSchedules = async (id, data) => {
  const res = await api.post(`/teachers/${id}/schedules`, data);
  return res.data;
};

const createTeacher = async (data) => {
  const token = await storage.loginedToken.get();
  await api.post(`/teachers`, data, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const getAttendances = async (queryParams) => {
  const res = await api.get("teachers/attendances", { params: queryParams });
  return res.data;
};

const getAttendancesDay = async (queryParams) => {
  const res = await api.get("teachers/attendances/by-date", {params: queryParams});
  return res.data;
}

const getCgt = async (queryParams) => {
  const res = await api.get("teachers/cgt", {params: queryParams});
  return res.data;
};

const postCgttimes = async (data) => {
  const res = await api.get("teachers/cgttimes", {params: data});
  return res.data;
}

const putCgt = async (data) => {
  const res = await api.put("teachers/cgt", data);
  return res.data;
}

const getReservationCGT = async (data) => {
  const res = await api.post("teachers/reservationCgtList", data);
  return res.data;
}

const putDeletecgt = async (data) => {
  const res = await api.put("teachers/deletecgt", data);
  return res.data;
}

const getUserList = async (queryParams) => {
  const res = await apiV3.get("/users", {params: queryParams});
  return res.data;
}

const getWorked = async (queryParams) => {
  const res = await api.get("teachers/worked", {params: queryParams});
  return res.data;
}

const teacherSort = async (data) => {
  const res = await api.put("/teachers/sort", data);
  return res.data;
}

export {
  createTeacher,
  createTeacherSchedules,
  deleteTeachers,
  getAttendances,
  getAttendancesDay,
  getTeacher,
  getTeachers,
  getTeacherSchedules,
  putTeachers,
  getCgt,
  postCgttimes,
  putCgt,
  getReservationCGT,
  getUserList,
  putDeletecgt,
  getWorked,
  teacherSort,
};
