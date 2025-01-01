import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 주문 등록 모달
 * @returns {{member: Object,order: Object, openOrderWindow: Function}}
 */
const useOrderWindow = () => {
  const [member, setMember] = useCrossTab(WINDOWS.ORDER.id, []);
  const [order, setOrder] = useCrossTab(WINDOWS.ORDER.order, []);
  const [orderOpen, setOrderOpen] = useCrossTab(WINDOWS.ORDER.orderOpen, false);

  /**
   *
   * @param {Object} member // 선택된 회원
   * @param {Object} order // 선택된 주문
   */
  const openOrderWindow = (memberId, orderId) => {
    setMember(memberId);
    setOrder(orderId);
    openWindow(WINDOWS.ORDER);
  };

  const setChangeOrder = (data) => {
    setOrder(data);
  }

  const orderOpenStatus = (open) => {
    setOrderOpen(open);
  }

  return { member, order, orderOpen, openOrderWindow, setChangeOrder, orderOpenStatus };
};

export default useOrderWindow;
