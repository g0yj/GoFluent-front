import { clear } from "@/redux/error-store";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Alert = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();

  const clearMessage = useCallback(() => {
    dispatch(clear());
  }, [dispatch]);

  useEffect(() => {
    if (error.message) {
      alert(error.message);
      clearMessage();
    }
  }, [clearMessage, error]);

  return <div />;
};

export default Alert;
