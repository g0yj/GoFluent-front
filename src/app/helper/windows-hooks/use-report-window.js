import { WINDOWS, openWindow } from "../helper-window";

/**
 * 강의시간표 윈도우 훅
 * @returns {{ openReportWindow: Function}}
 */
const useReportWindow = () => {
  const openReportWindow = () => {
    openWindow(WINDOWS.REPORT);
  };

  return { openReportWindow };
};

export default useReportWindow;
