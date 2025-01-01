import useCrossTab from "@/hooks/useCrossTab";
import { WINDOWS, openWindow } from "../helper-window";

const useChangeEmailWindow = () => {
    const [emailInfo, setEmailInfo] = useCrossTab(WINDOWS.CHANGE_EMAIL.id, {});

    const openChangeEmailWindow = (info) => {
        setEmailInfo(info);
        openWindow(WINDOWS.CHANGE_EMAIL);
    };

    return { emailInfo, openChangeEmailWindow};
};

export default useChangeEmailWindow;