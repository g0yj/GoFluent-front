import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 주문등록 윈도우 훅
 * @returns {{memberList: Array, openEmailWindow: Function}}
 */
const useRegisterOrderWindow = () => {
  const [member, setMember] = useCrossTab(WINDOWS.REGISTER_ORDER.id, []);

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].id // 뭘 사용할지 아직 모름
   * @param {string} memberList[].name // 뭘 사용할지 아직 모름
   */
  const openRegisterOrderWindow = (member) => {
    setMember({ ...member });
    openWindow(WINDOWS.REGISTER_ORDER);
  };

  return { member, openRegisterOrderWindow };
};

export default useRegisterOrderWindow;
