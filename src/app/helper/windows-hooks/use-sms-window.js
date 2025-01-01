import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * SMS 발송 윈도우 훅
 * @returns {{memberList: Array, contentData:Object,openSmsWindow: Function}}
 */
const useSmsWindow = () => {
  const [memberList, setMemberList] = useCrossTab(WINDOWS.SEND_SMS.id, []);
  const [contentData, setContentData] = useCrossTab(WINDOWS.SEND_SMS.content, {});

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].name // 회원 이름
   * @param {string} memberList[].phone // 회원 휴대폰번호
   */
  const openSmsWindow = (memberList, contentData) => {
    // if (memberList.length === 0) {
    //   alert("선택된 회원이 없습니다.");
    //   return;
    // }

    setMemberList([...memberList]);
    setContentData(contentData);
    openWindow(WINDOWS.SEND_SMS);
  };

  return { memberList, contentData, openSmsWindow };
};

export default useSmsWindow;
