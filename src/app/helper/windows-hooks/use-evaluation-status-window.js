import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 강사 평가현황 윈도우 훅
 * @returns {{data:Object,openEvaluationStatusWindow: Function}}
 */
const useEvaluationStatusWindow = () => {
  const [data, setData] = useCrossTab(WINDOWS.EVALUATION_STATUS.id, []);

  const openEvaluationStatusWindow = (data) => {
    setData(data);
    openWindow(WINDOWS.EVALUATION_STATUS);
  };

  return { data, openEvaluationStatusWindow };
};

export default useEvaluationStatusWindow;
