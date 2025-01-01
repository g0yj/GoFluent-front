import storage from "@/app/local/local-storage";
import Buttons from "@/components/Buttons";
import { clear } from "@/redux/login-user-store";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

// 운영자용 페이지 레이아웃입니다.
const SystemOperatorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loginUser = useSelector((state) => state.loginUser);
  const dispatch = useDispatch();

  //상단 nav 클릭시 default page
  if (location.pathname === "/operator") {
    return <Navigate to="/operator/members/member" replace={true} />;
  } else if (location.pathname === "/operator/members") {
    return <Navigate to="/operator/members/member" replace={true} />;
  } else if (location.pathname === "/operator/teachers") {
    return <Navigate to="/operator/teachers/teacher" replace={true} />;
  } else if (location.pathname === "/operator/sales") {
    return <Navigate to="/operator/sales/daily-sales" replace={true} />;
  } else if (location.pathname === "class-schedule") {
    return <Navigate to="/operator/class-schedule" replace={true} />;
  } else if (location.pathname === "/operator/statistics") {
    return <Navigate to="/operator/statistics/sms-status" replace={true} />;
  } else if (location.pathname === "/management/employee") {
    return <Navigate to="/management/employee" replace={true} />;
  }

  const onClickLogout = async () => {
    dispatch(clear());
    storage.loginedId.set("");
    storage.loginedToken.set("");

    navigate("/login");
  };

  if (loginUser)
    return (
      <div className="layout-contents-wrap">
        <header className="ui-header-wrap">
          <div>
            <NavLink className="ui-logo small">
              <div className="title">English Channel</div>
            </NavLink>
            <nav className="ui-gnb-wrap">
              <NavLink
                className={(navData) =>
                  navData.isActive ? "ui-link primary active" : "ui-link primary"
                }
                to="/operator/members"
              >
                회원관리
              </NavLink>
              <NavLink className="ui-link primary" to="/operator/teachers">
                강사관리
              </NavLink>
              <NavLink className="ui-link primary" to="/operator/sales">
                정산관리
              </NavLink>
              <NavLink className="ui-link primary" to="/operator/class-schedule">
                강의시간표
              </NavLink>
              <NavLink className="ui-link primary" to="/operator/statistics">
                통계보고서
              </NavLink>
              <NavLink className="ui-link primary" to="/operator/management/employee">
                홈페이지관리
              </NavLink>
            </nav>
          </div>

          <div className="ui-status-wrap">
            <Buttons className="grey small" onClick={onClickLogout}>
              LogOut
            </Buttons>
          </div>
        </header>
        <main className="page-main-wrap">
          <Outlet />
        </main>
      </div>
    );
};

export default SystemOperatorLayout;
