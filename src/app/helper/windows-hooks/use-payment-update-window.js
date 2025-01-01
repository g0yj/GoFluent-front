import { WINDOWS, openWindow } from "../helper-window";
import useCrossTab from "@/hooks/useCrossTab";

/**
 * 미리보기 모달
 * @returns {}
 */
const usePaymentUpdateWindow = () => {
    const [paymentInfo, setPaymentInfo] = useCrossTab(WINDOWS.PAYMENT_UPDATE.id, []);
    const [updateOpen, setUpdateOpen] = useCrossTab(WINDOWS.PAYMENT_UPDATE.updateOpen, false);
  /**
   *
   */
  const openPaymentUpdateWindow = (paymentInfo) => {
    setPaymentInfo(paymentInfo);
    openWindow(WINDOWS.PAYMENT_UPDATE);
  };

  const setNewState = (open) => {
    setUpdateOpen(open);
  }

  return { paymentInfo, updateOpen, openPaymentUpdateWindow, setNewState };
};

export default usePaymentUpdateWindow;
