/**
 * 브라우저의 로컬 스토리지를 사용하기 위한 모듈
 */

const getItem = (key) => {
  return window.localStorage.getItem(key);
};
const setItem = (key, value) => {
  window.localStorage.setItem(key, value);
};

const STORAGE_KEY_LOGINED_ID = "loginedId";
const STORAGE_KEY_LOGINED_NAME = "loginedName";
const STORAGE_KEY_LOGINED_TYPE = "loginedType";
const STORAGE_KEY_LOGINED_TOKEN = "loginedToken";

const storage = {
  // 로그인했던 정보를 저장
  loginedId: {
    get() {
      return getItem(STORAGE_KEY_LOGINED_ID) || "";
    },
    set(id) {
      setItem(STORAGE_KEY_LOGINED_ID, id);
    },
  },
  loginedName: {
    get() {
      return getItem(STORAGE_KEY_LOGINED_NAME) || "";
    },
    set(id) {
      setItem(STORAGE_KEY_LOGINED_NAME, id);
    },
  },
  loginedType: {
    get() {
      return getItem(STORAGE_KEY_LOGINED_TYPE) || "teacher";
    },
    set(type) {
      setItem(STORAGE_KEY_LOGINED_TYPE, type);
    },
  },
  loginedToken: {
    get() {
      return getItem(STORAGE_KEY_LOGINED_TOKEN);
    },
    set(token) {
      setItem(STORAGE_KEY_LOGINED_TOKEN, token);
    },
  },
};

export default storage;
