import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import Tabs from "@/components/Tabs";
import dayjs from "dayjs";
import DayAMTab from "./tabs/DayAMTab";

/**
 * 일별
 */
const DayTab = ({
  scheduleList,
  courseList,
  selectedCourse,
  teacherList,
  selectedData,
  onChangeCourse,
  onSelectedDataChange,
  createSchedule,
}) => {
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
  const getTeacher = () => {
    if (teacherList && teacherList?.length > 0) {
      const mainTeacher = teacherList.find((teacher) => (
        teacher.value === selectedData.teacher
      ))
      const assistantTeacher = teacherList.find((teacher) => (
        teacher.value === selectedData.assistantTeacher

      ))
      console.log(mainTeacher)
  
      return {mainTeacher, assistantTeacher}
    } else {
      return {mainTeacher : {value:"", label:""}, assistantTeacher : {value:"", label:""}}
    }
  }

  return (
    <div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
            <col />
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>과정</th>
              <td colSpan={3}>
                <button className="ui-select">
                  <select
                    className="input-init"
                    value={selectedCourse?.id}
                    onChange={({ target: { value } }) => onChangeCourse(value)}
                  >
                    {courseList?.map((course) => (
                      <option key={`week-tab-course-${course.id}`} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>수강기간</th>
              {selectedCourse ? (
                <td>{`${selectedCourse?.startDate} ~ ${selectedCourse?.endDate}`}</td>
              ) : (
                <td></td>
              )}
              <th>예약현황</th>
              <td>
                <div className="flexYCenter gap-10">
                  {selectedCourse ? (
                    <div>
                      {`${selectedCourse?.assignmentCount}/${selectedCourse?.lessonCount}`} (
                      <strong className="m txt-primary-deep">{`잔여:${selectedCourse?.remainCount}회`}</strong>
                      )
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th>담임강사</th>
              <td>
                <strong className="b bgc-mainColor">{getTeacher().mainTeacher.label}</strong>
              </td>
              <th>부담임강사</th>
              <td>
                <strong className="b bgc-subColor">{getTeacher().assistantTeacher.label}</strong>
              </td>
            </tr>
            <tr>
              <th>날짜</th>
              <td colSpan={3}>
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

                  <strong className="b text-center" style={{ width: 70 }}>{`(${dayjs(
                    `${selectedData?.year}.${selectedData?.month}.${selectedData?.day}`
                  ).format("ddd")})`}</strong>
                  <Buttons className="outlined xsmall2" title="다음날" onClick={onNextDayClick}>
                    <i className="fa-solid fa-caret-right"></i>
                  </Buttons>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-tab-inner shadow">
        <div className="ui-tabs-outer">
          <Tabs>
            <div label="오전">
              <DayAMTab
                scheduleList={scheduleList?.length > 0 ? scheduleList?.slice(0, 14) : []}
                teacherList={teacherList}
                createSchedule={createSchedule}
                selectedData={selectedData}
              />
            </div>
            <div label="오후">
              <DayAMTab
                scheduleList={scheduleList?.length > 0 ? scheduleList?.slice(14, scheduleList.length) : []}
                teacherList={teacherList}
                createSchedule={createSchedule}
                selectedData={selectedData}
              />
            </div>
            <div label="전체">
              <DayAMTab
                scheduleList={scheduleList || []}
                teacherList={teacherList}
                createSchedule={createSchedule}
                selectedData={selectedData}
              />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DayTab;
