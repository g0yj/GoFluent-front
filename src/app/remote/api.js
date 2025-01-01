import store from "@/redux/store";
import axios from "axios";
import storage from "../local/local-storage";

const api = axios.create({
  baseURL: "http://localhost:8080/api/admin/v1/",
  // baseURL: "http://223.130.150.83:8080/admin/v1/",
  timeout: 5000,
  headers: {
    "Content-type": "application/json; charset=UTF-8",
    Accept: "application/json; charset=UTF-8",
  },
  withCredentials: true,
});
/**
 * @deprecated
 */
const apiV2 = axios.create({
  baseURL: "http://englishchannel.co.kr:8080/api/",
  // baseURL: "http://223.130.150.83:8080/",
  timeout: 5000,
  headers: {
    "Content-type": "application/json; charset=UTF-8",
    Accept: "application/json; charset=UTF-8",
  },
  withCredentials: true,
});

const apiV3 = axios.create({
  baseURL: "/api/teacher/v1/",
  // baseURL: "http://223.130.150.83:8080/teacher/v1/",
  timeout: 5000,
  headers: {
    "Content-type": "application/json; charset=UTF-8",
    Accept: "application/json; charset=UTF-8",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().loginUser.token || storage.loginedToken.get();
    // "Login-Profile": "test", //테스트용 헤더
    config.headers["Authorization"] = token;
    return config;
  },
  (error) => console.error("request error ==>", error)
);
apiV2.interceptors.request.use(
  (config) => {
    const token = store.getState().loginUser.token || storage.loginedToken.get();
    // "Login-Profile": "test", //테스트용 헤더
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => console.error("request error ==>", error)
);
apiV3.interceptors.request.use(
  (config) => {
    const token = store.getState().loginUser.token || storage.loginedToken.get();
    // "Login-Profile": "test", //테스트용 헤더
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => console.error("request error ==>", error)
);

export { api, apiV2, apiV3 };
