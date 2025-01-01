import { NavLink, Outlet, useLocation } from "react-router-dom";

// 회원관리(1depth)
const MemberManagementPage = () => {
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
            to="/admin/operator/members/member"
            onClick={() => onRefresh("/admin/operator/members/member")}
          >
            회원관리
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/members/academicReport"
            onClick={() => onRefresh("/admin/operator/members/academicReport")}
          >
            학사보고서
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/members/consult"
            onClick={() => onRefresh("/admin/operator/members/consult")}
          >
            상담관리
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default MemberManagementPage;
