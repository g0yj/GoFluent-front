import { NavLink } from "react-router-dom";

import { TeacherType } from "@/app/api/common";
import ServiceSchedules from "@/app/service/service-schedules";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import DayTab from "@/pages/SystemOperator/ClassSchedule/tabs/DayTab";

const DailyScheduleEnglish = () => {
  const [scheduleList, setScheduleList] = useState(null);
  const [teacherList, setTeacherList] = useState(null);
  const [selectedData, setSelectedData] = useState({
    year: new Date().getFullYear(),
    month: (new Date().getMonth() + 1) < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth(),
    day: new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate(),
  });

  const onSelectedDataChange = (data) => {
    setSelectedData((prev) => ({ ...prev, ...data }));
  };

  const onBeforeDayClick = () => {
    const current = `${selectedData.year}-${selectedData.month}-${selectedData?.day}`;
    const before = dayjs(current).subtract(1, "day");
    onSelectedDataChange({
      year: before.format("YYYY"),
      month: before.format("MM"),
      day: before.format("DD"),
    });
  };

  const onNextDayClick = () => {
    const current = `${selectedData.year}-${selectedData.month}-${selectedData?.day}`;
    const next = dayjs(current).add(1, "day");
    onSelectedDataChange({
      year: next.format("YYYY"),
      month: next.format("MM"),
      day: next.format("DD"),
    });
  };

  const getSchedule = useCallback(async () => {
    const saveData = {
      date: `${selectedData.year}-${selectedData.month}-${selectedData.day}`,
    };
    const res = await ServiceSchedules.getSchedules(saveData);

    setScheduleList(res.schedules);
  }, [selectedData.day, selectedData.month, selectedData.year]);

  const getTeacherList = useCallback(async () => {
    try {
      const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
      setTeacherList(res.teachers);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    getTeacherList();
  }, [getTeacherList]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  return (
    <>
      <nav className="ui-lnb-wrap">
        <div className="ui-lnb-inner">
          <NavLink className="link active" to="/admin/teacher/daily-schedule-english">
            강의시간표
          </NavLink>
        </div>
      </nav>
      <section className="ui-contents-wrap max-width flex1">
        <div className="ui-contents-inner">
          <div className="ui-location-wrap">
            <div className="ui-location-title">강의시간표</div>
            <div className="ui-location">
              <NavLink>
                <i className="fa-solid fa-house"></i>
              </NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>강의시간표</strong>
            </div>
          </div>
          <div className="ui-info-table">
            <table>
              <colgroup>
                <col style={{ width: 120 }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>날짜</th>
                  <td>
                    <div className="ui-datepicker-wrap">
                      <div>
                        <DatePicker
                          selected={`${selectedData.year}-${selectedData.month}-${selectedData?.day}`}
                          onChange={(date) =>
                            onSelectedDataChange({
                              year: dayjs(date).format("YYYY"),
                              month: dayjs(date).format("MM"),
                              day: dayjs(date).format("DD"),
                            })
                          }
                          selectStart
                          startDate={`${selectedData.year}-${selectedData.month}-${selectedData?.day}`}
                          endDate={`${selectedData.year}-${selectedData.month}-${selectedData?.day}`}
                        />
                      </div>
                      <Buttons className="outlined xsmall2" title="전날" onClick={onBeforeDayClick}>
                        <i className="fa-solid fa-caret-left"></i>
                      </Buttons>

                      <div style={{ minWidth: 70, textAlign: "center" }}>
                        <strong className="b">{
                          dayjs(`${selectedData.year}-${selectedData.month}-${selectedData?.day}`).format("ddd")
                        }</strong>
                      </div>

                      <Buttons className="outlined xsmall2" title="다음날" onClick={onNextDayClick}>
                        <i className="fa-solid fa-caret-right"></i>
                      </Buttons>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ui-tabs-large sp-mt-10">
            <DayTab
              scheduleList={scheduleList}
              teacherList={teacherList}
              onSelectedDataChange={onSelectedDataChange}
              getSchedule={getSchedule}
              language={"English"}
              isReport={false}
            />
          </div>
        </div>
      </section>
    </>
  );
};



export default DailyScheduleEnglish;
