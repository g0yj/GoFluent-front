import { useCallback, useEffect, useState } from "react";

import Buttons from "@/components/Buttons";
import { Fragment } from "react";

/**
 * 일별 오전
 */
const DayAMTab = ({ scheduleList, teacherList, createSchedule, selectedData }) => {
  const [selectScheduleList, setSelectScheduleList] = useState([]);
  const [listData, setListData] = useState([]);

  //스케줄 선택
  const onChangeSchedule = useCallback(
    (id) => {
      const isHasId = selectScheduleList.find((item) => item === id);
      if (!isHasId) {
        const saveData = selectScheduleList;
        saveData.push(id);
        setSelectScheduleList(saveData);
      } else {
        const saveData = selectScheduleList;
        const removeData = saveData.filter((item) => item !== id);
        setSelectScheduleList(removeData);
      }
    },
    [selectScheduleList]
  );

  //스케줄 같은 시간을 만드는 함수
  const makeScheduleTime = useCallback(() => {
    const timeData = scheduleList;
    const saveData = [];

    for (let index = 0; index < timeData?.length; index += 2) {
      saveData.push(timeData.slice(index, index + 2));
    }
    setListData(saveData);
  }, [scheduleList]);

  const renderItem = (data) => {
    return data?.reservations?.map((item) => {
      if (item.teacherId) {
        return (
          <td key={`${item.teacherId}`} className="th main">
            <div className="ui-teacher ">
              {item.status === "AVAILABLE" ? (
                  <div style={{ backgroundColor: "rgb(217, 234, 253)" }}>
                    <input
                      type="checkbox"
                      style={{ position: "absolute" }}
                      onChange={() => onChangeSchedule(item.scheduleId)}
                    />
                  </div>
              ): item.status === "FULL" ? (
                  <div style={{ backgroundColor: "rgb(217, 234, 253)" }}>
                  </div>
              ): item.status === "USERS" ? (
                  <div style={{ backgroundColor: "rgb(255, 200, 200)" }}>
                  </div>
              ) : (
                <div></div>
              )}
            </div>
            {item.status === "AVAILABLE" && (
              <div className="ui-tooltip">
                <div className="row"> {item?.teacherName}</div>
              </div>
            )}
          </td>
        );
      }
    });
  };

  useEffect(() => {
    setSelectScheduleList([]);
  }, [scheduleList]);

  useEffect(() => {
    makeScheduleTime();
  }, [makeScheduleTime]);

  return (
    <div className="sp-mt-10" style={{ minHeight: 180 }}>
      <div className="ui-date-table">
        <table>
          <tbody>
            <tr className="sticky">
              <th className="th">
                <div className="inner">시</div>
              </th>
              <th className="th">
                <div className="inner">분</div>
              </th>
              {teacherList?.map((teacher) => (
                <th className="th" key={teacher.value}>
                  <div
                    className={`inner ${
                      teacher.value === selectedData.teacher
                        ? "bgc-mainColor"
                        : teacher.value === selectedData.assistantTeacher
                        ? "bgc-subColor"
                        : ""
                    }`}
                  >
                    {teacher.label}
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
                  {renderItem(item[0])}
                </tr>
                <tr className="bgc-greydc">
                  <td className="th main">
                    <div className="inner">30 분</div>
                  </td>
                  {renderItem(item[1])}
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
              {teacherList?.map((teacher) => (
                <th className="th" key={teacher.value}>
                  <div
                    className={`inner ${
                      teacher.value === selectedData.teacher.value
                        ? "bgc-mainColor"
                        : teacher.value === selectedData.assistantTeacher.value
                        ? "bgc-subColor"
                        : ""
                    }`}
                  >
                    {teacher.label}
                  </div>
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="tabs-right-btn">
        <Buttons className="primary add" onClick={() => createSchedule(selectScheduleList)}>
          저장
        </Buttons>
      </div>
    </div>
  );
};

export default DayAMTab;
