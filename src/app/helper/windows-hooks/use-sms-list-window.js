import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * SMS 발송 내역 윈도우 훅
 * @returns {{smsList: Array, openSmsListWindow: Function}}
 */
const useSmsListWindow = () => {
  const [data, setData] = useCrossTab(WINDOWS.SMS_LIST.id, []);

  const openSmsListWindow = (data) => {
    setData(data);
    openWindow(WINDOWS.SMS_LIST);
  };

  return { smsList: data, openSmsListWindow };
};

export default useSmsListWindow;
