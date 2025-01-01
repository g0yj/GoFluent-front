import { TeacherType } from "@/app/api/common";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import dayjs from "dayjs";
import { useCallback, useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Days = ["일", "월", "화", "수", "목", "금", "토"];

const Table = ({ status, year, month, day }) => {
  const [date, setDate] = useState({ year: "", month: "" });
  const [teacherList, setTeacherList] = useState(null);
  const [monthDays, setMonthDays] = useState(null);
  const [data, setData] = useState(null);

  const makeDayLength = (day) => {
    return day < 10 ? `0${day}` : day;
  };

  const getDayOfWeek = (day) => {
    const makeDate = new Date(`${date.year}-${date.month}-${makeDayLength(day)}`);
    return Days[makeDate.getDay()];
  };

  const findTotalData = (teacher) => {
    return data?.totalAttendances.find((item) => item.name === teacher);
  };

  const findTeacherData = (day, teacher) => {
    const findAttendances = data?.schedules?.find(
      (item) => item.date === `${date.year}-${date.month}-${makeDayLength(day)}`
    )?.attendances;

    if (findAttendances) {
      const findTeacherData = findAttendances?.find((item) => item.name === teacher);
      return findTeacherData;
    } else {
      return "";
    }
  };

  const init = useCallback(async () => {
    try {
      let lastDay = 0;
      if (day) {
        lastDay = Number(day);
      } else {
        lastDay = dayjs(`${date.year}-${date.month}-01`).daysInMonth();
      }

      setMonthDays(
        Array(lastDay)
          .fill()
          .map((_, i) => i + 1)
      );
      if (!teacherList) {
        const teacherRes = await ServiceTeacher.getTeacherOptionsList({
          fields: TeacherType[0].id,
        });
        setTeacherList(teacherRes.teachers);
      }
      if(day) {
        const res = await ServiceTeacher.getAttendancesDay({
          status: 'Y',
          yearMonthDay: `${date.year}-${date.month}-${date.day}`,
        });
        setData(res);
      } else {
        const res = await ServiceTeacher.getAttendances({
          status,
          yearMonth: `${date.year}-${date.month}`,
        });
        setData(res);
      }
      
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, status]);

  // 인쇄 기능
  const printRef = useRef(null);
  const print = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @media print {
        body { zoom: 0.5; }  /* 페이지 크기를 줄이는 설정, 숫자는 조정 가능 */
        table { page-break-inside: avoid; } /* 테이블이 페이지 중간에서 잘리지 않도록 */
        tr, td, th { page-break-inside: avoid; }
      }
    `,
  })

  const clickPrint = () => {
    print();
  }

  useEffect(() => {
    if (date.year && date.month) {
      init();
    }
  }, [date?.month, date?.year, init]);

  useEffect(() => {
    if (day) {
      setDate({ year, month, day });
    } else {
      setDate({ year, month });
    }
  }, [month, year]);

  return (
    <div>
      <div className="layout-between sp-mt-20">
        <div className="ml-auto gap-s">
          <Buttons className="outlined mid" onClick={() => clickPrint()}>인쇄</Buttons>
        </div>
      </div>
        <div ref={printRef} id="scheduleArea" className="ui-date-table rate hover-none last-border sp-mt-10">
          <table>
            <thead>
              <tr className="sticky">
                <th className="th">
                  <div className="inner">Date</div>
                </th>
                {data?.totalAttendances.map((item) => (
                  <th key={item.id} className="th">
                    <div className="inner">{item.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthDays?.map((el, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <div className="ui-td ">{`${date.month}-${makeDayLength(el)}(${getDayOfWeek(
                        el
                      )})`}</div>
                    </td>
                    {data?.totalAttendances.map((teacher) => (
                      <td className="bgc-grey200" key={teacher.id}>
                        {findTeacherData(el, teacher.name)?.reservationCount ? (
                          <div className="ui-td">
                            <div className="txt-primary-deep">{
                              `${findTeacherData(el, teacher.name)?.attendanceCount}/
                              ${findTeacherData(el, teacher.name)?.reservationCount}`
                            }</div>
                            <div>{findTeacherData(el, teacher.name)?.attendanceRate}</div>
                          </div>
                        ) : (
                          <div className="ui-td"></div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bgc-grey300">
                <th>
                  <div className="ui-td">합계</div>
                </th>
                {data?.totalAttendances.map((item) => (
                  <td key={item.id}>
                    <div className="ui-td">
                      {`
                        ${findTotalData(item.name)?.attendanceCount || 0} /
                        ${findTotalData(item.name)?.reservationCount || 0}
                      `}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="bgc-grey300">
                <th>
                  <div className="ui-td">평균</div>
                </th>
                {data?.totalAttendances.map((item) => (
                  <td key={item.id}>
                    <div className="ui-td">{`${findTotalData(item.name)?.attendanceRate || 0}`}</div>
                  </td>
                ))}
              </tr>

              <tr className="sticky">
                <th className="th">
                  <div className="inner">Date</div>
                </th>
                {data?.totalAttendances.map((item) => (
                  <th key={item.id} className="th">
                    <div className="inner">{item.name}</div>
                  </th>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
    </div>
  );
};

export default Table;
