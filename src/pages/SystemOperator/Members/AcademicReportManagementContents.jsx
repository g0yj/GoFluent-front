import { Fragment, useCallback, useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";
import { NavLink } from "react-router-dom";
import AcademicReportDetailForm from "./AcademicReportDetail/AcademicReportDetailForm";

import { TeacherType } from "@/app/api/common";
import useReportWindow from "@/app/helper/windows-hooks/use-report-window";
import ServiceReport from "@/app/service/service-report";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import ExcelTest from "@/pages/SystemOperator/Members/ExcelTest";

const SearchType = [
  { id: "ALL", title: "전체" },
  { id: "ATTENDANCE", title: "출석" },
  { id: "REPORT", title: "미작성" },
];

const CourseStatus = [
  {
    id: "TIME",
    title: "시간",
  },
  {
    id: "TEACHER",
    title: "강사",
  },
];

const AttendanceStatus = [
  {
    id: "Y",
    title: "출석",
  },
  {
    id: "N",
    title: "결석",
  },
  {
    id: "R",
    title: "예약",
  },
];

const ExcelHeader = [
  "No", 
  "수강시간",
  "회원명",
  "휴대폰번호",
  "수강회차",
  "잔여횟수",
  "출결정보",
  "학사보고서 내용",
]

/**
 * 회원관리(1depth) > 학사보고서(2depth)
 */
const AcademicReportManagementContents = () => {
  const paginationData = usePagination();

  const [academicReportList, setAcademicReportList] = useState(null);
  const [selectedAcademicReport, setSelectedAcademicReport] = useState(null);
  // const [searchData, setSearchData] = useState(null);
  const [total, setTotal] = useState(0);
  const [teacherList, setTeacherList] = useState(null);

  const [sortTarget, setSortTarget] = useState("");
  const [directionTF, setDirectionTF] = useState(true);
  const [excelData, setExcelData] = useState();

  // 검색조건 , 정렬순서 default
  const [searchData, setSearchData] = useState({
    startDate: dayjs(new Date()).format("YYYY-MM-DD"),
    endDate: dayjs(new Date()).format("YYYY-MM-DD"),
    reportCondition: "ATTENDANCE",
    reportSort: "TEACHER",
  });

  const onChangeSearchData = (data) => {
    setSearchData((prev) => ({ ...prev, ...data }));
  };

  const getReportListData = useCallback(async () => {
    try {
      const saveData = {
        dateFrom:
          dayjs(searchData.startDate).format("YYYY-MM-DD") ||
          dayjs(new Date()).format("YYYY-MM-DD"),
        dateTo:
          dayjs(searchData.endDate).format("YYYY-MM-DD") || dayjs(new Date()).format("YYYY-MM-DD"),
        search: searchData.userName,
        reportSort: searchData.reportSort || "TEACHER",
        reportCondition: searchData.reportCondition,
        teacherId: searchData.teacherId || null,
        limit: searchData.limit || 20,
        page: paginationData.page,
        order: searchData.order,
        direction: searchData.direction,
      };
      const res = await ServiceReport.getReportList(saveData);
      setAcademicReportList(res.list);
      setTotal(res.totalCount);
      paginationData.setTotalPage(res.totalPage);


      const searchExcel = {
        dateFrom: saveData.dateFrom,
        dateTo: saveData.dateTo,
        teacherId: saveData.teacherId,
        keyword: saveData.search,
        reportCondition: saveData.reportCondition,
        usertype: "A",
      }
      const getExcel = await ServiceReport.getReportExcel(searchExcel);
      console.log("excelData: ", getExcel)
      setExcelData(getExcel);
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationData.page,
    searchData.reportSort,
    searchData.endDate,
    searchData.limit,
    searchData.reportCondition,
    searchData.startDate,
    searchData.teacherId,
    searchData.userName,
    searchData.order,
    searchData.direction
  ]);

  const getTeacherList = useCallback(async () => {
    try {
      const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
      setTeacherList(res.teachers);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const goBack = async () => {
    setSelectedAcademicReport(null);
  };

  const onSubmit = async () => {
    setSelectedAcademicReport(null);
    await getReportListData();
  };

  const sortHeader = (target) => {
    console.log(target);

    if(sortTarget === target && !directionTF) {
      setDirectionTF(true);
      setSearchData((prev) => ({...prev, order: target, direction: "DESC"}))
    } else {
      setDirectionTF(false);
      setSortTarget(target);
      setSearchData((prev) => ({...prev, order: target, direction: "ASC"}))
    }

  }

  useEffect(() => {
    getTeacherList();
  }, [getTeacherList]);

  useEffect(() => {
    getReportListData();
  }, [getReportListData]);

  return selectedAcademicReport ? (
    <AcademicReportDetailForm
      academicReport={selectedAcademicReport}
      goBack={goBack}
      onSubmit={onSubmit}
    />
  ) : (
    <AcademicReportList
      total={total}
      academicReportList={academicReportList}
      searchData={searchData}
      paginationData={paginationData}
      teacherList={teacherList}
      selectAcademicReport={setSelectedAcademicReport}
      onChangeSearchData={onChangeSearchData}
      getReportListData={getReportListData}
      sortHeader={sortHeader}
      excelData={excelData}
    />
  );
};

// 학사 보고서 리스트
const AcademicReportList = ({
  total,
  searchData,
  academicReportList,
  teacherList,
  selectAcademicReport,
  paginationData,
  onChangeSearchData,
  getReportListData,
  sortHeader,
  excelData,
}) => {
  const { openReportWindow } = useReportWindow();

  const [isExpanded, setExpanded] = useState(true);
  const { getCollapseProps } = useCollapse({ isExpanded });

  const onTodayPress = () => {
    onChangeSearchData({ startDate: new Date(), endDate: new Date() });
  };

  const onMonthPress = () => {
    onChangeSearchData({
      startDate: dayjs(new Date()).set("date", 1).format(),
      endDate: new Date(),
    });
  };

  const onSearchPress = async () => {
    await getReportListData();
  };

  return (
    <section className="ui-contents-wrap flex1 max-width">
      <div className="ui-contents-inner">
        <div className="ui-location-wrap">
          <div className="ui-location-title">학사보고서</div>
          <div className="ui-location">
            <NavLink>
              <i className="fa-solid fa-house"></i>
            </NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <NavLink className="ui-link primary">회원관리</NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <strong>학사보고서</strong>
          </div>
        </div>
        <div className="flex">
          <div className="ml-auto">
            <Buttons onClick={() => setExpanded((prevExpanded) => !prevExpanded)}>
              <span className="flexYCenter gap">
                <span className={`${isExpanded ? "tf-rotate" : ""}`}>
                  <i className="fa-solid fa-circle-chevron-down txt-secondary"></i>
                </span>
                <span className="size-bodyS">상세검색</span>
              </span>
            </Buttons>
          </div>
        </div>
        <div className="ui-info-table" {...getCollapseProps()}>
          <table>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col />
              <col style={{ width: "10%" }} />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>가입일자</th>
                <td>
                  <div className="flexYCenter gap">
                    <div className="ui-datepicker-wrap">
                      <div>
                        <DatePicker
                          selected={searchData?.startDate || new Date()}
                          onChange={(date) => onChangeSearchData({ startDate: date })}
                          selectStart
                          startDate={searchData?.startDate || new Date()}
                          endDate={searchData?.endDate || new Date()}
                        ></DatePicker>
                      </div>
                      <div className="txt-grey500">~</div>
                      <div>
                        <DatePicker
                          selected={searchData?.endDate || new Date()}
                          onChange={(date) => onChangeSearchData({ endDate: date })}
                          selectStart
                          startDate={searchData?.startDate || new Date()}
                          endDate={searchData?.endDate || new Date()}
                        ></DatePicker>
                      </div>
                    </div>

                    <Buttons className="ui-button outlined xsmall" onClick={onTodayPress}>
                      당일
                    </Buttons>
                    <Buttons className="ui-button outlined xsmall" onClick={onMonthPress}>
                      이번 달
                    </Buttons>
                  </div>
                </td>
                <th>검색조건</th>
                <td>
                  <div className="ui-radio-group">
                    {SearchType?.map((item, index) => (
                      <div key={item.id}>
                        <input
                          type="radio"
                          id={`search1_${index}`}
                          name={`search1_${index}`}
                          checked={searchData?.reportCondition === item.id}
                          onChange={() => {
                            onChangeSearchData({ reportCondition: item.id });
                          }}
                        />
                        <label htmlFor={`search1_${index}`}>{item.title}</label>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th>담당강사</th>
                <td>
                  <div className="flexYCenter gap">
                    <button className="ui-select">
                      <select
                        className="input-init"
                        onChange={({ target: { value } }) =>
                          onChangeSearchData({ teacherId: value })
                        }
                        value={searchData?.teacherId}
                      >
                        <option value="">-선택-</option>
                        {teacherList?.map((teacher) => (
                          <option key={teacher.value} value={teacher.value}>
                            {teacher.label}
                          </option>
                        ))}
                      </select>
                    </button>
                    <Buttons
                      className="ui-button outlined xsmall"
                      onClick={() => onChangeSearchData({ teacherId: "" })}
                    >
                      Clear
                    </Buttons>
                  </div>
                </td>
                <th>정렬순서</th>
                <td>
                  <div className="ui-radio-group">
                    {CourseStatus?.map((item, index) => (
                      <div key={item.id}>
                        <input
                          type="radio"
                          id={`search2_${index}`}
                          name={`search2_${index}`}
                          checked={searchData?.reportSort === item.id}
                          onChange={() => onChangeSearchData({ reportSort: item.id })}
                        />
                        <label htmlFor={`search2_${index}`}>{item.title}</label>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th>고객이름</th>
                <td colSpan="3">
                  <div className="flexYCenter gap">
                    <input
                      type="text"
                      className="input-init"
                      placeholder="검색"
                      value={searchData?.userName}
                      onChange={({ target: { value } }) => onChangeSearchData({ userName: value })}
                    />
                    <Buttons
                      className="ui-button outlined xsmall"
                      onClick={() => onChangeSearchData({ userName: "" })}
                    >
                      Clear
                    </Buttons>
                    <Buttons className="outlined xsmall" onClick={onSearchPress}>
                      <span className="flexYCenter gap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        검색
                      </span>
                    </Buttons>

                    <button className="ui-select">
                      <select
                        className="input-init"
                        onChange={({ target: { value } }) => onChangeSearchData({ limit: value })}
                      >
                        <option value="20">20명</option>
                        <option value="40">40명</option>
                        <option value="80">80명</option>
                        <option value="100">100명</option>
                        <option value="200">200명</option>
                      </select>
                    </button>
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
              <strong className="b txt-secondary">{total}</strong>{" "}
              <span className="txt-grey600">건</span>
            </div>
          </div>

          <div className="gap-s">
            <Buttons className="outlined small" onClick={openReportWindow}>
              <div className="flex gap">
                Report
                <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
              </div>
            </Buttons>
            <ExcelTest page="학사보고서" header={ExcelHeader} excelData={excelData}>
            </ExcelTest>
            {/* <Buttons className="outlined small">
              <div className="flex gap">
                EXCEL
                <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
              </div>
            </Buttons> */}
          </div>
        </div>
        <div className="ui-list-table sp-mt-10">
          <table>
            <colgroup>
              <col />
              <col style={{ width: 150 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 80 }} />
              <col style={{ width: 220 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 70 }} />
              <col style={{ width: 600 }} />
              <col style={{ width: 70 }} />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th onClick={() => sortHeader("date")}>수강시간</th>
                <th>강사</th>
                <th onClick={() => sortHeader("name")}>회원명</th>
                <th onClick={() => sortHeader("courseName")}>
                  과정 <br /> (콘텐츠)
                </th>
                <th onClick={() => sortHeader("lessonCount")}>
                  수강회차 <br /> (잔여횟수)
                </th>
                <th>출결정보</th>
                <th>학사보고서내용</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {academicReportList?.map((item) => {
                return (
                  <AcademicReportItem
                    key={item.id}
                    data={item}
                    selectAcademicReport={selectAcademicReport}
                  />
                );
              })}
            </tbody>
          </table>

          <PageNations key={paginationData.startPage} data={paginationData} />
        </div>
      </div>
    </section>
  );
};

const AcademicReportItem = ({ data, selectAcademicReport }) => {
  return (
    <Fragment>
      {/* active 필요시 tr에 active-depp 클래스 추가  */}
      {/*<tr className={i === 0 ? "active-depp" : ""}>*/}
      <tr>
        {/* <td className="empty" colSpan={10}>
                          정보가 없습니다.
                        </td> */}

        <td>{data?.id}</td>
        <td>
          <p className="txt-grey500">{data?.date}</p>
          <p>{`${data?.startTime} ~ ${data?.endTime}`}</p>
        </td>
        <td>{data?.teacherName}</td>
        <td>{data?.userName}</td>
        <td>{`${data?.courseName}/${data?.lessonCount}.0회`}</td>
        <td>
          {`${data?.assignmentCount}회/${data?.lessonCount}.0회`}
          <br />
          {`(${data?.lessonCount - data?.assignmentCount}회)`}
        </td>
        <td className={
          data?.attendanceStatus === 'R' ? 'txt-green-light'
          : data?.attendanceStatus === 'Y' ? 'txt-secondary' 
          : data?.attendanceStatus === 'N' ? 'txt-error'
          : ''
        }>
          {AttendanceStatus.find((item) => item.id === data?.attendanceStatus).title}
        </td>
        <td className="text-left">
          {/* 
                            ui-ellipsis : 한 줄 말줄임
                            ui-ellipsis2 : 두 줄 말줄임
                          */}
          <div className="ui-ellipsis2">
            {data?.todayLesson && <span>1.{data.todayLesson}</span>} 
            {data?.report && <span>2.{data.report}</span>} 
            {data?.nextLesson && <span>3.{data.nextLesson}</span>}
          </div>
          { (data?.todayLesson || data?.report || data?.nextLesson) && (
            <div className="ui-tooltip">
                <div className="row">
                  {data?.todayLesson && <><span>1.{data.todayLesson}</span><br /> </>}
                  {data?.report && <><span>2.{data.report}</span><br /></>} 
                  {data?.nextLesson && <span>3.{data.nextLesson}</span>}
                </div>
            </div>
          )}
        </td>
        <td>
          {data?.report || data?.todayLesson || data?.nextLesson ? (
            <Buttons
              onClick={() => selectAcademicReport(data)}
              className="primary small"
            >
              수정
            </Buttons>
          ) : (
            <Buttons onClick={() => selectAcademicReport(data)} className="input-init active small" style={{color: 'white'}}>
              등록
            </Buttons>
          )}
        </td>
      </tr>
    </Fragment>
  );
};

export default AcademicReportManagementContents;
