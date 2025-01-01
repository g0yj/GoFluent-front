/**
 * 새창을 열기 위한 유틸리티
 */

const WINDOW_FEATURE = {
  SMALL: { width: 500, height: 300},
  COMMON: { width: 635, height: 700 },
  LARGE: { width: 800, height: 800 },
  REGISTER_RESV: { width: 1000, height: 1000 },
  PRINT_MEMBER_TEST: { width: 800, height: 1050 },
  COURSE_ATTENDANCE: { width: 1800, height: 1032 },
  ORDER: { width: 1300, height: 670 },
};

const WINDOWS = {
  SEND_PREVIEW: { id: "SendPreview", url: "/admin/send-preview", options: WINDOW_FEATURE.REGISTER_RESV },
  SEND_EMAIL: { id: "SendEmail", url: "/admin/send-email", options: WINDOW_FEATURE.COMMON },
  SEND_SMS: { id: "SendSms", content: "content", url: "/admin/send-sms", options: WINDOW_FEATURE.COMMON },
  SEND_LIST: { id: "SendList", url: "/admin/send-list", options: WINDOW_FEATURE.COMMON },
  SMS_LIST: { id: "SmsList", url: "/admin/sms-list", options: WINDOW_FEATURE.REGISTER_RESV },
  EVALUATION_STATUS: {
    id: "EvaluationStatus",
    url: "/admin/evaluation-status",
    options: WINDOW_FEATURE.REGISTER_RESV,
  },
  LDF_DETAIL: { id: "LdfDetail", url: "/admin/ldf-detail", options: WINDOW_FEATURE.REGISTER_RESV },
  REGISTER_BATCH_ORDER: {
    id: "RegisterBatchOrder",
    url: "/admin/register-batch-order",
    options: WINDOW_FEATURE.LARGE,
  },
  REGISTER_ORDER: { id: "RegisterOrder", url: "/admin/register-order", options: WINDOW_FEATURE.LARGE },
  NOTICE_TEACHER: {
    id: "NoticeTeacher",
    url: "/admin/notice-teacher",
    options: WINDOW_FEATURE.COMMON,
  },
  REGISTER_RESV: {
    id: "RegisterResv",
    course: "course",
    resvOpen: "resvOpen",
    url: "/admin/register-resv",
    options: WINDOW_FEATURE.REGISTER_RESV,
  },
  PRINT_MEMBER_TEST: {
    id: "PrintMemberTest",
    url: "/admin/print-member-test",
    options: WINDOW_FEATURE.PRINT_MEMBER_TEST,
  },
  COURSE_ATTENDANCE: {
    id: "CourseAttendance",
    url: "/admin/course-attendance",
    options: WINDOW_FEATURE.COURSE_ATTENDANCE,
  },
  ORDER: {
    id: "Order",
    order: "OrderData",
    orderOpen: "orderOpen",
    url: "/admin/order",
    options: WINDOW_FEATURE.ORDER,
  },
  SMS_USER_LIST: {
    id: "SmsUserList",
    isSms: "isSms",
    isNew: "isNew",
    url: "/admin/sms-user-list",
    options: WINDOW_FEATURE.COMMON,
  },
  CANCEL_RESERVATION: {
    id: "CancelReservation",
    member: "MemberData",
    course: "Course",
    cancelResv: "cancelResv",
    url: "/admin/cancel-reservation",
    options: WINDOW_FEATURE.COMMON,
  },
  MEMBER_DETAIL_TABS: {
    id: "MemberDetailTabs",
    label: "label",
    url: "/admin/member-detail-Tabs",
    options: WINDOW_FEATURE.REGISTER_RESV,
  },
  REPORT: {
    id: "REPORT",
    url: "/admin/report",
    options: WINDOW_FEATURE.COURSE_ATTENDANCE,
  },
  SMS_TARGET_MEMBER_LIST: {
    id: "SmsTargetMemberList",
    url: "/admin/SmsTargetMemberList",
    options: WINDOW_FEATURE.COMMON,
  },
  ORDER_REFUND: {
    id: "OderRefund",
    refundOpen: "refundOpen",
    url: "/admin/OderRefund",
    options: WINDOW_FEATURE.ORDER,
  },
  LEARNMANAGEMENT_DETAIL_TABS: {
    id: "LearnerManagementDetailTabs",
    label: "label",
    url: "/admin/LearnerManagement-detail-Tabs",
    options: WINDOW_FEATURE.REGISTER_RESV,
  },
  PAYMENT_UPDATE: {
    id: "PaymentUpdate",
    updateOpen: "updateOpen",
    url: "/admin/PaymentUpdate",
    options: WINDOW_FEATURE.SMALL,
  },
  MEMBER_REGIST: {
    id: "MemberRegist",
    isClose: "isClose", // 키값을 다르게 가져가야 함.
    url: "/admin/MemberRegist",
    options: WINDOW_FEATURE.LARGE,
  },
  CHANGE_EMAIL: {
    id: "ChangeEmail",
    url: "/admin/ChangeEmail",
    options: WINDOW_FEATURE.SMALL,
  },
  NOREPORT: {
    id: "NoReportModal",
    url: "/admin/NoReportModal",
    options: WINDOW_FEATURE.ORDER,
  },
};

let openWindows = {};

const openWindow = (windowData) => {
  let windowFeature = `location=no,menubar=no,toolbar=no,resizable=no,scrollbars=no,status=no`;
  windowFeature += `,width=${windowData.options.width}`;
  windowFeature += `,height=${windowData.options.height}`;
  windowFeature += `,left=${(window.innerWidth - windowData.options.width) / 2}`;
  windowFeature += `,top=${(window.innerHeight - windowData.options.height) / 2}`;

  const newWindow = window.open(windowData.url, windowData.id, windowFeature);
  openWindows[windowData.id] = newWindow;
};

const closeWindow = (id) => {
  const windowToClose = openWindows[id];
  if (windowToClose) {
    windowToClose.close();
    delete openWindows[id];
  }
}

export { WINDOWS, openWindow, closeWindow };
