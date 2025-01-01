import Buttons from "@/components/Buttons";
import { Fragment, useCallback, useEffect, useState } from "react";
const Days = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 주별 오전
 */
const WeekTable = ({ sunDayDate, lastDate, scheduleList, selectedData, createSchedule }) => {
  const [dateRow, setDateRow] = useState([]);
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

  //일요일 기준으로 일주일 날짜배열 만드는 함수
  const makeDate = useCallback(() => {
    const sevenDate = Array.from({ length: 7 }, (v, i) => {
      if (sunDayDate + i > lastDate) {
        return sunDayDate + i - lastDate;
      } else {
        return sunDayDate + i;
      }
    });

    const addZero = sevenDate.map((date) =>
      String(date).length === 1 ? `0${date}` : date.toString()
    );
    console.log(addZero);
    setDateRow(addZero);
  }, [lastDate, sunDayDate]);

  //스케줄 같은 시간을 만드는 함수
  const makeScheduleTime = useCallback(() => {
    const timeData = scheduleList;
    const saveData = [];

    for (let index = 0; index < timeData?.length; index += 2) {
      saveData.push(timeData.slice(index, index + 2));
    }
    setListData(saveData);
  }, [scheduleList]);

  //테이블 렌더링
  const renderItem = (data, minute) => {
    return data?.reservations?.map((item) => {
      if (item.date) {
        return (
          <td key={`${item.date}-${item.time}`} className="th main">
            <div className="ui-teacher ">
              {item.teacherStatus === "AVAILABLE" ? (
                <div style={{ backgroundColor: "rgb(217, 234, 253)" }}>
                  {/* {selectedData?.teacher?.label} */}
                  <input
                    type="checkbox"
                    style={{ position: "absolute" }}
                    onChange={() => onChangeSchedule(item.teacherScheduleId)}
                  />
                </div>
              ) : item.teacherStatus === "FULL" ? (
                <div style={{ backgroundColor: "rgb(217, 234, 253)" }}>
                  {/* {selectedData?.teacher?.label} */}
                </div>
              ): item.teacherStatus === "USERS" ? (
                <div style={{ backgroundColor: "rgb(255, 200, 200)" }}>
                  {/* {selectedData?.teacher?.label} */}
                </div>
              ) : (
                <div></div>
              )}
              {item.assistantTeacherStatus === "AVAILABLE" ? (
                  <div style={{ backgroundColor: "#FFFE9D" }}>
                  {/* {selectedData?.teacher?.label} */}
                  <input
                    type="checkbox"
                    style={{ position: "absolute" }}
                    onChange={() => onChangeSchedule(item.teacherScheduleId)}
                  />
                </div>
              ) : item.assistantTeacherStatus === "FULL" ? (
                <div style={{ backgroundColor: "#FFFE9D" }}>
                  {/* {selectedData?.teacher?.label} */}
                </div>
              ): item.assistantTeacherStatus === "USERS" ? (
                <div style={{ backgroundColor: "rgb(255, 200, 200)" }}>
                  {/* {selectedData?.teacher?.label} */}
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="ui-tooltip">
              <div className="row">{`${item.date} ${minute}분`}</div>
              {item?.teachers?.map((teacher) => (
                <div key={teacher.id} className="row">
                  {teacher.name}
                </div>
              ))}
            </div>
          </td>
        );
      }
    });
  };

  useEffect(() => {
    setSelectScheduleList([]);
  }, [dateRow]);

  useEffect(() => {
    makeScheduleTime();
  }, [makeScheduleTime]);

  useEffect(() => {
    makeDate();
  }, [makeDate]);

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
              {scheduleList?.[0].reservations.map((reservation, index) => {
                const date = reservation?.date.slice(8, 13)
                if (index === 0) {
                  return (
                    <th className="th" key={index}>
                      <div className="inner txt-red">{date}(일)</div>
                    </th>
                  );
                } else if (index === 6) {
                  return (
                    <th className="th" key={index}>
                      <div className="inner txt-secondary">{date}(토)</div>
                    </th>
                  );
                } else {
                  return (
                    <th className="th" key={index}>
                      <div className="inner">
                        {date}({Days[index]})
                      </div>
                    </th>
                  );
                }
              })}
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

              {dateRow.map((date, index) => {
                if (index === 0) {
                  return (
                    <th className="th" key={index}>
                      <div className="inner txt-red">{date}(일)</div>
                    </th>
                  );
                } else if (index === 6) {
                  return (
                    <th className="th" key={index}>
                      <div className="inner txt-secondary">{date}(토)</div>
                    </th>
                  );
                } else {
                  return (
                    <th className="th" key={index}>
                      <div className="inner">{date}(월)</div>
                    </th>
                  );
                }
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* tab 상단 */}
      <div className="tabs-right-btn">
        <Buttons className="primary add" onClick={() => createSchedule(selectScheduleList)}>
          저장
        </Buttons>
      </div>
    </div>
  );
};

export default WeekTable;
