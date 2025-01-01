import useEmailWindow from "@/app/helper/windows-hooks/use-email-window";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";
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
import TeacherDetailTabs from "./TeacherDetailTabs/TeacherDetailTabs";
import TeacherNonUserDetailTabs from "./TeacherDetailTabs/TeacherNonUserDetailTabs";

// 강사관리(1depth) > 강사관리(2depth)
const TeacherManagementContents = () => {
  const [isExpanded, setExpanded] = useState(true);
  const { getCollapseProps } = useCollapse({ isExpanded });

  // 검색 조건 (form)
  const paginationData = usePagination();
  const [totalCount, setTotalCount] = useState(0);
  const [dataList, setDataList] = useState(null);
  const [searchData, setSearchData] = useState({
    active: true,
    type: "",
    search: "ALL"
  });
  const [selectedData, setSelectedData] = useState(null);
  const [selectedMemberList, setSelectedMemberList] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const onChangeSearchData = (data) => {
    setSearchData((prev) => ({ ...prev, ...data }));
  };

  const onSearchClick = async () => {
    try {
      const res = await ServiceTeacher.getTeachers({
        ...searchData,
        page: paginationData.page,
      });
      setTotalCount(res.totalCount); // totalCount 표시용
      paginationData.setTotalPage(res.totalPage); // pagination 계산용
      setDataList(res.list); // 회원 목록 표시용
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSelected = (data) => {
    setSelectedData(data);
  };

  const handleSortChange = (newValue, item) => {
      // item의 정렬값을 변경
      const updatedDataList = dataList.map((data) =>
        data === item ? { ...data, sort: newValue } : data
      );
      setDataList(updatedDataList);

    }
    
  const handleSortBlur = async (item) => {
      const saveData = {
        userId: item.userId,
        sort: item.sort
      }

      await ServiceTeacher.teacherSort(saveData)
      getTeachers();
  }

  const onClickTeacherCheckbox = (evt, member) => {
    if (evt.target.checked) {
      setSelectedMemberList(selectedMemberList.concat([member]));
    } else {
      setSelectedMemberList(selectedMemberList.filter((m) => m !== member));
    }
  };

  const getTeachers = useCallback(async () => {
    try {
      const saveData = {
        ...searchData,
        limit: 40,
        page: paginationData.page,
        contractDateFrom: dayjs(searchData?.contractDateFrom).format("YYYY-MM-DD"),
        contractDateTo: dayjs(searchData?.contractDateTo).format("YYYY-MM-DD"),
      };
      if (!searchData?.contractDateFrom) {
        delete saveData.contractDateFrom;
      }
      if (!searchData?.contractDateTo) {
        delete saveData.contractDateTo;
      }

      const res = await ServiceTeacher.getTeachers(saveData);

      setTotalCount(res.totalCount); // totalCount 표시용
      paginationData.setTotalPage(res.totalPage); // pagination 계산용
      setDataList(res.list); // 회원 목록 표시용
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationData.page,
    searchData?.contractDateFrom,
    searchData?.contractDateTo,
    searchData?.active,
    searchData?.type,
  ]);

  useEffect(() => {
    getTeachers();
  }, [getTeachers]);

  useEffect(() => {
    if (isSelectedAll) {
      setSelectedMemberList(dataList);
    } else {
      setSelectedMemberList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectedAll, setSelectedMemberList]);

  return (
    <TeacherDetailContentsList
      dataList={dataList}
      searchData={searchData}
      paginationData={paginationData}
      totalCount={totalCount}
      isExpanded={isExpanded}
      selectedData={selectedData}
      isSelectedAll={isSelectedAll}
      selectedMemberList={selectedMemberList}
      setIsSelectedAll={setIsSelectedAll}
      setExpanded={setExpanded}
      getCollapseProps={getCollapseProps}
      onChangeSearchData={onChangeSearchData}
      onSearchClick={onSearchClick}
      onSelected={onSelected}
      getTeachers={getTeachers}
      onClickTeacherCheckbox={onClickTeacherCheckbox}
      handleSortChange={handleSortChange}
      handleSortBlur={handleSortBlur}
    />
  );
};

const TeacherDetailContentsList = ({
  dataList,
  searchData,
  paginationData,
  totalCount,
  isExpanded,
  selectedData,
  isSelectedAll,
  setExpanded,
  selectedMemberList,
  getCollapseProps,
  onChangeSearchData,
  onSearchClick,
  onSelected,
  getTeachers,
  onClickTeacherCheckbox,
  setIsSelectedAll,
  handleSortChange,
  handleSortBlur,
}) => {
  const { openEmailWindow } = useEmailWindow();
  const onClickSendEmail = () => {
    const saveData = selectedMemberList.map((item) => ({
      name: item.teacherName,
      email: item.email,
    }));
    openEmailWindow(saveData);
  };
  const { openSmsWindow } = useSmsWindow();
  const onClickSendSms = () => {
    const saveData = selectedMemberList.map((item) => ({
      name: item.teacherName,
      phone: item.cellPhone,
    }));
    openSmsWindow(saveData);
  };

  return (
    <Split className="lib-split" sizes={[42, 58]}>
      <section className="ui-contents-wrap contents-member-management">
        <div className="ui-contents-inner">
          <div className="ui-location-wrap">
            <div className="ui-location-title">강사관리</div>
            <div className="ui-location">
              <NavLink>
                <i className="fa-solid fa-house"></i>
              </NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>강사관리</strong>
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
                <col />
                <col style={{ width: "14%" }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>계약기간</th>
                  <td colSpan="3">
                    <div className="flexYCenter gap">
                      <div className="ui-datepicker-wrap">
                        <div>
                          <DatePicker
                            selected={searchData?.contractDateFrom}
                            onChange={(date) => onChangeSearchData({ contractDateFrom: date })}
                            selectStart
                            startDate={searchData?.contractDateFrom}
                            endDate={searchData?.contractDateTo}
                          />
                        </div>
                        <div className="txt-grey500">~</div>
                        <div>
                          <DatePicker
                            selected={searchData?.contractDateTo}
                            onChange={(date) => onChangeSearchData({ contractDateTo: date })}
                            selectStart
                            startDate={searchData?.contractDateFrom}
                            endDate={searchData?.contractDateTo}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>상태</th>
                  <td>
                    <button className="ui-select">
                      <select
                        className="input-init"
                        value={searchData?.active}
                        onChange={({ target: { value } }) => onChangeSearchData({ active: value })}
                      >
                        <option value={true}>활동</option>
                        <option value={false}>비활동</option>
                      </select>
                    </button>
                  </td>
                  <th>구분</th>
                  <td>
                    <div className="ui-radio-group size-small gap">
                      {["전체", "HT", "LT"].map((el, i) => {
                        return (
                          <div key={i}>
                            <input
                              type="radio"
                              id={`${el}-${i}`}
                              name="part"
                              checked={
                                searchData?.type === "" ? "전체" === el : searchData?.type === el
                              }
                              onChange={() => onChangeSearchData({ type: el === "전체" ? "" : el })}
                              // onClick={}
                            />
                            <label htmlFor={`${el}-${i}`}>{el}</label>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>검색</th>
                  <td colSpan="3">
                    <div className="flexYCenter gap">
                      <button className="ui-select">
                        <select
                          className="input-init"
                          onChange={({ target: { value } }) =>
                            onChangeSearchData({ search: value })
                          }
                          value={searchData?.search}
                        >
                          <option value="ALL">-전체-</option>
                          <option value="name">이름</option>
                          <option value="loginId">아이디</option>
                          <option value="email">이메일</option>
                        </select>
                      </button>
                      <input
                        type="text"
                        className="input-init"
                        placeholder="검색"
                        value={searchData?.keyword}
                        onChange={({ target: { value } }) => onChangeSearchData({ keyword: value })}
                      />
                      <Buttons className="outlined xsmall" onClick={onSearchClick}>
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
              <Buttons className="outlined small" onClick={onClickSendEmail}>
                메일발송
              </Buttons>
              <Buttons className="outlined small" onClick={onClickSendSms}>
                SMS발송
              </Buttons>
              <Buttons className="outlined small" onClick={() => onSelected(null)}>
                강사등록
              </Buttons>
            </div>
          </div>

          <div className="ui-list-table sp-mt-10">
            <table>
              <colgroup>
                <col style={{ width: 60 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>구분</th>
                  <th>이름</th>
                  <th>이메일 / 휴대전화번호</th>
                  <th>근무시간</th>
                  <th>순서</th>
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
                {dataList?.map((item) => (
                  <tr key={item.userId}>
                    <td>{item.listNumber}</td>
                    <td>{item.type}</td>
                    <td>
                      <Buttons className="ui-link secondary-high" onClick={() => onSelected(item)}>
                        {item.teacherName}
                      </Buttons>
                    </td>
                    <td>
                      <Buttons className="ui-link secondary-high">
                        <div className="flexYCenter gap">
                          <div>{item.email}</div>
                          <div>/</div>
                          <div className="ui-ellipsis" style={{ maxWidth: 80 }}>
                            {item.cellPhone}
                          </div>
                        </div>
                      </Buttons>
                    </td>
                    <td>{item.workTime}</td>
                    <td>
                      <input
                        type="number"
                        className="input-init"
                        style={{ width: 40 }}
                        value={item.sort}
                        onChange={(e) => handleSortChange(e.target.value, item)}
                        onBlur={(e) => handleSortBlur(item)}  // api 구현 필요
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMemberList.includes(item)}
                        onChange={(e) => onClickTeacherCheckbox(e, item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PageNations key={paginationData.startPage} data={paginationData} />
          </div>
        </div>
      </section>

      <div className="ui-contents-wrap inner-shadow">
        <div className="ui-contents-inner">
          <div className="layout-contents-width">
            {selectedData ? (
              <TeacherDetailTabs selectedData={selectedData} getTeachers={getTeachers} />
            ) : (
              <TeacherNonUserDetailTabs getTeachers={getTeachers} />
            )}
          </div>
        </div>
      </div>
    </Split>
  );
};

export default TeacherManagementContents;
