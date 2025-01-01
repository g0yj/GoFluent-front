import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 회원 테스트 결과 프린트를 위한 윈도우 훅
 * @returns {{memberTest: object, openPrintMemberTestWindow: Function}}
 */
const usePrintMemberTestWindow = () => {
  const [memberTest, setMemberTest] = useCrossTab(WINDOWS.PRINT_MEMBER_TEST.id, {});

  /**
   *
   * @param {object} memberTest // 회원 테스트 결과
   */
  const openPrintMemberTestWindow = (memberTest) => {
    setMemberTest(memberTest);
    openWindow(WINDOWS.PRINT_MEMBER_TEST);
  };

  return { memberTest, openPrintMemberTestWindow };
};

export default usePrintMemberTestWindow;
