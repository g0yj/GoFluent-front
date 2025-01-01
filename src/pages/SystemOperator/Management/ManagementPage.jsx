import { NavLink, Outlet, useLocation } from "react-router-dom";

const ManagementPage = () => {
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
            to="/admin/operator/management/employee"
            onClick={() => onRefresh("/admin/operator/management/employee")}
          >
            직원관리
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/management/commonCode"
            onClick={() => onRefresh("/admin/operator/management/commonCode")}
          >
            공통코드 관리
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/management/template"
            onClick={() => onRefresh("/admin/operator/management/template")}
          >
            템플릿 관리
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/management/product"
            onClick={() => onRefresh("/admin/operator/management/product")}
          >
            상품 관리
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default ManagementPage;
