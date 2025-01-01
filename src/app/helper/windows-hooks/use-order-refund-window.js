import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 주문 환불 모달
 * @returns {{ids: Object, openOrderRefundWindow: Function}}
 */
const useOrderRefundWindow = () => {
  const [ids, setIds] = useCrossTab(WINDOWS.ORDER_REFUND.id, []);
  const [refundOpen, setRefundOpen] = useCrossTab(WINDOWS.ORDER_REFUND.refundOpen, false);

  /**
   *
   * @param {Object} member // 선택된 회원
   * @param {Object} order // 선택된 주문
   */
  const openOrderRefundWindow = (member) => {
    setIds(member);

    openWindow(WINDOWS.ORDER_REFUND);
  };

  const setRefundState = (open) => {
    setRefundOpen(open);
  }

  return { ids, refundOpen, openOrderRefundWindow, setRefundState };
};

export default useOrderRefundWindow;
