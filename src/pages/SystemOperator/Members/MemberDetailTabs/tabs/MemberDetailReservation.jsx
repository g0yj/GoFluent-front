import useRegisterResvWindow from "@/app/helper/windows-hooks/use-register-resv-window";
import ServiceResv from "@/app/service/service-resv";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useCancelReservationWindow from "@/app/helper/windows-hooks/use-cancel-reservation-window"

/**
 * 회원상세 > 예약 탭
 */
const MemberDetailReservation = ({ member }) => {
  const paginationData = usePagination();

  const [courseList, setCourseList] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [resvList, setResvList] = useState(null);
  const [cancelList, setCancelList] = useState([]);

  // 색상 변경
  const [rowColors, setRowColors] = useState([]);

  // 과정 변경
  const handleChange = (e) => {
    const changeCourse = courseList.find((item) => item.id.toString() === e.target.value);
    setSelectedCourse(changeCourse);
  };

  // 검색 조건 (form)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isIncludeCancel, setIsIncludeCancel] = useState(false); // 취소포함
  const [isIncludeAttendance, setIsIncludeAttendance] = useState(false); // 출결완료포함

  const { resvOpen, newState, openRegisterResvWindow } = useRegisterResvWindow();
  const { openCancelReservationWindow, cancelResv, CancelResvOpen } = useCancelReservationWindow();

  const onCheckClick = (isChecked, item) => {
    if (isChecked) {
      setCancelList((prev) => [...prev, item]);
    } else {
      const saveData = cancelList.filter((cancelItem) => cancelItem.id !== item.id);
      setCancelList(saveData);
    }
  };

  const onCancelClick = async () => {
    try {
      if(cancelList.length !== 0) {
        const saveData = cancelList.map((item) => ({
          id: item.id,
          isCancel: true,
        }));
  
        openCancelReservationWindow(selectedCourse, member, saveData);
      } else {
        alert("선택 항목이 없습니다.")
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSearchPress = async () => {
    try {
      const saveData = {
        page: paginationData.page,
        limit: 20,
        startDate: dayjs(new Date(startDate || endDate)).format("YYYY-MM-DD"),
        endDate: dayjs(new Date(endDate || startDate)).format("YYYY-MM-DD"),
        excludeCancel: isIncludeCancel,
        excludeAttendance: isIncludeAttendance,
      };
      const res = await ServiceResv.getList(member.id, selectedCourse.id, saveData);
      setResvList(res.list);
      paginationData.setTotalPage(res.totalPage);
    } catch (error) {
      console.error("onSearchPress error ==>", error);
    }
  };

  const cancelInclude = async() => {
    const saveData = {
      page: paginationData.page,
      limit: 20,
      startDate: dayjs(new Date(startDate || selectedCourse?.startDate)).format("YYYY-MM-DD"),
      endDate: dayjs(new Date(endDate || selectedCourse?.endDate)).format("YYYY-MM-DD"),
      excludeCancel: !isIncludeCancel,
      excludeAttendance: !isIncludeAttendance,
    };

    if(!isIncludeCancel || !isIncludeAttendance) {
      setResvList(null)
    }
    const res = await ServiceResv.getCancelInclude(member?.id, selectedCourse?.id, saveData);

    setResvList(res.list)
    paginationData.setTotalPage(res.totalPage);
  }

  const statusMessages = {
    "출석": "txt-secondary",
    "결석": "txt-error",
    "예약": ""
  };

  useEffect(() => {
    cancelInclude();
  }, [isIncludeCancel, isIncludeAttendance])

  useEffect(() => {
    if (selectedCourse) {
      const fetch = async () => {
        try {
          const res = await ServiceResv.getList(member.id, selectedCourse.id, {
            page: paginationData.page,
            limit: 20,
            startDate: dayjs(selectedCourse.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(selectedCourse.endDate).format("YYYY-MM-DD"),
            excludeCancel: !isIncludeCancel,
            excludeAttendance: !isIncludeAttendance,
          });

          console.log("과정명이 바뀌었습니다.")

          setResvList(res.list);
          paginationData.setTotalPage(res.totalPage);
        } catch (e) {
          console.error(e.message);
        }
      };

      fetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member.id, paginationData.page, selectedCourse]);

  useEffect(() => {
    if (resvOpen) {
      if (selectedCourse) {
        const fetch = async () => {
          try {
            const res = await ServiceResv.getList(member.id, selectedCourse.id, {
              page: paginationData.page,
              limit: 20,
              startDate: dayjs(selectedCourse.startDate).format("YYYY-MM-DD"),
              endDate: dayjs(selectedCourse.endDate).format("YYYY-MM-DD"),
              excludeCancel: !isIncludeCancel,
              excludeAttendance: !isIncludeAttendance,
            });
  
            setResvList(res.list);
            paginationData.setTotalPage(res.totalPage);

            const courseData = await ServiceResv.getCourseList(member.id, {
              status: "VALID",
            });
            setCourseList(courseData.list);
            setSelectedCourse(courseData.list.find((item) => item.id === selectedCourse.id));
          } catch (e) {
            console.error(e.message);
          }
        };
  
        fetch();
      }

      newState(false);
    }
  }, [resvOpen, newState])

  useEffect(() => {
    if (cancelResv) {
      if (selectedCourse) {
        const fetch = async () => {
          try {
            const res = await ServiceResv.getList(member.id, selectedCourse.id, {
              page: paginationData.page,
              limit: 20,
              startDate: dayjs(selectedCourse.startDate).format("YYYY-MM-DD"),
              endDate: dayjs(selectedCourse.endDate).format("YYYY-MM-DD"),
              excludeCancel: !isIncludeCancel,
              excludeAttendance: !isIncludeAttendance,
            });
  
            setResvList(res.list);
            paginationData.setTotalPage(res.totalPage);

            const courseData = await ServiceResv.getCourseList(member.id, {
              status: "VALID",
            });
            setCourseList(courseData.list);
            setSelectedCourse(courseData.list.find((item) => item.id === selectedCourse.id));
          } catch (e) {
            console.error(e.message);
          }
        };
  
        fetch();
      }

      setCancelList([])
      CancelResvOpen(false);
    }
  }, [cancelResv, CancelResvOpen])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await ServiceResv.getCourseList(member.id, {
          status: "VALID",
        });
        setCourseList(res.list);
        setSelectedCourse(res.list[0]);
        setResvList([]);
      } catch (e) {
        console.error(e.message);
      }
    };

    fetch();
  }, [member.id]);

  useEffect(() => {
    // 색상 로직을 여기서 처리
    const colors = [];
    let currentColor = 'bgc-c-yellow';
    let prevD = '';
    
    resvList?.forEach((resv) => {
      if (prevD !== resv.date) {
        currentColor = currentColor === 'bgc-c-yellow' ? 'bgc-c-orange' : 'bgc-c-yellow';
        prevD = resv.date; // 이전 날짜 업데이트
        
      }
      colors.push(currentColor); // 색상 추가
    });

    setRowColors(colors); // 계산된 색상 목록 저장
  }, [resvList]); // resvList가 변경될 때만 실행

  return (
    <div>
      <div className="ui-sub-title sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{member.name}</div>
            <small>({member.email})</small>
          </div>
        </div>

        <div>
          <Buttons className="primary small" onClick={() => openRegisterResvWindow(member, selectedCourse)}>
            예약등록
          </Buttons>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-20">
        <table>
          <colgroup>
            <col style={{ width: 100 }} />
            <col />
            <col style={{ width: 100 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>과정</th>
              <td colSpan={3}>
                <button className="ui-select">
                  <select className="input-init" value={selectedCourse?.id} onChange={handleChange}>
                    {courseList?.map((course) => {
                      return (
                        <option key={`course-${course?.id}`} value={course?.id}>
                          {course.name}
                        </option>
                      );
                    })}
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>수강기간</th>
              {selectedCourse && (
                <td>
                  {selectedCourse.startDate} ~ {selectedCourse.endDate}
                </td>
              )}
              <th>예약현황</th>
              {selectedCourse && (
                <td>
                  <div className="flexYCenter gap-10">
                    <div className="flex-none">
                    {selectedCourse.assignmentCount} / {selectedCourse.lessonCount} (
                      <strong className="m txt-primary-deep">
                        잔여:{selectedCourse.remainCount}회
                      </strong>
                      )
                    </div>
                  </div>
                </td>
              )}
            </tr>
            <tr>
              <th>담임강사</th>
              {selectedCourse && <td>{selectedCourse.teacherName}</td>}
              <th>부담임강사</th>
              {selectedCourse && <td>{selectedCourse.assistantTeacherName}</td>}
            </tr>
            <tr>
              <th>수업일</th>
              <td colSpan={3}>
                <div className="ui-datepicker-wrap">
                  <div>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectStart
                      startDate={startDate}
                      endDate={endDate}
                    ></DatePicker>
                  </div>
                  <div className="txt-grey500">~</div>
                  <div>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectStart
                      startDate={startDate}
                      endDate={endDate}
                    ></DatePicker>
                  </div>
                  <div>
                    <Buttons className="outlined xsmall2" onClick={onSearchPress}>
                      검색
                    </Buttons>{" "}
                  </div>
                  <div>
                    <div className="ui-check full gap">
                      <div className="check">
                        <input
                          type="checkbox"
                          className="input-init"
                          id="search-1-1"
                          checked={isIncludeCancel}
                          onChange={() => setIsIncludeCancel((prev) => !prev)}
                        />
                        <label htmlFor="search-1-1">취소포함</label>
                      </div>
                      <div className="check">
                        <input
                          type="checkbox"
                          className="input-init"
                          id="search-1-2"
                          checked={isIncludeAttendance}
                          onChange={() => setIsIncludeAttendance((prev) => !prev)}
                        />
                        <label htmlFor="search-1-2">출결완료포함</label>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-list-table sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 60 }} />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>수업일</th>
              <th>수업</th>
              <th>수업시간</th>
              <th>강사</th>
              <th>처리직원</th>
              <th>출결</th>
              <th>
                <Buttons className="outlined bgc-white xsmall" onClick={onCancelClick}>
                  예약취소
                </Buttons>
              </th>
            </tr>
          </thead>
          <tbody>
          {resvList?.length === 0 ? (
            <tr>
              <td colSpan="8">해당 자료가 없습니다.</td>
            </tr>
          ) : (
            resvList?.map((resv, i) => {
              return (
                <tr className={rowColors[i]} key={`reservation-${resv.id}`}>
                  <td className={resv?.cancelDate ? "txt-warning" : ""}>
                    {resv.listNumber}
                  </td>
                  <td>{resv.date}</td>
                  <td>{resv.lessonType}</td>
                  <td className={resv?.cancelDate ? "txt-warning" : ""}>
                    {resv.startTime} ~ {resv.endTime}
                  </td>
                  <td className={resv?.cancelDate ? "txt-warning" : ""}>
                    {resv.teacherName}
                  </td>
                  <td>
                    <p className={resv?.cancelDate ? "txt-warning" : ""}>
                      {resv.modifierName}
                    </p>
                    {resv.modifiedOn}
                  </td>
                  <td className={statusMessages[resv.attendanceStatus]}>{resv.attendanceStatus}</td>
                  {resv.cancelDate? (
                    <td>
                      <div className="txt-warning">{resv.cancelDate}</div>
                      <div className="txt-warning">취소됨({resv.cancelerName})</div>
                    </td>
                  ):(
                      resv.attendanceStatus === "예약"? (
                        <td>
                          <input
                            type="checkbox"
                            checked={cancelList.find((item) => item.id === resv.id)}
                            onChange={({ target: { checked } }) => onCheckClick(checked, resv)}
                          />
                        </td>
                    ):(
                      <td></td>
                    )
                  
                  )}
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>
      <PageNations key={paginationData.startPage} data={paginationData} />
    </div>
  );
};

export default MemberDetailReservation;
