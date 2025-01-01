import { NavLink, Outlet, useLocation } from "react-router-dom";

// 통계보고서 (1depth)
const StatisticsPage = () => {
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
            to="/admin/operator/statistics/sms-status"
            onClick={() => onRefresh("/admin/operator/statistics/sms-status")}
          >
            SMS 전송현황
          </NavLink>
          <NavLink
            className="link"
            to="/admin/operator/statistics/evaluation-status"
            onClick={() => onRefresh("/admin/operator/statistics/evaluation-status")}
          >
            평가현황
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default StatisticsPage;
