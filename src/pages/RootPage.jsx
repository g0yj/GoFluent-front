import { Navigate } from "react-router-dom";

const RootPage = () => {
  // TODO: 로그인 여부 및 권한 체크해서 분기 필요
  // 로그인 OK -> /login
  // 로그인 NO
  //  -> 강사 권한 -> /teacher/*
  //  -> 운영자 권한 -> /operator/*

  return <Navigate to="/login" replace={true} />;
};

export default RootPage;
