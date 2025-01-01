import axios from "axios";
import { apiV2 } from "../remote/api";

/**
 *
 * @description 로그인
 */
export const login = async (data) => {
  const res = await axios.post(`http://localhost:8080/common/login/v1`, data, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
  });
  return res.data;
};
/**
 *
 * @description 로그아웃
 */
export const logout = async () => {
  const res = await apiV2.post(`/common/logout/v1`);
  return res.data;
};

export const TeacherType = [
  { id: "TEACHERS", title: "강사" },
  { id: "CONSULTANTS", title: "상담사" },
  { id: "MEMBER_CONSULTATION_TYPES", title: "회원 상담 유형" },
];
/**
 *
 * @description 공통 옵션 조회
 * @param fields TeacherType
 *
 */
export const options = async (data) => {
  const res = await apiV2.get(`/common/options/v1`, { params: data });
  return res.data;
};
