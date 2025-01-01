import { Fragment, useCallback, useEffect, useState } from "react";

import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import dayjs from "dayjs";
import ServiceCommon from "@/app/service/service-common";
const Days = ["일", "월", "화", "수", "목", "금", "토"];

/**ㅑ
 * 강사관리 상세 > 기본 탭
 */
const TeacherTimeTable = ({ selectedData }) => {
  const [date, setDate] = useState({
    year: dayjs().format("YYYY"),
    month: dayjs().format("MM"),
    week: 0,
  });
  const [data, setData] = useState({ workTime: selectedData.workTime || "", schedules: [] });
  const [weekend, setWeekend] = useState();
  const [schedulesTimes, setScheduleTimes] = useState([]);
  const [dateRow, setDateRow] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [workTimeList, setWorkTimeList] = useState();

  const onChangeData = (item) => {
    setData((prev) => ({ ...prev, ...item }));
  };

  const onChangeDate = (item) => {
    setDate((prev) => ({ ...prev, ...item }));
  };

  const isCheckDate = useCallback(
    (time, type) => {
      switch (type) {
        case "day":
          return (
            data?.schedules.filter(
              (item) =>
                item.date.slice(item.date.length - 2, item.date.length) ===
                (time < 10 ? `0${time}` : time.toString())
            ).length === 36
          );

        case "hour":
          return data?.schedules?.filter((item) => item.time.includes(time)).length === 14;
        case "minute":
          return data?.schedules?.filter((item) => item.time === time).length === 7;
        case "oneDay":
          return data?.schedules.find((item) => item.date === time.date && item.time === time.time);
      }
    },
    [data?.schedules]
  );

  const onSave = async () => {
    try {
      const saveData = {
        dateFrom: `${date.year}-${date.month}-${weekend[0] < 10 ? `0${weekend[0]}` : weekend[0]}`,
        dateTo: `${date.year}-${date.month}-${weekend[6] < 10 ? `0${weekend[6]}` : weekend[6]}`,
        workTime: data?.workTime,
        schedules: data?.schedules.map((item) => ({ date: item.date, time: item.time })),
      };
      console.log("saveData ==>", saveData);
      await ServiceTeacher.createTeacherSchedules(selectedData?.userId, saveData);
      alert("저장되었습니다.")
    } catch (error) {
      console.error(error);
    }
    init();
  };
  const checkDate = useCallback((dates) => {
    const makeDates = dates.map((date) =>
      String(date).length === 1 ? `0${date}` : date.toString()
    );

    setDateRow(makeDates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeScheduleTime = useCallback(() => {
    const timeList = [];
    for (let index = 0; index < scheduleList?.length; index++) {
      if (!timeList.includes(scheduleList[index].time.slice(0, 2))) {
        timeList.push(scheduleList[index].time.slice(0, 2));
      }
    }
    setScheduleTimes(timeList);
  }, [scheduleList]);
  
  const makeDate = useCallback(
    (sunDayDate, lastDate) => {
      const saveData = Array.from({ length: 7 }, (v, i) => {
        if (sunDayDate + i > lastDate) {
          return sunDayDate + i - lastDate;
        } else {
          return sunDayDate + i;
        }
      });
      setWeekend(saveData);
      checkDate(saveData);
    },
    [checkDate]
  );
  
  const init = useCallback(async () => {
    const teacherWorkTime = await ServiceCommon.getCommonCode({codeGroup: '400'});
    setWorkTimeList(teacherWorkTime);
    
    const weekendLength = 7;
    const getFirstDay = dayjs(`${date?.year}-${date?.month}-'01'`).get("day"); //0 sun -> 6 saturday
    const getSunDayDate = dayjs(
      `${date?.year}-${date?.month}-${date?.week * 7 + 1 + weekendLength - getFirstDay}`
    ).get("date"); //첫번째 일요일의 날짜

    const dayLengthOfMonth = dayjs().daysInMonth(`${date?.year}-${date?.month}-${1}`); //달의 마지막 날짜
    makeDate(getSunDayDate, dayLengthOfMonth);

    //마지막주가 한달을 넘었을 경우
    const isOverDateOfMonth = getSunDayDate + 6 > dayLengthOfMonth;

    const saveData = {
      dateFrom: `${date.year}-${date.month}-${
        getSunDayDate < 10 ? `0${getSunDayDate}` : getSunDayDate
      }`,
      dateTo: `${date.year}-${
        isOverDateOfMonth ? (Number(date.month) === 12 ? "01" : Number(date.month) + 1) : date.month
      }-${
        isOverDateOfMonth
          ? getSunDayDate + 6 - dayLengthOfMonth < 10
            ? `0${getSunDayDate + 6 - dayLengthOfMonth}`
            : getSunDayDate + 6 - dayLengthOfMonth
          : getSunDayDate + 6 < 10
          ? `0${getSunDayDate}`
          : getSunDayDate + 6
      }`,
    };

    const res = await ServiceTeacher.getTeacherSchedules(selectedData?.userId, saveData);
    setScheduleList(res.schedules);


    const scheduledItems = res.schedules
    .filter(item => item.isScheduled)
    .map(item => ({ date: item.date, time: item.time }));

    onChangeData({ schedules: scheduledItems });
  }, [date.month, date?.week, date.year, makeDate, selectedData?.userId]);

  const renderItem = useCallback(
    (time, minute) => {
      const renderData = [];

      dateRow?.map((date) => {
        for (let index = 0; index < scheduleList?.length; index++) {
          if (
            scheduleList[index]?.date?.slice(
              scheduleList[index]?.date?.length - 2,
              scheduleList[index]?.date?.length
            ) === date &&
            scheduleList[index]?.time === `${time}:${minute}`
          ) {
            renderData.push(scheduleList[index]);
          }
        }
      });
      //style={[item?.isScheduled && { backgroundColor: "#d9eafd" }]}

      return renderData?.map((item, index) => {
        return (
          <td className="th main" key={`${item.date}-${item.time}`}>
            {/* UI : check 시 active 추가 */}
            <div className="ui-teacher active">
              <div className="ui-check">
              <input
                  type="checkbox"
                  className="input-init"
                  checked={isCheckDate(item, "oneDay")}
                  onChange={({ target: { checked } }) => {
                    if (checked) {
                      // 중복 추가 방지
                      if (!isCheckDate(item, "oneDay")) {
                        onChangeData({ schedules: [...data.schedules, item] });
                      }
                    } else {
                      const saveData = data?.schedules.filter(
                        (innerItem) => !(item.date === innerItem.date && item.time === innerItem.time)
                      );
                      onChangeData({ schedules: saveData });
                    }
                  }}
                />
              </div>
            </div>

            <div className="ui-tooltip">
              <div className="row">{`${item.date.slice(0, 4)}.${item.date.slice(
                5,
                7
              )}.${item.date.slice(8, 10)}(${Days[index]}) ${minute}분`}</div>
            </div>
          </td>
        );
      });
    },
    [data.schedules, dateRow, isCheckDate, scheduleList]
  );

  useEffect(() => {
    init();
  }, [init, selectedData]);

  useEffect(() => {
    makeScheduleTime();
  }, [makeScheduleTime]);

  return (
    <div className="sp-mt-10">
      <div className="ui-sub-title">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{selectedData?.teacherName}</div>
          </div>
        </div>

        <div className="control">
          <strong className="b">근무시간 : </strong>
          <button className="ui-select">
            <select
              className="input-init"
              value={selectedData?.workTime}
              onChange={({ target: { value } }) => onChangeData({ workTime: value })}
            >
              <option value>-선택-</option>
              {workTimeList?.commonCode?.map ((time) => (
                <option value={time.code}>{time.name}</option>
              ))}

              {/* <option value="AM_16">AM(16)</option>

              <option value="PM_16">PM(16)</option>

              <option value="SP_16">Split(16)</option>

              <option value="AM_8">AM(8)</option>

              <option value="PM_8">PM(8)</option>

              <option value="SP_10">Split(10)</option>

              <option value="SP_4">Split(4)</option> */}
            </select>
          </button>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>해당년월</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select
                      className="input-init"
                      value={date?.year}
                      onChange={({ target: { value } }) => onChangeDate({ year: value })}
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
                      value={date?.month}
                      onChange={({ target: { value } }) => onChangeDate({ month: value })}
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

                  <div className="ui-radio-group size-small">
                    {["1주", "2주", "3주", "4주", "5주", "6주"].map((el, i) => {
                      return (
                        <div key={i}>
                          <input
                            type="radio"
                            id={`${el}-${i}`}
                            name="week"
                            checked={date?.week === i}
                            onChange={() => onChangeDate({ week: i })}
                          />
                          <label htmlFor={`${el}-${i}`}>{el}</label>
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

      <div className="layout-between sp-mt-20">
        <div className="ml-auto gap-s">
          <Buttons className="primary mid" onClick={onSave}>
            저장
          </Buttons>
        </div>
      </div>

      <div className="ui-date-table last-border sp-mt-10">
        <table>
          <tbody>
            <tr className="sticky">
              <th className="th" colSpan={2}>
                <div className="inner ui-check">
                  <div className="check">
                    <input
                      type="checkbox"
                      id="All"
                      className="input-init"
                      checked={data.schedules.length === 252}
                      onChange={({ target: { checked } }) => {
                        if (checked) {
                          onChangeData({
                            schedules: scheduleList.map((item) => {
                              return { date: item.date, time: item.time };
                            }),
                          });
                        } else {
                          onChangeData({ schedules: [] });
                        }
                      }}
                    />
                    <label className="txt-grey900" htmlFor="All">
                      모두선택
                    </label>
                  </div>
                </div>
              </th>
              {weekend?.map((day, index) => (
                <th className="th" key={day}>
                  <div className="inner ui-check">
                    <div className="check">
                      <input
                        type="checkbox"
                        id={day}
                        className="input-init"
                        checked={isCheckDate(day, "day")}
                        onChange={({ target: { checked } }) => {
                          if (checked) {
                            const saveData = scheduleList.filter(
                              (item) =>
                                item.date.slice(item.date.length - 2, item.date.length) ===
                                (day < 10 ? `0${day}` : day.toString())
                            );
                            onChangeData({ schedules: [...data.schedules, ...saveData] });
                          } else {
                            const saveData = data.schedules.filter(
                              (item) =>
                                item.date.slice(item.date.length - 2, item.date.length) !==
                                (day < 10 ? `0${day}` : day.toString())
                            );
                            onChangeData({ schedules: saveData });
                          }
                        }}
                      />
                      <label className={index === 0 ? "txt-red" : "txt-grey900"} htmlFor="day">
                        {day}({Days[index]})
                      </label>
                    </div>
                  </div>
                </th>
              ))}
            </tr>

            {schedulesTimes?.map((time, i) => (
              <Fragment key={i}>
                <tr className="bgc-greydc">
                  <th rowSpan={2} className="th main">
                    <div className="inner">
                      {time}시
                      <input
                        type="checkbox"
                        id={time}
                        className="input-init"
                        checked={isCheckDate(time, "hour")}
                        onChange={({ target: { checked } }) => {
                          if (checked) {
                            const saveData = scheduleList.filter(
                              (item) => item.time === `${time}:00` || item.time === `${time}:30`
                            );

                            onChangeData({ schedules: [...data.schedules, ...saveData] });
                          } else {
                            const saveData = data?.schedules?.filter(
                              (item) => item.time !== `${time}:00` && item.time !== `${time}:30`
                            );
                            onChangeData({ schedules: saveData });
                          }
                        }}
                      />
                    </div>
                  </th>
                  <td className="th main">
                    <div className="inner">
                      00 분
                      <input
                        type="checkbox"
                        id={time + "00"}
                        className="input-init"
                        checked={isCheckDate(`${time}:00`, "minute")}
                        onChange={({ target: { checked } }) => {
                          if (checked) {
                            const saveData = scheduleList.filter(
                              (item) => item.time === `${time}:00`
                            );

                            onChangeData({ schedules: [...scheduleList, ...saveData] });
                          } else {
                            const saveData = data?.schedules?.filter(
                              (item) => item.time !== `${time}:00`
                            );
                            onChangeData({ schedules: saveData });
                          }
                        }}
                      />
                    </div>
                  </td>

                  {renderItem(time, "00")}
                </tr>
                <tr className="bgc-greydc">
                  <td className="th main">
                    <div className="inner">
                      30 분
                      <input
                        type="checkbox"
                        id={time + "30"}
                        className="input-init"
                        checked={isCheckDate(`${time}:30`, "minute")}
                        onChange={({ target: { checked } }) => {
                          if (checked) {
                            const saveData = scheduleList.filter(
                              (item) => item.time === `${time}:30`
                            );

                            onChangeData({ schedules: [...data.schedules, ...saveData] });
                          } else {
                            const saveData = data?.schedules?.filter(
                              (item) => item.time !== `${time}:30`
                            );
                            onChangeData({ schedules: saveData });
                          }
                        }}
                      />
                    </div>
                  </td>

                  {renderItem(time, "30")}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-10">
        <div className="ml-auto gap-s">
          <Buttons className="primary mid">저장</Buttons>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimeTable;
