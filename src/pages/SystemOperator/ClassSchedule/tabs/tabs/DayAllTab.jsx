import storage from "@/app/local/local-storage";
import useCancelReservationWindow from "@/app/helper/windows-hooks/use-cancel-reservation-window";
import useMemberDetailTabsWindow from "@/app/helper/windows-hooks/use-member-detail-tabs-window";
import useRegisterResvWindow from "@/app/helper/windows-hooks/use-register-resv-window";
import ServiceReport from "@/app/service/service-report";
import Buttons from "@/components/Buttons";
import { Fragment, useCallback, useEffect, useState } from "react";
import useLearnerManagementDetailTabsWindow from "@/app/helper/windows-hooks/use-learnerManagement-detail-tabs-window";

/**
 * 일별 전체
 */
const DayAllTab = ({ scheduleList, teacherList, getSchedule, language, isReport }) => {
  const { openRegisterResvWindow } = useRegisterResvWindow();
  const { openCancelReservationWindow } = useCancelReservationWindow();
  const { openMemberDetailTabsWindow } = useMemberDetailTabsWindow();
  const { openLearnMemberDetailTabsWindow } = useLearnerManagementDetailTabsWindow();

  const [selectItem, setSelectItem] = useState(null);
  const [listData, setListData] = useState([]);

  const makeScheduleTime = useCallback(() => {
    const timeData = scheduleList;
    const saveData = [];

    for (let index = 0; index < timeData?.length; index += 2) {
      saveData.push(timeData.slice(index, index + 2));
    }
    setListData(saveData);
  }, [scheduleList]);

  const onAttendanceClick = async (reservationId, attendanceStatus) => {
    try {
      const saveData = { attendanceStatus };
      await ServiceReport.setReport(reservationId, saveData);
      await getSchedule();
    } catch (error) {
      console.error(error);
    }
  };

  const renderMenu = () => {
    return (
      storage.loginedType.get() === "A" ? (
        <div className="ui-menu">
          <ul>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openRegisterResvWindow({
                    id: selectItem.item.userId,
                    name: selectItem.item.userName,
                  });
                  setSelectItem(null);
                }}
              >
                예약하기
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openCancelReservationWindow()
                  setSelectItem(null);
                }}
              >
                예약취소
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "기본"
                  )
                  setSelectItem(null);
                }}
              >
                기본정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "테스트"
                  )
                  setSelectItem(null);
                }}
              >
                레벨테스트
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "예약"
                  )
                  setSelectItem(null);
                }}
              >
                예약정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "수강"
                  )
                  setSelectItem(null);
                }}
              >
                수강정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "학습"
                  )
                  setSelectItem(null);
                }}
              >
                학습정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "상담"
                  )
                  setSelectItem(null);
                }}
              >
                상담정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "주문"
                  )
                  setSelectItem(null);
                }}
              >
                주문정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "LDF"
                  )
                  setSelectItem(null);
                }}
              >
                LDF
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  onAttendanceClick(selectItem.item.reservationId, "Y") 
                  setSelectItem(null);
                }}
              >
                출석처리
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  onAttendanceClick(selectItem.item.reservationId, "N")
                  setSelectItem(null);
                }}
              >
                결석처리
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  onAttendanceClick(selectItem.item.reservationId, "R")
                  setSelectItem(null);
                }}
              >
                출결취소
              </Buttons>
            </li>
          </ul>
        </div>
      ) : (
        <div className="ui-menu">
          <ul>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openLearnMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "Test"
                  )
                  setSelectItem(null);
                }}
              >
                레벨테스트
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openLearnMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "Reservation"
                  )
                  setSelectItem(null);
                }}
              >
                예약정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openLearnMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "Lesson"
                  )
                  setSelectItem(null);
                }}
              >
                수강정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openLearnMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "Report"
                  )
                  setSelectItem(null);
                }}
              >
                주문정보
              </Buttons>
            </li>
            <li>
              <Buttons
                className="ui-link secondary-high"
                onClick={() => {
                  openLearnMemberDetailTabsWindow(
                    { id: selectItem.item.userId, name: selectItem.item.userName },
                    "LDF"
                  )
                  setSelectItem(null);
                }}
              >
                LDF
              </Buttons>
            </li>
          </ul>
        </div>
      )
    );
  };

  const renderItemStatus = (status) => {
    if (language === "English") {
      switch (status) {
        case "Y":
          return <div className="flexYCenter gap txt-secondary">Attendance</div>;
        case "N":
          return <div className="flexYCenter txt-error">Absence</div>;
        case "R":
          return <div className="flexYCenter txt-ok-color">Reservation</div>;
      }
    } else {
      switch (status) {
        case "Y":
          return <div className="flexYCenter gap txt-secondary">출</div>;
        case "N":
          return <div className="flexYCenter txt-error">결</div>;
        case "R":
          return <div className="flexYCenter txt-ok-color">예</div>;
      }
    }
  };

  const renderItem = (schedule, minute) => {
    return schedule.reservations.map((item, index) => (
      <td className="th main" key={`${index}-${minute}-${item?.teacherId}`}>
        <div className={`ui-teacher ${schedule?.teachers.some(teacher => teacher.id === item?.teacherId) ? "active2" : ""}`}>
          <div className="end">
            <div className="name-wrap">
              <div
                className={`name txt-primary ${item?.isRetakeRequired ? "txt-error" : ""}`}
                onClick={() => {
                  setSelectItem({ time: schedule?.time, item });
                }}
              >
                {!item?.courseId && item?.reservationId ? "CGT" : language === "English" ? item.userNameEn : item.userName}
                <div className="ui-tooltip another txt-grey900">
                  <div className="row">{item.textbook}</div>
                </div>
              </div>
              {schedule?.time === selectItem?.time &&
               item.userName === selectItem?.item.userName &&
               item.teacherId === selectItem?.item.teacherId &&
               renderMenu()
              }
            </div>
          </div>
          <div className="flexYCenter gap txt-secondary">
            {renderItemStatus(item.status)}
            {isReport && item.isReported && <i className="ui-circle bgc-error"></i>}
          </div>
        </div>
      </td>
    ));
  };

  useEffect(() => {
    makeScheduleTime();
  }, [makeScheduleTime]);

  return (
    <div
      className="sp-mt-10"
      style={{ minHeight: 180 }}
      onClick={() => {
        if (selectItem !== null) setSelectItem(null);
      }}
    >
      <div className="ui-date-table">
        <table>
          <colgroup>
            <col style={{ width: 80 }} />
            <col style={{ width: 80 }} />
          </colgroup>
          <tbody>
            <tr className="sticky">
              <th className="th">
                <div className="inner">시</div>
              </th>
              <th className="th">
                <div className="inner">분</div>
              </th>
              {teacherList?.map((item) => (
                <th className="th" key={item.value}>
                  <div className="inner">
                    <button>{item.label}</button>
                  </div>
                </th>
              ))}
            </tr>
            {listData?.map((item, index) => (
              <Fragment key={index}>
                <tr className="bgc-greydc">
                  <th rowSpan={2} className="th main">
                    <div className="inner">{item[0].time.slice(0, 2)}</div>
                  </th>
                  <td className="th main">
                    <div className="inner">00 분</div>
                  </td>
                  {renderItem(item[0], "00")}
                </tr>
                <tr className="bgc-greydc">
                  <td className="th main">
                    <div className="inner">30 분</div>
                  </td>
                  {renderItem(item[1], "30")}
                </tr>
              </Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="sticky">
              <th className="th">
                <div className="inner">시</div>
              </th>
              <th className="th">
                <div className="inner">분</div>
              </th>
              {teacherList?.map((item) => (
                <th className="th" key={item.value}>
                  <div className="inner">{item.label}</div>
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DayAllTab;
