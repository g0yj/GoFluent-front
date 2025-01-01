import { NavLink, Outlet, useLocation } from "react-router-dom";

// 강사관리 (1depth)
const TeacherManagementPage = () => {
  const location = useLocation();

  const onRefresh = (path) => {
    if (path === location.pathname) {
      window.location.reload();
    }
  };
  return (
    <>
      <nav className="ui-lnb-wrap">
        <div className="ui-lnb-inner">
          <NavLink
            className="link"
            to="/admin/operator/teachers/teacher"
            onClick={() => onRefresh("/admin/operator/teachers/teacher")}
          >
            강사관리
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/teachers/cgtSchedule"
            onClick={() => onRefresh("/admin/operator/teachers/cgtSchedule")}
          >
            CGT스케줄
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/teachers/attendance"
            onClick={() => onRefresh("/admin/operator/teachers/attendance")}
          >
            출석률
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/teachers/attendance-today"
            onClick={() => onRefresh("/admin/operator/teachers/attendance-today")}
          >
            출석률(일일)
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/teachers/absence"
            onClick={() => onRefresh("/admin/operator/teachers/absence")}
          >
            결석률
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
export default TeacherManagementPage;
