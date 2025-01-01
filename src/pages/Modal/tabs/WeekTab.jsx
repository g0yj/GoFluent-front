import Tabs from "@/components/Tabs";
import WeekTable from "./tabs/WeekTable";

/**
 * 주별
 */
const WeekTab = ({
  scheduleList,
  courseList,
  selectedCourse,
  teacherList,
  sunDayDate,
  lastDate,
  selectedData,
  onChangeCourse,
  onSelectedDataChange,
  createSchedule,
}) => {
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
                    value={courseList && courseList.length > 0 ? selectedCourse?.id : "no-course"}
                    onChange={({ target: { value } }) => onChangeCourse(value)}
                  >
                    {courseList && courseList.length > 0 ?(
                      courseList?.map((course) => (
                        <option key={`week-tab-course-${course.id}`} value={course.id}>
                          {course.name}
                        </option>
                      )
                    ) 
                    ) : (
                      <option value="no-course">승인된 과정이 없습니다.</option>
                    )}
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
                <button className="ui-select full">
                  <select
                    className="input-init bgc-mainColor"
                    value={selectedData?.teacher}
                    onChange={({ target: { value } }) =>
                      onSelectedDataChange({ teacher: value })
                    }
                  >
                    {teacherList?.map((teacher) => (
                      <option key={teacher.value} value={teacher.value}>
                        {teacher.label}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
              <th>부담임강사</th>
              <td>
                <button className="ui-select full">
                  <select
                    className="input-init bgc-subColor"
                    value={selectedData.assistantTeacher}
                    onChange={({ target: { value } }) =>
                      onSelectedDataChange({ assistantTeacher: value })
                    }
                  >
                    {teacherList?.map((teacher) => (
                      <option key={teacher?.value} value={teacher.value}>
                        {teacher.label}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>날짜</th>
              <td colSpan={3}>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select
                      className="input-init"
                      value={selectedData.year}
                      onChange={({ target: { value } }) => onSelectedDataChange({ year: value })}
                    >
                      <option value="2019">2019 년</option>

                      <option value="2020">2020 년</option>

                      <option value="2021">2021 년</option>

                      <option value="2022">2022 년</option>

                      <option value="2023">2023 년</option>

                      <option value="2024">2024 년</option>

                      <option value="2025">2025 년</option>

                      <option value="2026">2026 년</option>

                      <option value="2027">2027 년</option>

                      <option value="2028">2028 년</option>
                    </select>
                  </button>
                  <button className="ui-select">
                    <select
                      className="input-init"
                      value = {selectedData.month}
                      onChange={({ target: { value } }) => onSelectedDataChange({ month: value })}
                    >
                      <option value="01">01 월</option>

                      <option value="02">02 월</option>

                      <option value="03">03 월</option>

                      <option value="04">04 월</option>

                      <option value="05">05 월</option>

                      <option value="06">06 월</option>

                      <option value="07">07 월</option>

                      <option value="08">08 월</option>

                      <option value="09">09 월</option>

                      <option value="10">10 월</option>

                      <option value="11">11 월</option>

                      <option value="12">12 월</option>
                    </select>
                  </button>
                  <div className="ui-radio-group size-small gap">
                    {/* {["1주", "2주", "3주", "4주", "5주", "6주"].map((el, i) => { */}
                    { Array.from({length: scheduleList?.week}).map((el, i) => {
                      return (
                        <div key={i}>
                          <input
                            type="radio"
                            id={`${el}-${i}`}
                            value={i + 1}
                            name="Clarity"
                            checked={i + 1 === selectedData.week}
                            onChange={() => onSelectedDataChange({ week: i + 1 })}
                          />
                          <label htmlFor={`${el}-${i}`}>{i + 1}주</label>
                        </div>
                      );
                    })}
                  </div>
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
              <WeekTable
                sunDayDate={sunDayDate}
                lastDate={lastDate}
                scheduleList={scheduleList?.schedules?.slice(0, 14)}
                selectedData={selectedData}
                createSchedule={createSchedule}
              />
            </div>
            <div label="오후">
              <WeekTable
                sunDayDate={sunDayDate}
                lastDate={lastDate}
                scheduleList={scheduleList?.schedules?.slice(14, scheduleList?.schedules?.length)}
                selectedData={selectedData}
                createSchedule={createSchedule}
              />
            </div>
            <div label="전체">
              <WeekTable
                sunDayDate={sunDayDate}
                lastDate={lastDate}
                scheduleList={scheduleList?.schedules}
                selectedData={selectedData}
                createSchedule={createSchedule}
              />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default WeekTab;
