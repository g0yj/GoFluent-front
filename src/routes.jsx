import { createBrowserRouter } from "react-router-dom";
import { WINDOWS } from "./app/helper/helper-window";
import LoginPage from "./pages/Login/LoginPage";
import CancelReservationModal from "./pages/Modal/CancelReservationModal";
import CommonUserListModal from "./pages/Modal/CommonUserListModal";
import CourseAttendance from "./pages/Modal/CourseAttendanceModal";
import EvaluationStatusModal from "./pages/Modal/EvaluationStatusModal";
import LdfDetailModal from "./pages/Modal/LdfDetailModal";
import MemberDetailTabsModal from "./pages/Modal/MemberDetailTabsModal";
import NoticeTeacherModal from "./pages/Modal/NoticeTeacherModal";
import OrderModal from "./pages/Modal/OrderModal";
import OrderRefundModal from "./pages/Modal/OrderRefundModal";
import PrintMemberTestModal from "./pages/Modal/PrintMemberTestModal";
import RegisterBatchOrderModal from "./pages/Modal/RegisterBatchOrderModal";
import RegisterOrderModal from "./pages/Modal/RegisterOrderModal";
import RegisterResvModal from "./pages/Modal/RegisterResvModal";
import ReportModal from "./pages/Modal/ReportModal";
import SendEmailModal from "./pages/Modal/SendEmailModal";
import SendSmsModal from "./pages/Modal/SendSmsModal";
import SmsListModal from "./pages/Modal/SmsListModal";
import SmsTargetMemberList from "./pages/Modal/SmsTargetMemberList";
import RootPage from "./pages/RootPage";
import ClassSchedulePage from "./pages/SystemOperator/ClassSchedule/ClassSchedulePage";
import CommonCode from "./pages/SystemOperator/Management/CommonCode";
import EmployeeManagementContents from "./pages/SystemOperator/Management/EmployeeManagementContents";
import ManagementPage from "./pages/SystemOperator/Management/ManagementPage";
import Product from "./pages/SystemOperator/Management/Product";
import Template from "./pages/SystemOperator/Management/Template";
import AcademicReportManagementContents from "./pages/SystemOperator/Members/AcademicReportManagementContents";
import ConsultManagementContents from "./pages/SystemOperator/Members/ConsultManagementContents";
import MemberManagementContents from "./pages/SystemOperator/Members/MemberManagementContents";
import MemberManagementPage from "./pages/SystemOperator/Members/MemberManagementPage";
import SalesPage from "./pages/SystemOperator/Sales/SalesPage";
import DailySalesContents from "./pages/SystemOperator/Sales/DailySalesContents";
import PeriodSalesContents from "./pages/SystemOperator/Sales/PeriodSalesContents";
import EvaluationStatus from "./pages/SystemOperator/Statistics/EvaluationStatus";
import SmsStatusContents from "./pages/SystemOperator/Statistics/SmsStatusContents";
import StatisticsPage from "./pages/SystemOperator/Statistics/StatisticsPage";
import SystemOperatorLayout from "./pages/SystemOperator/SystemOperatorLayout";
import AbsenceManagementContents from "./pages/SystemOperator/Teacher/AbsenceManagementContents";
import AttendanceManagementContents from "./pages/SystemOperator/Teacher/AttendanceManagementContents";
import AttendanceTodayManagementContents from "./pages/SystemOperator/Teacher/AttendanceTodayManagementContents";
import CgtSchedule from "./pages/SystemOperator/Teacher/CgtSchedule";
import TeacherManagementContents from "./pages/SystemOperator/Teacher/TeacherManagementContents";
import TeacherManagementPage from "./pages/SystemOperator/Teacher/TeacherManagementPage";
import AbsenceRateMain from "./pages/Teacher/AbsenceRate/absence-rate-main";
import AttendanceRateMain from "./pages/Teacher/AttendanceRate/attendance-rate-main";
import DailyScheduleEnglish from "./pages/Teacher/DailySchedule/daily-schedule-english";
import DailyScheduleMain from "./pages/Teacher/DailySchedule/daily-schedule-main";
import LearnerManagementMain from "./pages/Teacher/LearnerManagement/learner-management-main";
import ReportMain from "./pages/Teacher/Report/report-main";
import TeacherLayout from "./pages/Teacher/TeacherLayout";
import LearnManagementDetailTabsModal from "./pages/Modal/LearnManagementDetailTabsModal";
import SendPreviewModal from "./pages/Modal/SendPreviewModal";
import PaymentUpdateModal from "./pages/Modal/PaymentUpdateModal";
import MemberRegistModal from "./pages/Modal/MemberRegistModal";
import ChangeEmailModal from "./pages/Modal/ChangeEmailModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/operator",
    element: <SystemOperatorLayout />,
    children: [
      {
        path: "members",
        element: <MemberManagementPage />,
        children: [
          {
            path: "member",
            element: <MemberManagementContents />,
          },
          {
            path: "academicReport",
            element: <AcademicReportManagementContents />,
          },
          {
            path: "consult",
            element: <ConsultManagementContents />,
          },
        ],
      },
      {
        path: "teachers",
        element: <TeacherManagementPage />,
        children: [
          {
            path: "cgtSchedule",
            element: <CgtSchedule />,
          },
          {
            path: "teacher",
            element: <TeacherManagementContents />,
          },
          {
            path: "attendance",
            element: <AttendanceManagementContents />,
          },
          {
            path: "attendance-today",
            element: <AttendanceTodayManagementContents />,
          },
          {
            path: "absence",
            element: <AbsenceManagementContents />,
          },
        ],
      },
      {
        path: "sales",
        element: <SalesPage />,
        children: [
          {
            path: "daily-sales",
            element: <DailySalesContents />,
          },
          {
            path: "period-sales",
            element: <PeriodSalesContents />,
          },
        ]
      },
      {
        path: "class-schedule",
        element: <ClassSchedulePage />,
      },
      {
        path: "management",
        element: <ManagementPage />,
        children: [
          {
            path: "employee",
            element: <EmployeeManagementContents />,
          },
          {
            path: "commonCode",
            element: <CommonCode />,
          },
          {
            path: "template",
            element: <Template />,
          },
          {
            path: "product",
            element: <Product />,
          },
        ],
      },
      {
        path: "statistics",
        element: <StatisticsPage />,
        children: [
          {
            path: "sms-status",
            element: <SmsStatusContents />,
          },
          {
            path: "evaluation-status",
            element: <EvaluationStatus />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/teacher",
    element: <TeacherLayout />,
    children: [
      {
        path: "learner-management",
        element: <LearnerManagementMain />,
      },
      {
        path: "daily-schedule",
        element: <DailyScheduleMain />,
      },
      {
        path: "daily-schedule-english",
        element: <DailyScheduleEnglish />,
      },
      {
        path: "report",
        element: <ReportMain />,
      },
      {
        path: "attendance-rate",
        element: <AttendanceRateMain />,
      },
      {
        path: "absence-rate",
        element: <AbsenceRateMain />,
      },
    ],
  },
  // Modal들
  {
    path: WINDOWS.SEND_EMAIL.url,
    element: <SendEmailModal />,
  },
  {
    path: WINDOWS.SEND_SMS.url,
    element: <SendSmsModal />,
  },
  {
    path: WINDOWS.REGISTER_ORDER.url,
    element: <RegisterOrderModal />,
  },
  {
    path: WINDOWS.REGISTER_BATCH_ORDER.url,
    element: <RegisterBatchOrderModal />,
  },
  {
    path: WINDOWS.NOTICE_TEACHER.url,
    element: <NoticeTeacherModal />,
  },
  {
    path: WINDOWS.REGISTER_RESV.url,
    element: <RegisterResvModal />,
  },
  {
    path: WINDOWS.PRINT_MEMBER_TEST.url,
    element: <PrintMemberTestModal />,
  },
  {
    path: WINDOWS.COURSE_ATTENDANCE.url,
    element: <CourseAttendance />,
  },
  {
    path: WINDOWS.ORDER.url,
    element: <OrderModal />,
  },
  {
    path: WINDOWS.SMS_LIST.url,
    element: <SmsListModal />,
  },
  {
    path: WINDOWS.EVALUATION_STATUS.url,
    element: <EvaluationStatusModal />,
  },
  {
    path: WINDOWS.LDF_DETAIL.url,
    element: <LdfDetailModal />,
  },
  {
    path: WINDOWS.SMS_USER_LIST.url,
    element: <CommonUserListModal />,
  },
  {
    path: WINDOWS.CANCEL_RESERVATION.url,
    element: <CancelReservationModal />,
  },
  {
    path: WINDOWS.MEMBER_DETAIL_TABS.url,
    element: <MemberDetailTabsModal />,
  },
  {
    path: WINDOWS.REPORT.url,
    element: <ReportModal />,
  },
  {
    path: WINDOWS.SMS_TARGET_MEMBER_LIST.url,
    element: <SmsTargetMemberList />,
  },
  {
    path: WINDOWS.ORDER_REFUND.url,
    element: <OrderRefundModal />,
  },
  {
    path: WINDOWS.LEARNMANAGEMENT_DETAIL_TABS.url,
    element: <LearnManagementDetailTabsModal />
  },
  {
    path: WINDOWS.SEND_PREVIEW.url,
    element: <SendPreviewModal />
  },
  {
    path: WINDOWS.PAYMENT_UPDATE.url,
    element: <PaymentUpdateModal />
  },
  {
    path: WINDOWS.MEMBER_REGIST.url,
    element: <MemberRegistModal />
  },
  {
    path: WINDOWS.CHANGE_EMAIL.url,
    element: <ChangeEmailModal />
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

export default router;