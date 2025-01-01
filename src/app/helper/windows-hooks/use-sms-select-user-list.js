import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * SMS 대상 선택 윈도우 훅
 * @returns {{memberList: Array, isSms:boolean,openSmsUserListWindow: Function}}
 */
const useSmsUserListWindow = () => {
  const [memberList, setMemberList] = useCrossTab(WINDOWS.SMS_USER_LIST.id, []);
  const [isSms, setIsSms] = useCrossTab(WINDOWS.SMS_USER_LIST.isSms, false);
  const [isNew, setIsNew] = useCrossTab(WINDOWS.SMS_USER_LIST.isNew, false);

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].name // 회원 이름
   * @param {string} memberList[].phone // 회원 휴대폰번호
   */
  const openSmsUserListWindow = (memberList, isSms) => {
    setMemberList([...memberList]);
    setIsSms(isSms);
    openWindow(WINDOWS.SMS_USER_LIST);
  };

  const setUserList = (memberList) => {
    setMemberList(memberList);
  };
  const setNewState = (isNew) => {
    setIsNew(isNew);
  };

  return { memberList, isSms, isNew, openSmsUserListWindow, setUserList, setNewState };
};

export default useSmsUserListWindow;
