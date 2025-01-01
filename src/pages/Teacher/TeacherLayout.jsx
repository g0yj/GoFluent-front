import storage from "@/app/local/local-storage";
import Buttons from "@/components/Buttons";
import { clear } from "@/redux/login-user-store";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

// 강사용 페이지 레이아웃입니다.
const TeacherLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loginUser = useSelector((state) => state.loginUser);
  const dispatch = useDispatch();

  const onClickLogout = async () => {
    dispatch(clear());
    storage.loginedId.set("");
    storage.loginedToken.set("");

    navigate("/admin/login");
  };


  if (location.pathname === "/admin/teacher") {
    return <Navigate to="/admin/teacher/learner-management" replace={true} />;
  }

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
              to="/admin/teacher/learner-management"
            >
              Learner management
            </NavLink>
            <div style={{"font-size": "var(--subtitle)", "color": "var(--white)"}}>
            Daily schedule [
            <NavLink className="ui-link primary" to="/admin/teacher/daily-schedule">
               Korean
            </NavLink>
             | 
            <NavLink className="ui-link primary" to="/admin/teacher/daily-schedule-english">English</NavLink> ]
            </div>
            <NavLink className="ui-link primary" to="/admin/teacher/report">
              Report
            </NavLink>
            <NavLink className="ui-link primary" to="/admin/teacher/attendance-rate">
              Attendance rate
            </NavLink>
            <NavLink className="ui-link primary" to="/admin/teacher/absence-rate">
              Absence rate
            </NavLink>
          </nav>
        </div>

        <div className="ui-status-wrap">
          <Buttons className="grey small" onClick={onClickLogout}>LogOut</Buttons>
        </div>
      </header>
      <main className="page-main-wrap">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
