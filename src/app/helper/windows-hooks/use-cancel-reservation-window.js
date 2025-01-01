import { useState } from "react";
import { WINDOWS, openWindow } from "../helper-window";
import useCrossTab from "@/hooks/useCrossTab";

/**
 * 예약취소 윈도우 훅
 * @returns {{openCancelReservationWindow: Function}}
 */
const useCancelReservationWindow = () => {
  const [course, setCourse] = useCrossTab(WINDOWS.CANCEL_RESERVATION.course, []);
  const [member, setMember] = useCrossTab(WINDOWS.CANCEL_RESERVATION.member, []);
  const [cancelData, setCancelData] = useCrossTab(WINDOWS.CANCEL_RESERVATION.id, []);
  const [cancelResv, setCancelResv] = useCrossTab(WINDOWS.CANCEL_RESERVATION.cancelResv, false);

  const openCancelReservationWindow = (course, member, cancelData) => {
    setCourse(course);
    setMember(member);
    setCancelData([...cancelData])
    openWindow(WINDOWS.CANCEL_RESERVATION);
  };

  const CancelResvOpen = (open) => {
    setCancelResv(open);
  }

  return { course, member, cancelData, cancelResv, openCancelReservationWindow, CancelResvOpen };
};

export default useCancelReservationWindow;
