import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 회원상세 탭 윈도우 훅
 * @returns {{member: Object,initialLabel:String, openMemberDetailTabsWindow: Function}}
 */
const useMemberDetailTabsWindow = () => {
  const [member, setMember] = useCrossTab(WINDOWS.MEMBER_DETAIL_TABS.id, null);
  const [initialLabel, setInitialLabel] = useCrossTab(WINDOWS.MEMBER_DETAIL_TABS.label, null);

  const openMemberDetailTabsWindow = (member, label) => {
    setMember(member);
    setInitialLabel(label);
    openWindow(WINDOWS.MEMBER_DETAIL_TABS);
  };

  return { member, initialLabel, openMemberDetailTabsWindow };
};

export default useMemberDetailTabsWindow;
