import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 회원 강의시간표 윈도우 훅
 * @returns {{memberList: Array, openCourseAttendanceWindow: Function}}
 */
const useCourseAttendanceWindow = () => {
  const [member, setMember] = useCrossTab(WINDOWS.COURSE_ATTENDANCE.id, []);

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].id // 뭘 사용할지 아직 모름
   * @param {string} memberList[].name // 뭘 사용할지 아직 모름
   */
  const openCourseAttendanceWindow = (member) => {
    setMember({ ...member });
    openWindow(WINDOWS.COURSE_ATTENDANCE);
  };

  return { member, openCourseAttendanceWindow };
};

export default useCourseAttendanceWindow;
