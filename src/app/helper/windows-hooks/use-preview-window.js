import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

/**
 * 미리보기 모달
 * @returns {}
 */
const usePreviewWindow = () => {
  const [previewInfo, setPreviewInfo] = useCrossTab(WINDOWS.SEND_PREVIEW.id, []);
  /**
   *
   */
  const openPreviewWindow = (previewInfo) => {
    setPreviewInfo(previewInfo);
    openWindow(WINDOWS.SEND_PREVIEW);
  };

  return {previewInfo, openPreviewWindow };
};

export default usePreviewWindow;
