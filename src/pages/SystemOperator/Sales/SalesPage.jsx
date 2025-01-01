import { NavLink, Outlet, useLocation } from "react-router-dom";

// 정산관리 (1depth)
const SalesPage = () => {
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
              className="link active"
              to="/admin/operator/sales/daily-sales"
              onClick={() => onRefresh("/admin/operator/sales/daily-sales")}
            >
                일일정산관리
            </NavLink>
            <NavLink
              className="link active"
              to="/admin/operator/sales/period-sales"
              onClick={() => onRefresh("/admin/operator/sales/period-sales")}
            >
              기간별정산관리
            </NavLink>
          </div>
        </nav>
        <Outlet />
        </>
    );
};
export default SalesPage;