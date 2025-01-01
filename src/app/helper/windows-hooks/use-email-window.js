import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 메일 발송 윈도우 훅
 * @returns {{memberList: Array, openEmailWindow: Function}}
 */
const useEmailWindow = () => {
  const [memberList, setMemberList] = useCrossTab(WINDOWS.SEND_EMAIL.id, []);

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].name // 회원 이름
   * @param {string} memberList[].email // 회원 이메일
   */
  const openEmailWindow = (memberList) => {
    if (memberList.length === 0) {
      alert("선택된 회원이 없습니다.");
      return;
    }

    setMemberList([...memberList]);
    openWindow(WINDOWS.SEND_EMAIL);
  };

  return { memberList, openEmailWindow };
};

export default useEmailWindow;
