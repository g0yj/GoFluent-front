import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 회원관리 상세 탭 윈도우 훅
 */

const useLearnerManagementDetailTabsWindow = () => {
    const [member, setMember] = useCrossTab(WINDOWS.LEARNMANAGEMENT_DETAIL_TABS.id, null);
    const [initialLabel, setInitialLabel] = useCrossTab(WINDOWS.LEARNMANAGEMENT_DETAIL_TABS.label, null);
  
    const openLearnMemberDetailTabsWindow = (member, label) => {
      setMember(member);
      setInitialLabel(label);
      openWindow(WINDOWS.LEARNMANAGEMENT_DETAIL_TABS);
    };
  
    return { member, initialLabel, openLearnMemberDetailTabsWindow };
}

export default useLearnerManagementDetailTabsWindow;