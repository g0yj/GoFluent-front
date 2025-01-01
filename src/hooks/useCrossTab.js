import { isDev } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";

/**
 * 탭 간의 데이터 교환을 위한 커스텀 훅
 * */
const useCrossTab = (pageKey, initialValue) => {
  const [sharedData, setSharedData] = useState(initialValue || "");
  const isNewSession = useRef(0);

  useEffect(() => {
    // development 환경에선(로컬에서 실행할 때) React.StrictMode로 인해 2번씩 실행되는 것 때문에 문제가 발생
    // production에서는 1번만 체크하는데, development 환경에선 2번 체크하도록 처리
    const isNewSessionCount = isDev ? 2 : 1;
    if (isNewSession.current < isNewSessionCount) {
      // 최초 한번만 저장되어 있는 값을 불러와서 설정
      const savedData = localStorage.getItem(pageKey);

      if (savedData && savedData !== "undefined") {
        setSharedData(JSON.parse(savedData));
      }

      isNewSession.current += 1;
    } else {
      // 그 이후엔 업데이트만
      try {
        localStorage.setItem(pageKey, JSON.stringify(sharedData));
      } catch (e) {
        console.error(e);
      }
    }
  }, [sharedData, pageKey]);

  // storage 이벤트
  // 로컬 스토리지가 바뀌었을 때 현재 state 값 갱신
  // 다른 창에서 감지 가능 -> A창에서 값을 바꾸면 B창에서도 값이 바뀜
  useEffect(() => {
    const onChangeStorage = (e) => {
      const { key, newValue } = e;
      if (key === pageKey) {
        setSharedData(JSON.parse(newValue));
      }
    };
    window.addEventListener("storage", onChangeStorage);
    return () => window.removeEventListener("storage", onChangeStorage);
  }, [pageKey]);

  return [sharedData, setSharedData];
};

export default useCrossTab;
