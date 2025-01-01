import React, { Suspense } from "react";

const SuspenseWrapper = ({ path }) => {
  const LazyComponent = React.lazy(() => import(`@/${path}`));

  return (
    <Suspense
      fallback={
        <div className="loader-container">
          <div className="loader-container-inner">로딩...</div>
        </div>
      }
    >
      <LazyComponent />
    </Suspense>
  );
};

export default SuspenseWrapper;

// 필요하면 아래 내용 참조해서 설정하기
/**
 * 
 * 
 * 
import RootPage from "@/pages/RootPage";
import { createBrowserRouter } from "react-router-dom";
import SuspenseWrapper from "./components/SuspenseWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/login",
    element: <SuspenseWrapper path="pages/Login/LoginPage" />,
  },
  {
    path: "/operator",
    element: <SuspenseWrapper path="pages/SystemOperator/SystemOperatorLayout" />,
    children: [
      {
        path: "members",
        element: <SuspenseWrapper path="pages/SystemOperator/Members/MembersPage" />,
        children: [
          {
            path: "",
            element: (
              <SuspenseWrapper path="pages/SystemOperator/Members/MemberManagementContents" />
            ),
          },
          {
            path: "consult",
            element: (
              <SuspenseWrapper path="pages/SystemOperator/Members/ConsultManagementContents" />
            ),
          },
        ],
      },
      {
        path: "instructors",
        element: <SuspenseWrapper path="pages/SystemOperator/Instructors/InstructorsPage" />,
      },
      {
        path: "sales",
        element: <SuspenseWrapper path="pages/SystemOperator/Sales/SalesPage" />,
      },
      {
        path: "class-schedule",
        element: <SuspenseWrapper path="pages/SystemOperator/ClassSchedule/ClassSchedulePage" />,
      },
      {
        path: "management",
        element: <SuspenseWrapper path="pages/SystemOperator/Management/ManagementPage" />,
      },
    ],
  },
  {
    path: "/instructor",
    element: <SuspenseWrapper path="pages/Instructor/InstructorLayout" />,
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

export default router;

 * 
 */
