import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 강사공지 윈도우 훅
 * @returns {{member: Object, openNoticeTeacherWindow: Function}}
 */
const useNoticeTeacherWindow = () => {
  const [member, setMember] = useCrossTab(WINDOWS.NOTICE_TEACHER.id, []);

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].name // 회원 이름
   * @param {string} memberList[].phone // 회원 휴대폰번호
   */
  const openNoticeTeacherWindow = (member) => {
    setMember({ ...member });
    console.log("openNoticeTeacherWindow", member);
    openWindow(WINDOWS.NOTICE_TEACHER);
  };

  return { member, openNoticeTeacherWindow };
};

export default useNoticeTeacherWindow;
