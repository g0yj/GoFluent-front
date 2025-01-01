import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 예약등록 윈도우 훅
 * @returns {{memberList: Array, newState: Function, openRegisterResvWindow: Function}}
 */
const useRegisterResvWindow = () => {
  const [member, setMember] = useCrossTab(WINDOWS.REGISTER_RESV.id, {});
  const [course, setCourse] = useCrossTab(WINDOWS.REGISTER_RESV.course, []);
  const [resvOpen, setResvOpen] = useCrossTab(WINDOWS.REGISTER_RESV.resvOpen, false);

  /**
   *
   * @param {Array} memberList // 선택된 회원 리스트
   * @param {string} memberList[].id // 뭘 사용할지 아직 모름
   * @param {string} memberList[].name // 뭘 사용할지 아직 모름
   */
  const openRegisterResvWindow = (member, course) => {
    setMember(member);
    setCourse(course);
    openWindow(WINDOWS.REGISTER_RESV);
  };
  
  const newState = (resv) => {
    setResvOpen(resv)
  }

  return { member, course, resvOpen, newState, openRegisterResvWindow };
};

export default useRegisterResvWindow;
