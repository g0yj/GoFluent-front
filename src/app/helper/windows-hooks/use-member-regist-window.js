import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 상담관리 회원등록 윈도우 훅
 * @returns {{member: Object}}
 */
const useMemberRegistWindow = () => {
  const [member, setMember] = useCrossTab(WINDOWS.MEMBER_REGIST.id, []);
  const [isClose, setIsClose] = useCrossTab(WINDOWS.MEMBER_REGIST.isClose, false);

  const openMemberRegistWindow = (member) => {
    setMember(member);
    openWindow(WINDOWS.MEMBER_REGIST);
  };

  const setNewState = (open) => {
    setIsClose(open);
  }

  return { member, isClose, openMemberRegistWindow, setNewState };
};

export default useMemberRegistWindow;
