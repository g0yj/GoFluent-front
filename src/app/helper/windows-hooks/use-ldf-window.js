import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 회원 LDF 윈도우 훅
 * @returns {{id: number, openLdfWindow: Function}}
 */
const useLdfWindow = () => {
  const [id, setId] = useCrossTab(WINDOWS.LDF_DETAIL.id, []);

  const openLdfWindow = (id) => {
    setId(id);
    openWindow(WINDOWS.LDF_DETAIL);
  };

  return { id, openLdfWindow };
};

export default useLdfWindow;
