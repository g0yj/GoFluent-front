import { TeacherType } from "@/app/api/common";
import useRegisterResvWindow from "@/app/helper/windows-hooks/use-register-resv-window";
import ServiceResv from "@/app/service/service-resv";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import Tabs from "@/components/Tabs";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import DayTab from "./tabs/DayTab";
import WeekTab from "./tabs/WeekTab";
import _ from "lodash";

/**
 * 예약등록 모달
 */
const RegisterResvModal = () => {
  const { member, course, resvOpen, newState } = useRegisterResvWindow();
  const [memberInfo, setMemberInfo] = useState();
  const [courseInfo, setCourseInfo] = useState();
  const [courseList, setCourseList] = useState(null);
  const [resvList, setResvList] = useState(null);
  const [scheduleList, setScheduleList] = useState(null);
  const [tipList, setTipList] = useState(null);
  const [selectTip, setSelectTip] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedData, setSelectedData] = useState({
    year: dayjs(new Date()).format("YYYY"),
    month: dayjs(new Date()).format("MM"),
    day: dayjs(new Date()).format("DD"),
    week: 1,
    teacher: null,
    assistantTeacher: null,
  });
  const [sunDayDate, setSundayDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [teacherList, setTeacherList] = useState(null);
  const [tab, setTab] = useState("일별");

  console.log(resvOpen)

  useEffect(() => {
      if(!_.isEmpty(member) && !_.isEmpty(course)) {
        setMemberInfo(member);
        setCourseInfo(course);
        setSelectedCourse(course);
        setSelectedData({
          ...selectedData,
          teacher: course.teacherId,
          assistantTeacher: course.assistantTeacherId,
        })
      }
  }, [member, course])

  const onChangeTab = (text) => {
    setTab(text);
  };

  const createSchedule = async (data) => {
    try {
      if (data?.length === 0) {
        alert("예약일자를 선택해주세요.")
        return;
      }

      const saveData = { courseId: selectedCourse.id, scheduleIds: data };

      await ServiceResv.createSchedule(member.id, saveData);
      await getRecentReservations();

      getSchedule();
      getCourses();

      newState(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const onChangeCourse = (courseId) => {
    const findCourse = courseList.find((course) => course.id.toString() === courseId.toString());
    setSelectedCourse(findCourse);
  };

  const onSelectedDataChange = (data) => {
    setSelectedData((prev) => ({ ...prev, ...data }));
  };

  const getSchedule = useCallback(async () => {
    const weekendLength = 7;
    const getFirstDay = dayjs(`${selectedData.year}-${selectedData.month}-${1}`).get("day"); //0 sun -> 6 saturday
    const getSunDayDate = dayjs(
      `${selectedData.year}-${selectedData.month}-${
        selectedData.week * 7 + 1 + weekendLength - getFirstDay
      }`
    ).get("date"); //첫번째 일요일의 날짜

    const dayLengthOfMonth = dayjs().daysInMonth(`${selectedData.year}-${selectedData.month}-${1}`); //달의 마지막 날짜

    setSundayDate(getSunDayDate);
    setLastDate(dayLengthOfMonth);

    const weeks = (selectedData.week + 1) * 7 // 몇주차 지났는지의 값
    // new Date().getDay() // 현재 날짜 

    const diffDay = weeks + new Date().getDay() > dayLengthOfMonth // 한달이 지난 값 true / false

    //마지막주가 한달을 넘었을 경우
    const isOverDateOfMonth = getSunDayDate + 6 > dayLengthOfMonth;

    if (tab === "주별") {
      //dateTo 마지막 달의 4번째 주 이상일경우 1월로 처리
      // const saveData = {
      //   dateFrom: `${selectedData.year}-${diffDay ? Number(selectedData.month)+1 : selectedData.month}-${
      //     getSunDayDate < 10 ? `0${getSunDayDate}` : getSunDayDate
      //   }`,
      //   dateTo: `${selectedData.year}-${
      //     isOverDateOfMonth
      //       ? Number(selectedData.month) === 12
      //         ? "01"
      //         : Number(selectedData.month) + 1
      //       : diffDay ? Number(selectedData.month) + 1 : selectedData.month
      //   }-${
      //     isOverDateOfMonth
      //       ? getSunDayDate + 6 - dayLengthOfMonth < 10
      //         ? `0${getSunDayDate + 6 - dayLengthOfMonth}`
      //         : getSunDayDate + 6 - dayLengthOfMonth
      //         : getSunDayDate + 6 < 10
      //         ? `0${getSunDayDate}`
      //       : getSunDayDate + 6
      //   }`,
      //   teacherId: selectedData?.teacher?.value,
      //   assistantTeacherId: selectedData?.assistantTeacher?.value,
      // };
      // if (selectedData?.teacher) {
      //   const res = await ServiceResv.getScheduleListByDate(member.id, saveData);
      //   // console.log("getScheduleListByDate ==>", saveData);
      //   setScheduleList(res?.schedules);
      // }

      const saveData = {
        dateMonth: `${selectedData.year}-${selectedData.month}`,
        week: selectedData.week,
        teacherId: selectedData?.teacher,
        assistantTeacherId: selectedData?.assistantTeacher,
      }

      if (selectedData?.teacher) {
        const weekData = await ServiceResv.getScheduleListByWeek(memberInfo?.id, saveData);
        setScheduleList(weekData);

        setSundayDate(dayjs(weekData.schedules[0].reservations[0].date).get("date"))
      }
    } else {
      const saveData = {
        date: `${selectedData.year}-${selectedData.month}-${selectedData.day}`,
      };

      const res = await ServiceResv.getScheduleListByTime(member.id, saveData);
      console.log("getScheduleListByTime ==>", res);
      setScheduleList(res.schedules);
    }
  }, [
    memberInfo?.id,
    courseInfo,
    selectedData.assistantTeacher,
    selectedData.day,
    selectedData.month,
    selectedData.teacher,
    selectedData.week,
    selectedData.year,
    tab,
  ]);

  /**
   * @description 최근 5회 수강현황
   */
  const getRecentReservations = useCallback(async () => {
    try {
      const data = {
        limit: 5,
      };
      const res = await ServiceResv.getList(member?.id, selectedCourse?.id, data);
      setResvList(res.list);
    } catch (e) {
      console.error(e.message);
    }
  }, [member?.id, selectedCourse?.id]);

  /**
   * @description 과정 정보
   */
  const getCourses = useCallback(async () => {
    try {
      const res = await ServiceResv.getCourseList(memberInfo?.id, { status: "AVAILABLE" });
      setCourseList(res.list);
      setSelectedCourse(res.list[0]);
    } catch (e) {
      console.error(e.message);
    }
  }, [memberInfo?.id]);
  /**
   * @description 팁
   */
  const getTipList = useCallback(async () => {
    try {
      const res = await ServiceResv.getTipList(memberInfo?.id, selectedCourse?.id);
      setTipList(res);
    } catch (error) {
      console.error(error.message);
    }
  }, [memberInfo?.id, selectedCourse?.id]);
  /**
   * @description 팁 등록
   */
  const createTip = useCallback(
    async (content) => {
      try {
        await ServiceResv.registerTip(member?.id, selectedCourse?.id, content).then(async () => {
          await getTipList();
        });
      } catch (error) {
        console.error(error.message);
      }
    },
    [getTipList, member?.id, selectedCourse?.id]
  );
  const modifyTip = async (id, text) => {
    try {
      await ServiceResv.updateTip(id, text);
      setSelectTip(null);
      await getTipList();
    } catch (error) {
      console.error(error.message);
    }
  };
  const deleteTip = async (id) => {
    try {
      await ServiceResv.deleteTip(id);
      setSelectTip(null);
      await getTipList();
    } catch (error) {
      console.error(error.message);
    }
  }
  const getTeacherList = useCallback(async () => {
    try {
      const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
      setTeacherList(res.teachers);
      onSelectedDataChange({
        teacher: courseInfo?.teacherId, //res.teachers[0].value,
        assistantTeacher: courseInfo?.assistantTeacherId,//res.teachers[0].value,
      });
    } catch (error) {
      console.error(error.message);
    }
  }, [courseInfo]);

  console.log("teacher: ", teacherList)

  useEffect(() => {
    if (memberInfo && courseInfo) {
      getSchedule();
    }
  }, [
    memberInfo, 
    courseInfo,
    selectedData.assistantTeacher,
    selectedData.day,
    selectedData.month,
    selectedData.teacher,
    selectedData.week,
    selectedData.year,
    tab,
  ])

  useEffect(() => {
    if (memberInfo && courseInfo) {
      getTeacherList();
      getCourses();
      getTipList();
    }
  }, [memberInfo, courseInfo]);
  // useEffect(() => {
  //   getTipList();
  // }, [member]);
  // useEffect(() => {
  //   getTeacherList();
  // }, [getTeacherList]);
  // useEffect(() => {
  //   getSchedule();
  // }, [member]);

  useEffect(() => {
    if (selectedCourse?.id) {
      getRecentReservations();
    }
  }, [getRecentReservations, selectedCourse?.id]);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     newState(true);
  //     event.preventDefault();
  //   }

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">
          예약등록
          <div className="sub">
            <div>- {member?.name}</div>
            <small>({member?.email})</small>
          </div>
        </div>
      </div>

      <div className="flex gap-20 sp-mt-20">
        <div className="flexColumn">
          <div>
            <div className="ui-sub-title small">
              <div className="title">
                <div className="tit-wrap">
                  <div className="tit">최근 5회 수강현황</div>
                </div>
              </div>
            </div>
            <div className="ui-info-table sp-mt-10">
              <table className="auto">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>예약일</th>
                    <th>예약시간</th>
                    <th>담임강사</th>
                    <th>출결</th>
                  </tr>
                </thead>
                <tbody>
                  {resvList?.map((resv, index) => (
                    <tr className="text-center" key={`resv-list-${index}`}>
                      <td>{index + 1}</td>
                      <td>{resv.date}</td>
                      <td>{resv.modifiedOn}</td>
                      <td>{resv.teacherName}</td>
                      <td className={
                        resv.attendanceStatus==="출석" ? "txt-secondary" : 
                        resv.attendanceStatus==="결석" ? "txt-error" : 
                        ""
                      }>
                        {resv.attendanceStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sp-mt-20 flexColumn h-full">
            {selectTip ? (
              <EditTip tip={selectTip} goBack={() => setSelectTip(null)} modifyTip={modifyTip} deleteTip={deleteTip} />
            ) : (
              <TipList selectTip={setSelectTip} tipList={tipList} createTip={createTip} />
            )}
          </div>
        </div>
        <div className="flex1">
          <div className="ui-tabs-large">
            <Tabs defaultActiveTab={tab} onChangeTab={onChangeTab}>
              <div label="주별">
                <WeekTab
                  scheduleList={scheduleList}
                  courseList={courseList}
                  selectedCourse={selectedCourse}
                  teacherList={teacherList}
                  selectedData={selectedData}
                  sunDayDate={sunDayDate}
                  lastDate={lastDate}
                  onChangeCourse={onChangeCourse}
                  onSelectedDataChange={onSelectedDataChange}
                  createSchedule={createSchedule}
                />
              </div>
              <div label="일별">
                <DayTab
                  scheduleList={scheduleList}
                  courseList={courseList}
                  selectedCourse={selectedCourse}
                  teacherList={teacherList}
                  selectedData={selectedData}
                  onChangeCourse={onChangeCourse}
                  onSelectedDataChange={onSelectedDataChange}
                  createSchedule={createSchedule}
                />
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

const TipList = ({ selectTip, tipList, createTip }) => {
  const [input, setInput] = useState("");

  return (
    <>
      <div className="ui-tip-add">
        <div className="tit">TIP</div>
        <div className="flex1">
          <input
            type="text"
            className="input-init flex1"
            onChange={({ target: { value } }) => setInput(value)}
          />
          <Buttons className="outlined xsmall2" onClick={() => createTip(input)}>
            등록
          </Buttons>
        </div>
      </div>

      <div className="ui-scroll-wrap">
        <div className="ui-scroll-inner">
          <div className="ui-tip-list h-full">
            {tipList?.map((el, i) => {
              return (
                <div key={el.id}>
                  <div className="num">{i + 1}</div>
                  <div className="cont">
                    <a
                      href="#"
                      className="ui-link size-bodyS secondary-high"
                      onClick={() => selectTip(el)}
                    >
                      {el.content}
                    </a>
                    <div className="detail">
                      {el.modifiedOn} - {el.modifierName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const EditTip = ({ tip, goBack, modifyTip, deleteTip }) => {
  const [tipText, setTipText] = useState(tip.content);

  return (
    <>
      <div className="ui-sub-title small">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">비고 수정</div>
          </div>
        </div>
      </div>
      <div className="ui-tip-add sp-mt-10">
        <div className="tit">TIP</div>
        <div className="flex1">
          <input
            type="text"
            className="input-init flex1"
            value={tipText}
            onChange={(e) => setTipText(e.target.value)}
          />
          <Buttons className="outlined xsmall2" onClick={() => modifyTip(tip.id, tipText)}>
            수정
          </Buttons>
        </div>
      </div>
      <div className="layout-between sp-mt-10">
        <div className="ml-auto gap">
          <Buttons className="grey xsmall2" onClick={() => deleteTip(tip.id)}>삭제</Buttons>
          <Buttons className="grey-light xsmall2" onClick={goBack}>
            목록
          </Buttons>
        </div>
      </div>
    </>
  );
};

export default RegisterResvModal;
