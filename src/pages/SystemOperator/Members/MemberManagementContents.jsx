import { TeacherType } from "@/app/api/common";
import useEmailWindow from "@/app/helper/windows-hooks/use-email-window";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";
import ServiceMember from "@/app/service/service-members";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";
import { NavLink } from "react-router-dom";
import Split from "react-split";
import MemberDetailTabs from "./MemberDetailTabs/MemberDetailTabs";
import MemberForm from "./common/MemberForm";
import MemberManagementProvider from "./context/MemberManagementProvider";

import ExcelTest from "@/pages/SystemOperator/Members/ExcelTest";
import useMemberRegistWindow from "@/app/helper/windows-hooks/use-member-regist-window";

const ExcelHeader = [
  "No", "아이디", "이메일", "이름", "영문이름", "회원상태", "소속", "하위소속",
  "성별", "생년월일", "양력여부", "유선전화", "휴대전화", "SMS수신여부", "이메일수신여부",
  "우편번호", "주소1", "주소2", "직장인여부", "직장/학교", "직책/학과", "가입경로",
  "학습희망언어", "기타희망언어", "외국어실력", "마지막접속일", "접속아이피", "등록일", "상태"
]

// 회원관리(1depth) > 회원관리(2depth)
const MemberManagementContents = () => {
  const { openEmailWindow } = useEmailWindow();
  const { openSmsWindow } = useSmsWindow();

  const [isExpanded, setExpanded] = useState(true);
  // 검색 조건 (form)
  const paginationData = usePagination();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [registered, setRegistered] = useState("ALL");
  const [Active, setActive] = useState("ALL");
  const [search, setSearch] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [courseStatus, setCourseStatus] = useState("ALL");
  const [remainingType, setRemainingType] = useState("ALL");
  const [expireType, setExpireType] = useState("ALL");
  // 표시 데이터
  const [totalCount, setTotalCount] = useState(0);
  const [memberList, setMemberList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  // 사용자 클릭 동작을 위한 데이터
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [selectedMemberList, setSelectedMemberList] = useState([]);
  const [clickedMember, setClickedMember] = useState(null);
  const [initialDetailTabsLabel, setInitialDetailTabsLabel] = useState(null);
  const [sortTarget, setSortTarget] = useState();
  const [direction, setDirection] = useState(false);
  const [excelData, setExcelData] = useState();

  const { getCollapseProps } = useCollapse({ isExpanded });

  const { 
    setNewState,
    isClose,
  } = useMemberRegistWindow();

  const onChangeDetailTabsLabel = (tab) => {
    setInitialDetailTabsLabel(tab);
  };

  // 검색 조건 request data 만들기
  const makeSearchCondition = useCallback(() => {
    return {
      page: paginationData.page,
      limit: paginationData.limit,
      createDateFrom: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
      createDateTo: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
      registerType: registered,
      status: Active,
      search,
      keyword,
      teacherId,
      courseStatus,
      remainingType,
      expireType,
      type: "S",
    };
  }, [
    Active,
    courseStatus,
    endDate,
    keyword,
    paginationData.limit,
    paginationData.page,
    registered,
    search,
    startDate,
    teacherId,
    remainingType,
    expireType,
  ]);

  // API 호출
  const searchMemberList = useCallback(async () => {
    const saveData = makeSearchCondition();
    const data = await ServiceMember.getList(saveData);
    setTotalCount(data.totalCount); // totalCount 표시용
    paginationData.setTotalPage(data.totalPage); // pagination 계산용

    const res = await ServiceMember.getExcel(saveData);
    setExcelData(res);
    setMemberList(data.list); // 회원 목록 표시용
  }, [makeSearchCondition, paginationData]);

  //담당멘토 호출
  const getTeacherList = useCallback(async () => {
    const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
    setTeacherList(res.teachers);
  }, []);

  // 캘린더 버튼 클릭 기능들
  const onClickCalendarClearBtn = () => {
    setStartDate(null);
    setEndDate(null);
    setRegistered("ALL");
    setActive("ALL");
    setSearch("ALL");
    setKeyword("");
    setTeacherId("");
    setCourseStatus("ALL");
  };
  const onClickCalendarThisMonthBtn = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  };
  const onClickCalendarPrevMonthBtn = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
  };
  const onClickCalendarThisYearBtn = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), 0, 1));
    setEndDate(new Date(now.getFullYear(), 11, 31));
  };

  // 검색 버튼 클릭
  const onClickSearchBtn = () => {
    searchMemberList();
  };

  // 회원 체크박스 클릭 기능
  const onClickMemberCheckbox = (evt, member) => {
    if (evt.target.checked) {
      setSelectedMemberList(selectedMemberList.concat([member]));
    } else {
      setSelectedMemberList(selectedMemberList.filter((m) => m !== member));
    }
  };

  // 회원 이름 클릭 기능 -> 회원 상세정보 표시
  const onClickMemberName = (member) => {
    setInitialDetailTabsLabel(initialDetailTabsLabel);
    setClickedMember(member);
  };

  // 정렬기능
  const onClickSort = async(target) => {
    if (sortTarget === target) {
      setDirection(!direction)
    } else {
      setSortTarget(target);
    }

    const saveData = {
      ...makeSearchCondition(),
      order: sortTarget,
      direction: direction===true? "ASC" : "DESC",
    }
    const data = await ServiceMember.getList(saveData);
    setTotalCount(data?.totalCount); // totalCount 표시용
    paginationData.setTotalPage(data?.totalPage); // pagination 계산용
    setMemberList(data?.list); // 회원 목록 표시용
  };

  // excel 버튼 클릭 기능
  const onClickExcelBtn = async () => {
    
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onClickSearchBtn();
    }
  }

  useEffect(() => {
    searchMemberList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationData.page,
    paginationData.limit,
    startDate,
    endDate,
    registered,
    Active,
    courseStatus,
    teacherId,
    remainingType,
    expireType,
  ]);

  // 회원 체크박스 선택 기능
  // 전체 선택 체크박스 클릭 기능
  useEffect(() => {
    if (isSelectedAll) {
      setSelectedMemberList([...memberList]);
    } else {
      setSelectedMemberList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectedAll, setSelectedMemberList]);

  useEffect(() => {
    getTeacherList();
  }, [getTeacherList]);

  useEffect(() => {
    if (isClose) {
      setNewState(false);
    }
  }, [isClose, setNewState])

  return (
    <Split className="lib-split" sizes={[54, 46]} key={clickedMember?.id}>
      <section className="ui-contents-wrap contents-member-management">
        <div className="ui-contents-inner">
          <div className="ui-location-wrap">
            <div className="ui-location-title">회원관리</div>
            <div className="ui-location">
              <NavLink>
                <i className="fa-solid fa-house"></i>
              </NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>회원관리</strong>
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
                <col style={{ width: "14%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "14%" }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>가입일자</th>
                  <td colSpan="3">
                    <div className="flexYCenter gap">
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
                        <div>~</div>
                        <div>
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectStart
                            startDate={startDate}
                            endDate={endDate}
                          ></DatePicker>
                        </div>
                      </div>

                      <Buttons
                        className="ui-button outlined xsmall"
                        onClick={onClickCalendarClearBtn}
                      >
                        Clear
                      </Buttons>
                      <Buttons
                        className="ui-button outlined xsmall"
                        onClick={onClickCalendarThisMonthBtn}
                      >
                        당월
                      </Buttons>
                      <Buttons
                        className="ui-button outlined xsmall"
                        onClick={onClickCalendarPrevMonthBtn}
                      >
                        전월
                      </Buttons>
                      <Buttons
                        className="ui-button outlined xsmall"
                        onClick={onClickCalendarThisYearBtn}
                      >
                        금년
                      </Buttons>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>등록구분</th>
                  <td>
                    <button className="ui-select active mid">
                      <select
                        className="input-init"
                        value={registered}
                        onChange={(e) => setRegistered(e.target.value)}
                      >
                        <option value="ALL" className={registered === "ALL" ? "active" : ""}>
                          - 전체 -
                        </option>
                        <option
                          value={"REGISTERED"}
                          className={registered === "REGISTERED" ? "active" : ""}
                        >
                          등록회원
                        </option>
                        <option
                          value={"UNREGISTERED"}
                          className={registered === "UNREGISTERED" ? "active" : ""}
                        >
                          미 등록회원
                        </option>
                      </select>
                    </button>
                  </td>
                  <th>상태</th>
                  <td>
                    <button className="ui-select mid">
                      <select
                        className="input-init"
                        value={Active}
                        onChange={(e) => setActive(e.target.value)}
                      >
                        <option value="">- 선택 -</option>
                        <option value={"ALL"}>전체</option>
                        <option value={"ACTIVE"}>활동</option>
                        <option value={"INACTIVE"}>비활동</option>
                      </select>
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>잔여구분</th>
                  <td>
                    <div className="ui-radio-group size-small">
                      {[
                        { key: "ALL", title: "전체" },
                        { key: "REMAINING", title: "잔여있음" },
                        { key: "NOT_REMAINING", title: "잔여없음" },
                      ].map((el, i) => {
                        return (
                          <div key={i}>
                            <input
                              type="radio"
                              id={`${el.key}-${i}`}
                              name="type0"
                              checked={el.key === remainingType}
                              onChange={() => setRemainingType(el.key)}
                            />
                            <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <th>만료구분</th>
                  <td>
                    <div className="ui-radio-group size-small">
                      {[
                        { key: "ALL", title: "전체" },
                        { key: "EXPIRED", title: "만료" },
                        { key: "NOT_EXPIRED", title: "만료안됨" },
                      ].map((el, i) => {
                        return (
                          <div key={i}>
                            <input
                              type="radio"
                              id={`${el.key}-${i}`}
                              name="EXPIRED"
                              checked={el.key === expireType}
                              onChange={() => setExpireType(el.key)}
                            />
                            <label htmlFor={`expired-${el.key}-${i}`}>{el.title}</label>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>담당강사</th>
                  <td>
                    <button className="ui-select mid">
                      <select
                        className="input-init"
                        onChange={({ target: { value } }) => setTeacherId(value)}
                      >
                        <option value={""}>- 전체 -</option>
                        {teacherList?.map((teacher) => (
                          <option key={teacher.value} value={teacher.value}>
                            {teacher.label}
                          </option>
                        ))}
                      </select>
                    </button>
                  </td>
                  <th>수강상태</th>
                  <td>
                    <button className="ui-select mid">
                      <select
                        className="input-init"
                        onChange={({ target: { value } }) => setCourseStatus(value)}
                      >
                        <option value={"ALL"}>- 전체 -</option>
                        <option value={"ATTENDING"}>수강중</option>
                        <option value={"NOT_ATTENDING"}>비수강중</option>
                        <option value={"WAITING"}>대기중</option>
                      </select>
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>회원 수</th>
                  <td>
                    <button className="ui-select mid">
                      <select
                        className="input-init"
                        value={paginationData.limit}
                        onChange={(e) => {
                          paginationData.setLimit(e.target.value);
                        }}
                      >
                        <option value={20}>20명</option>
                        <option value={40}>40명</option>
                        <option value={100}>100명</option>
                      </select>
                    </button>
                  </td>
                  <th>검색</th>
                  <td>
                    <div className="flexYCenter gap">
                      <button className="ui-select mid">
                        <select
                          className="input-init"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        >
                          <option value="ALL">- 전체 -</option>
                          <option value="name">이름</option>
                          <option value="loginId">아이디</option>
                          <option value="email">이메일</option>
                          <option value="cellPhone">휴대전화번호</option>
                        </select>
                      </button>
                      <input
                        type="text"
                        className="input-init"
                        placeholder="검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={onKeyPress}
                        style={{ maxWidth: 130 }}
                      />
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
                <strong className="b txt-secondary">{totalCount}</strong>{" "}
                <span className="txt-grey600">건</span>
              </div>
            </div>

            <div className="gap-s">
              <Buttons
                className="outlined small"
                onClick={() => openEmailWindow(selectedMemberList)}
              >
                메일발송
              </Buttons>
              <Buttons className="outlined small" onClick={() => openSmsWindow(selectedMemberList)}>
                SMS발송
              </Buttons>
              {/* <Buttons className="outlined small" onClick={onClickExcelBtn}>
                <div className="flex gap">
                  EXCEL
                  <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
                </div>
              </Buttons> */}
              <ExcelTest page="회원" header={ExcelHeader} excelData={excelData}/>
              <Buttons className="outlined small" onClick={() => setClickedMember(null)}>
                회원등록
              </Buttons>
            </div>
          </div>

          <div className="ui-list-table sp-mt-10">
            <table>
              <colgroup>
                <col style={{ width: 60 }} />
              </colgroup>
              <thead>
                <tr className="sorting">
                  <th>No.</th>
                  <th onClick={() => onClickSort(`name`)}>
                    <div className="flexCenter gap" >
                      이름
                      <i className="fa-solid fa-caret-up txt-error"></i>
                      {/* <i className="fa-solid fa-caret-down txt-error"></i> */}
                    </div>
                  </th>
                  <th>전화번호</th>
                  <th onClick={() => onClickSort(`email`)}>이메일</th>
                  <th onClick={() => onClickSort(`endDate`)}>수강 만료일</th>
                  <th onClick={() => onClickSort(`remainCount`)}>잔여</th>
                  <th>
                    <input
                      type="checkbox"
                      checked={isSelectedAll}
                      onChange={(e) => setIsSelectedAll(e.target.checked)}
                    />
                  </th>
                </tr>
              </thead>

              <tbody>
                {memberList?.map((member, i) => {
                  return (
                    <tr key={i} className={`${clickedMember?.id === member?.id ? "active" : ""}`}>
                      <td>{member.listNumber}</td>
                      <td>
                        <Buttons
                          className="ui-link secondary-high small"
                          onClick={() => onClickMemberName(member)}
                        >
                          {member.name}
                        </Buttons>
                        <br />
                        <span>{member.createDate}</span>
                      </td>
                      <td>
                        <Buttons
                          className="ui-link secondary-high small"
                          onClick={() => openSmsWindow([member])}
                        >
                          <div
                            className="ui-ellipsis"
                            style={{ maxWidth: 80 }}
                            title={member.cellPhone}
                          >
                            {member.cellPhone}
                          </div>
                        </Buttons>
                      </td>
                      <td>
                        <Buttons
                          className="ui-link secondary-high small"
                          onClick={() => openEmailWindow([member])}
                        >
                          {member.email}
                        </Buttons>
                        <br />
                        <span>{member.company}</span>
                      </td>

                      <td>{member?.expirationDate}</td>
                      <td>{member?.remainingCount}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedMemberList.includes(member)}
                          onChange={(e) => onClickMemberCheckbox(e, member)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <PageNations key={paginationData.startPage} data={paginationData} />
          </div>
        </div>
      </section>
      <MemberManagementProvider
        refreshMemberList={searchMemberList}
        onDeletedMember={() => setClickedMember(null)}
      >
        {clickedMember === null ? (
          <div className="ui-contents-wrap inner-shadow">
            <div className="ui-contents-inner">
              <div className="layout-contents-width">
                <MemberForm />
              </div>
            </div>
          </div>
        ) : (
          <MemberDetailTabs
            member={clickedMember}
            initialLabel={initialDetailTabsLabel}
            onChangeDetailTabsLabel={onChangeDetailTabsLabel}
          />
        )}
      </MemberManagementProvider>
    </Split>
  );
};

export default MemberManagementContents;
