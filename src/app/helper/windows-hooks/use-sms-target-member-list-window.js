import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * SMS 대상자리스트 윈도우 훅
 * @returns {{ data:Object, openSmsTargetMemberListWindow: Function}}
 */
const useSmsTargetMemberListWindow = () => {
  const [data, setDate] = useCrossTab(WINDOWS.SMS_TARGET_MEMBER_LIST.id, []);

  const openSmsTargetMemberListWindow = (data) => {
    setDate(data);
    openWindow(WINDOWS.SMS_TARGET_MEMBER_LIST);
  };

  return { data, openSmsTargetMemberListWindow };
};

export default useSmsTargetMemberListWindow;
