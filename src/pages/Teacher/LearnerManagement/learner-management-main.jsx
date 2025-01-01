import Buttons from "@/components/Buttons";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";
import { NavLink } from "react-router-dom";
import Split from "react-split";
import LearnerManagementDetailTabs from "./LearnerManagementDetailTabs/LearnerManagementDetailTabs";
import ServiceTeacher from "@/app/service/service-teacher";
import { TeacherType } from "@/app/api/common";
import MemberManagementProvider from "@/pages/SystemOperator/Members/context/MemberManagementProvider";
import MemberForm from "@/pages/SystemOperator/Members/common/MemberForm";
import useEmailWindow from "@/app/helper/windows-hooks/use-email-window";
import ServiceMember from "@/app/service/service-members";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";

const LearnerManagementMain = () => {
  const [isExpanded, setExpanded] = useState(true);
  const { getCollapseProps } = useCollapse({ isExpanded });
  const [teacherList, setTeacherList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedValue, setSelectedValue] = useState('true');
  const [totalCount, setTotalCount] = useState(0);
  const [clickedMember, setClickedMember] = useState(null);
  const [initialDetailTabsLabel, setInitialDetailTabsLabel] = useState(null);
  const [selectedMemberList, setSelectedMemberList] = useState([]);
  const { openEmailWindow } = useEmailWindow();
  const [sendMemberList, setSendMemberList] = useState([]);
  const { openSmsWindow } = useSmsWindow();

  // 검색 조건 (form)
  const paginationData = usePagination();

  const [searchData, setSearchData] = useState({
    today: selectedValue,
    search: 'ALL',
    keyword: '',
  })

  // 회원 체크박스 클릭 기능
  const onClickMemberCheckbox = (evt, member) => {
    if (evt.target.checked) {
      setSelectedMemberList((prevSelectedMemberList) => [...prevSelectedMemberList, member]);
    } else {
      setSelectedMemberList((prevSelectedMemberList) => prevSelectedMemberList.filter((m) => m.id !== member.id));
    }
  };

  const clickSendSMS = async (sendList) => {
    if (sendList) {
      try {
        const memberInfoList = await Promise.all(
          sendList.map(async (item) => {
            const data = await ServiceMember.get(item.id);
            return data;
          })
        );

        openSmsWindow(memberInfoList)
      } catch (error) {
        console.error(error);
      }
    }
  }

  const onChangeSearchData = (data) => {
    setSearchData((prev) => ({ ...prev, ...data }));
  };

  // 담당강사 호출
  const getTeacherList = useCallback(async () => {
    const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
    setTeacherList(res.teachers);
  }, []);

  // 회원목록
  const getUserList = useCallback(async() => {
    const updatedSearchData = {
      ...searchData,
      page: paginationData.page,
      limit: paginationData.limit,
    };

    const res = await ServiceTeacher.getUserList(updatedSearchData);
    setTotalCount(res.totalCount);
    paginationData.setTotalPage(res.totalPage);
    setUserList(res.list);
  }, [
    searchData.today, 
    searchData.teacherId, 
    searchData.search, 
    searchData.keyword, 
    paginationData.page,
  ]);

  const onClickSearchBtn = async () => {
    await getUserList();
  }

  const onClickUserName = (user) => {
    setInitialDetailTabsLabel(initialDetailTabsLabel);
    setClickedMember(user);

    console.log("initial", initialDetailTabsLabel)
  }

  const onChangeDetailTabsLabel = (tab) => {
    setInitialDetailTabsLabel(tab);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onClickSearchBtn();
    }
  }

  const formatHP = (value) => {
    const cleaned = value.replace(/\D/g, '');

    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);

    if (match) {
      const groups = match.slice(1);
      return `${groups[0]}${groups[1] ? '-' + groups[1] : ''}${groups[2] ? '-' + groups[2] : ''}`;
    }

    return value;
  }

  const handleChangeHP = (e) => {
    const value = e.target.value;
    const formattedValue = formatHP(value);
    setCellPhone(formattedValue);
  }

  useEffect(() => {
    getTeacherList();
  }, [getTeacherList]);

  useEffect(() => {
    getUserList();
  }, [
    searchData.today, 
    searchData.teacherId, 
    paginationData.page, 
  ]);

  return (
    <Split className="lib-split" sizes={[42, 58]} key={clickedMember?.id}>
      <section className="ui-contents-wrap contents-member-management">
        <div className="ui-contents-inner">
          <div className="ui-location-wrap">
            <div className="ui-location-title">
              <div className="flexYCenter">
                회원관리 <small className="size-bodyS txt-grey600">(Learner management)</small>
              </div>
            </div>
            <div className="ui-location">
              <NavLink>
                <i className="fa-solid fa-house"></i>
              </NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>Learner management</strong>
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
              </colgroup>
              <tbody>
                <tr>
                  <th>학생(Student)</th>
                  <td>
                    <div className="ui-radio-group size-small gap">
                      {["전체(All)", "오늘예약(Today reservation)"].map((el, i) => {
                        const value = i === 1 ? 'true' : 'false';
                        const isChecked = selectedValue === value;
                        return (
                          <div key={i}>
                            <input 
                              type="radio" 
                              id={`${el}-${i}`} 
                              name="part"
                              value={value}
                              checked={isChecked}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSelectedValue(newValue);
                                onChangeSearchData({ today: newValue });
                              }}
                            />
                            <label htmlFor={`${el}-${i}`}>{el}</label>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>강사(Teacher)</th>
                  <td>
                    <button className="ui-select" style={{ width: 180 }}>
                      <select
                        className="input-init"
                        onChange={({ target: { value } }) => onChangeSearchData({teacherId: value})}
                      >
                        <option value="">-선택(Select)-</option>

                        {teacherList?.map((teacher) => (
                          <option key={teacher.value} value={teacher.value}>
                            {teacher.label}
                          </option>
                        ))}
                      </select>
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>검색(Search)</th>
                  <td>
                    <div className="flexYCenter gap">
                      <button className="ui-select" style={{ width: 180 }}>
                        <select 
                          className="input-init"
                          onChange={({ target: {value} }) => onChangeSearchData({search: value})}
                        >
                          <option value="ALL">-전체(All)-</option>
                          <option value="name">이름(Name)</option>
                          <option value="email">이메일(Email)</option>
                          <option value="company">회사/직장명(Company)</option>
                          <option value="cellPhone">전화번호(Tel.)</option>
                        </select>
                      </button>
                      <input 
                        type="text" 
                        className="input-init" 
                        placeholder="검색" 
                        value={searchData?.search === "cellPhone" ? formatHP(searchData?.keyword) : searchData?.keyword}
                        onChange={({ target: { value } }) => onChangeSearchData({ keyword: value })}
                        onKeyPress={onKeyPress}
                        maxLength={searchData?.search === "cellPhone" ? 13 : undefined}
                      />
                      <Buttons className="outlined xsmall" onClick={onClickSearchBtn}>
                        <span className="flexYCenter gap">
                          <i className="fa-solid fa-magnifying-glass"></i>
                          Search
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
                Send Mail
              </Buttons>
              <Buttons 
                className="outlined small"
                onClick={() => clickSendSMS(selectedMemberList)}
              >
                Send SMS
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
                  <th>이름(Name)</th>
                  <th>교재(Textbook)</th>
                  <th>강사(Teacher)</th>
                  <th>
                    <input type="checkbox" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {userList?.map((user, i) => {
                  return (
                  <tr>
                    <td>{totalCount - (paginationData.page- 1) * paginationData.limit - i}</td>
                    <td>
                      <Buttons 
                        className="ui-link secondary-high"
                        onClick={() => onClickUserName(user)}
                      >
                        {user.name}
                      </Buttons>
                    </td>
                    <td>{user.textbook}</td>
                    <td>{user.teacherName}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedMemberList.some((m) => m.id === user.id)}
                        onChange={(e) => onClickMemberCheckbox(e, user)}
                      />
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
            <PageNations key={paginationData.startPage} data={paginationData} />
          </div>
        </div>
      </section>
      <MemberManagementProvider
        refreshMemberList={getUserList}
        onDeletedMember={() => setClickedMember(null)}
      >
        {clickedMember === null ? (
          <div className="ui-contents-wrap inner-shadow">
            <div className="ui-contents-inner">
              <div className="layout-contents-width">
              </div>
            </div>
          </div>
        ) : (
          <LearnerManagementDetailTabs 
            member={clickedMember}
            onChangeDetailTabsLabel={onChangeDetailTabsLabel}
          />
        )}
      </MemberManagementProvider>
    </Split>
  );
};

export default LearnerManagementMain;
