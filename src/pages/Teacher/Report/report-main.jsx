import { Fragment, useCallback, useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";
import { NavLink } from "react-router-dom";
import AcademicReportDetailForm from "@/pages/SystemOperator/Members/AcademicReportDetail/AcademicReportDetailForm";

import { TeacherType } from "@/app/api/common";
import useReportWindow from "@/app/helper/windows-hooks/use-report-window";
import ServiceReport from "@/app/service/service-report";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";

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

// Report
const ReportMain = () => {
  const paginationData = usePagination();

  const [academicReportList, setAcademicReportList] = useState(null);
  const [selectedAcademicReport, setSelectedAcademicReport] = useState(null);
  // const [searchData, setSearchData] = useState(null);
  const [total, setTotal] = useState(0);
  const [teacherList, setTeacherList] = useState(null);

  // 검색조건 , 정렬순서 default
  const [searchData, setSearchData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    reportCondition: "ATTENDANCE",
    courseStatus: "TEACHER",
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
        courseStatus: searchData.courseStatus || "TEACHER",
        reportCondition: searchData.reportCondition || "ATTENDANCE",
        teacherId: searchData.teacherId || null,
        limit: searchData.limit || 20,
        page: paginationData.page,
      };
      const res = await ServiceReport.getReportList(saveData);
      setAcademicReportList(res.list);
      setTotal(res.totalCount);
      paginationData.setTotalPage(res.totalPage);
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationData.page,
    searchData.courseStatus,
    searchData.endDate,
    searchData.limit,
    searchData.reportCondition,
    searchData.startDate,
    searchData.teacherId,
    searchData.userName,
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
                    {SearchType?.map((item) => (
                      <div key={item.id}>
                        <input
                          type="radio"
                          id="search1_1"
                          name="search1_1"
                          checked={searchData?.reportCondition === item.id}
                          onChange={() => {
                            onChangeSearchData({ reportCondition: item.id });
                          }}
                        />
                        <label htmlFor="search1_1">{item.title}</label>
                      </div>
                    ))}
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
            <Buttons className="outlined small">
              <div className="flex gap">
                EXCEL
                <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
              </div>
            </Buttons>
          </div>
        </div>
        <div className="ui-list-table sp-mt-10">
          <table>
            <colgroup>
              <col style={{ width: 60 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 60 }} />
              <col style={{ width: 60 }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 70 }} />
              <col />
              <col style={{ width: 70 }} />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>수강시간</th>
                <th>강사</th>
                <th>회원명</th>
                <th>
                  과정 <br /> (콘텐츠)
                </th>
                <th>
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
        <td>{`${data?.courseName}`}</td>
        <td>
          {`${data?.assignmentCount}/${data?.lessonCount}`}
          <br />
          {`(${data?.lessonCount - data?.assignmentCount}회)`}
        </td>
        <td className="txt-secondary">
          {AttendanceStatus.find((item) => item.id === data?.attendanceStatus).title}
        </td>
        <td className="text-left">
          {/* 
                            ui-ellipsis : 한 줄 말줄임
                            ui-ellipsis2 : 두 줄 말줄임
                          */}
          <div className="ui-ellipsis2">{data?.report}</div>
        </td>
        <td>
          {data?.report ? (
            <Buttons
              onClick={() => selectAcademicReport(data)}
              className="primary xsmall"
            >
              수정
            </Buttons>
          ) : (
            <Buttons onClick={() => selectAcademicReport(data)} className="input-init active xsmall" style={{color: 'white'}}>
              등록
            </Buttons>
          )}
        </td>
      </tr>
    </Fragment>
  );
};

export default ReportMain;
