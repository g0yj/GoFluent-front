import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { api, apiV2, apiV3 } from "./app/remote/api";
import Alert from "./components/Alert";
import { set } from "./redux/error-store";
import router from "./routes";

const App = () => {
  const dispatch = useDispatch();

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("interceptors error ==>", error.response.data.message);
      if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(error.response.data.message)) {
        dispatch(set({ message: error.response.data.message }));
      }
      return Promise.reject(error);
    }
  );
  apiV2.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("interceptors error ==>", error.response.data.message);
      if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(error.response.data.message)) {
        dispatch(set({ message: error.response.data.message }));
      }
      return error;
    }
  );
  apiV3.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("interceptors error ==>", error.response.data.message);
      if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(error.response.data.message)) {
        dispatch(set({ message: error.response.data.message }));
      }
      return error;
    }
  );
  return (
    <>
      <RouterProvider router={router} />
      <Alert />
    </>
  );
};

export default App;
