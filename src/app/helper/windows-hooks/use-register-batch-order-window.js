import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 일괄주문등록 윈도우 훅
 * @returns {{memberList: Array, openEmailWindow: Function}}
 */
const useRegisterBatchOrderWindow = () => {
  const [memberList, setMemberList] = useCrossTab(WINDOWS.REGISTER_BATCH_ORDER.id, []);

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].xxx // 뭘 사용할지 아직 모름
   */
  const openRegisterBatchOrderWindow = (memberList) => {
    if (memberList.length === 0) {
      alert("선택된 회원이 없습니다.");
      return;
    }

    setMemberList([...memberList]);
    openWindow(WINDOWS.REGISTER_BATCH_ORDER);
  };

  return { memberList, openRegisterBatchOrderWindow };
};

export default useRegisterBatchOrderWindow;
