import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import ServiceTeacher from "@/app/service/service-teacher";
import dayjs from "dayjs";
import { TeacherType } from "@/app/api/common";

const CgtSchedule = () => {
  const [isDetail, setIsDetail] = useState(false);
  const [cgts, setCgts] = useState({});
  const [teachers, setTeachers] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [date, setDate] = useState(null);
  const [searchData, setSearchData] = useState({});
  const [deleteData, setDeleteData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const onClick = () => {
    setIsDetail(true);
  };

  const onChangeData = (value) => {
    setSearchData((prev) => ({ ...prev, ...value }));
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD")
      onChangeData({date: formattedDate});
    } else {
      setSearchData(prevData => {
        const { date, ...rest } = prevData;
        return rest;
      });
    }
  }

  const getCgt = useCallback(async() => {
    const res = await ServiceTeacher.getCgt(searchData);
    console.log("getCgt ==>", res);
    setCgts(res);
  })

  const getTeacher = useCallback(async() => {
    const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
    console.log("getTeachers ==>", res);
    setTeachers(res.teachers);
  })

  // 검색 버튼 클릭
  const onClickSearchBtn = () => {
    getCgt();
  };

  const goBack = () => {
    setIsDetail(false);
    getCgt();
  }

  const onCheckChange = (index, schedules) => {
    setCheckedItems(prevState => {
        const isChecked = !prevState[index];

        setDeleteData(prevDeleteData => {
          if (isChecked) {
              const idsToAdd = schedules.map(schedule => schedule.id);
              return [...prevDeleteData, ...idsToAdd];
          } else {
              const idsToRemove = schedules.map(schedule => schedule.id);
              return prevDeleteData.filter(id => !idsToRemove.includes(id));
          }
        });

        return {
            ...prevState,
            [index]: isChecked // 체크 상태 업데이트
        };
    });
  };


  // 전체 선택
  const onSelectAllChange = () => {
    if (selectAll) {
      setCheckedItems({});
      setDeleteData([]);
      setSelectAll(false);
    } else {
      const newCheckedItems = {};
      const newDeleteData = [];

      cgts.list.forEach((cgt, index) => {
        newCheckedItems[index] = true;
        newDeleteData.push(...cgt.schedules.map(schedule => schedule.id));
      });

      setCheckedItems(newCheckedItems);
      setDeleteData(newDeleteData);
      setSelectAll(true);
    }
  };

  const onClickCheckDelete = async () => {
    if(confirm("삭제하시겠습니까?")) {
      await ServiceTeacher.deleteCgt({schedules: deleteData});

      getCgt();
    }
  }

  useEffect(() => {
    getCgt();
  }, [searchData])

  useEffect(() => {
    getTeacher();
  }, [])

  // 검색 조건 (form)
  const paginationData = usePagination();

  return (
    <section className="ui-contents-wrap mid-width flex1">
      <div className="ui-contents-inner">
        {isDetail ? (
          <CgtScheduleDetail  goBack={goBack}/>
        ) : (
          <div>
            <div className="ui-location-wrap">
              <div className="ui-location-title">CGT스케줄</div>
              <div className="ui-location">
                <NavLink>
                  <i className="fa-solid fa-house"></i>
                </NavLink>
                <NavLink>
                  <i className="fa-solid fa-caret-right"></i>
                  <strong>강사관리</strong>
                </NavLink>
                <i className="fa-solid fa-caret-right"></i>
                <strong>CGT스케쥴</strong>
              </div>
            </div>

            <div className="ui-info-table sp-mt-10">
              <table>
                <colgroup>
                  <col style={{ width: "14%" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>검색</th>
                    <td>
                      <div className="flexYCenter gap">
                        <div className="ui-datepicker-wrap">
                          <div>
                            <DatePicker
                              selected={searchData?.date} 
                              onChange={(date) => handleDateChange(date)}
                            />
                          </div>
                        </div>
                        <button className="ui-select">
                          <select 
                            className="input-init"
                            onChange={({ target: {value} }) => onChangeData({teacherId: value})}
                          >
                            <option value="">-강사명-</option>
                            {teachers?.map((teacher, index) => (
                              <option key={teacher.value} value={teacher.value}>
                                {teacher.label}
                              </option>
                            ))}
                          </select>
                        </button>
                        <button className="ui-select">
                          <select className="input-init">
                            <option value="">-수강명-</option>
                            <option value="">Free/CGT</option>
                          </select>
                        </button>

                        <Buttons className="outlined xsmall" onClick={onClickSearchBtn}>
                          <span className="flexYCenter gap">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            검색
                          </span>
                        </Buttons>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="layout-between sp-mt-10">
              <div>
                <div className="size-bodyXS">
                  <strong className="m">Total :</strong>{" "}
                  <strong className="b txt-secondary">{cgts?.totalCount? cgts.totalCount : 0}</strong>{" "}
                  <span className="txt-grey600">건</span>
                </div>
              </div>

              <div className="gap-s">
                <Buttons className="outlined small" onClick={onClick}>
                  등록
                </Buttons>
                <Buttons className="outlined small" onClick={onClickCheckDelete}>
                  선택삭제
                </Buttons>
              </div>
            </div>

            <div className="ui-list-table sp-mt-10">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>예약일자</th>
                    <th>강사명</th>
                    <th>수강명</th>
                    <th>예약시간</th>
                    <th>예약자</th>
                    <th>모집 인원 수</th>
                    <th>
                      <input 
                        type="checkbox" 
                        checked={selectAll}
                        onChange={onSelectAllChange}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cgts && cgts?.list?.length > 0 ? 
                    (cgts?.list?.map((cgt, index) => (
                      <tr>
                        <td>{cgts.totalCount - index}</td>
                        <td>{cgt.date}</td>
                        <td>{cgt.teacherName}</td>
                        <td>Free/CGT</td>
                        <td>{cgt.startTime}~{cgt.endTime}</td>
                        <td>{cgt.reservationCount}</td>
                        <td>{cgt.reservationLimit}</td>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={!!checkedItems[index]}
                            onChange={() => onCheckChange(index, cgt.schedules)}
                          />
                        </td>
                      </tr>
                    )))
                    :
                    (
                      <tr>
                        <td colSpan="8">해당 자료가 없습니다.</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>

              <PageNations key={paginationData.startPage} data={paginationData} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const CgtScheduleDetail = ({goBack}) => {
  const [teachers, setTeachers] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [date, setDate] = useState(dayjs().toDate());
  const [cgttimes, setCgttimes] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [reservationLimit, setReservationLimit] = useState(1);

  const searchData = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : dayjs().toDate(),
    teacherId: teacherId ? teacherId : ""
  }

  const getTeacher = useCallback(async() => {
    const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
    console.log("getTeachers ==>", res);
    setTeachers(res.teachers);
  }, [])

  const getCgttimes = useCallback(async() => {
    console.log("searchData==>",searchData)

    const res = await ServiceTeacher.getCgttimes(searchData);
    console.log("getCgttimes==>", res);
    setCgttimes(res);
  }, [searchData, teacherId, date])

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  }

  const handleTeacherChange = (event) => {
    setTeacherId(event.target.value);
  }

  const putCgt = () => {
    const data = {
      date: dayjs(date).format("YYYY-MM-DD"),
      startTime: startTime,
      teacherId: teacherId,
      type: "CGT",
      reservationLimit: parseInt(reservationLimit)
    }

    console.log("putCgtData==>", data);
    
    // startTime 데이터가 현재 HH:mm:ss 형식으로 되어 있는데
    // 서버에서 넘겨받는 데이터 HH:mm으로 변경해주면 됨
    const res = ServiceTeacher.putCgt(data);

    goBack();
  }

  useEffect(() => {
    getTeacher();
  }, [getTeacher]);

  useEffect(() => {
    getCgttimes();
  }, [ teacherId, date]);

  return (
    <div>
      <div className="ui-location-wrap">
        <div className="ui-location-title">CGT스케줄</div>
      </div>

      <div className="ui-info-table th-left sp-mt-20">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>수강명</th>
              <td>
                <button className="ui-select">
                  <select className="input-init">
                    <option value="">-수강명-</option>

                    <option value="">Free/CGT</option>
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>강사명</th>
              <td>
                <button className="ui-select">
                  <select 
                    className="input-init"
                    value={teacherId}
                    onChange={handleTeacherChange}
                  >
                    <option value>-강사명-</option>

                    {teachers?.map((teacher, index) => (
                      <option key={teacher.value} value={teacher.value}>
                        {teacher.label}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>예약일시</th>
              <td>
                <div className="flexYCenter gap">
                  <div className="ui-datepicker-wrap">
                    <div>
                    <DatePicker
                      selected={date} 
                      onChange={handleDateChange}
                    />
                    </div>
                  </div>
                  <button className="ui-select">
                    <select 
                      className="input-init"
                      onChange={({target: {value}}) => setStartTime(value)}
                    >
                      <option value="">-시간선택-</option>
                      
                      {cgttimes?.map((time) => (
                        <option value={time}>{time}</option>
                      ))}
                    </select>
                  </button>
                  <div className="txt-red sp-mt-5">( 강사를 선택 하세요 )</div>
                </div>
              </td>
            </tr>
            <tr>
              <th>모집 인원 수</th>
              <td>
                <div className="flexYCenter gap">
                  <select 
                    className="input-init"
                    onChange={({target: {value}}) => setReservationLimit(value)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                  <div className="txt-grey600 sp-mt-5">명</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-10">
        <Buttons className="grey-light small text-center" style={{ width: 80 }} onClick={goBack}>
          목록
        </Buttons>
        <Buttons className="primary small text-center" style={{ width: 80 }} onClick={putCgt}>
          등록
        </Buttons>
      </div>
    </div>
  );
};

export default CgtSchedule;
