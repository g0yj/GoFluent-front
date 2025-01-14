import useSmsListWindow from "@/app/helper/windows-hooks/use-sms-list-window";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";
import ServiceCommon from "@/app/service/service-common";
import ServiceConsultations from "@/app/service/service-consultations";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCollapse } from "react-collapsed";
import ReactDatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import useMemberRegistWindow from "@/app/helper/windows-hooks/use-member-regist-window";
import MemberRegistModal from "@/pages/Modal/MemberRegistModal";
dayjs.extend(relativeTime);

dayjs.locale("ko");

const ConsultationsSearchType = [
  { title: "이름", key: "name" },
  { title: "전화번호 뒷번호 4자리", key: "phone" },
  { title: "상담내용", key: "details" },
];
const ConsultationsCallTime = [
  { title: "-선택-", key: "ALL" },
  { title: "06:30 ~ 08:00", key: "TIME_01" },
  { title: "08:00 ~ 10:00", key: "TIME_02" },
  { title: "10:00 ~ 12:00", key: "TIME_03" },
  { title: "12:00 ~ 14:00", key: "TIME_04" },
  { title: "14:00 ~ 16:00", key: "TIME_05" },
  { title: "16:00 ~ 18:00", key: "TIME_06" },
  { title: "18:00 ~ 20:00", key: "TIME_07" },
  { title: "20:00 ~ 21:00", key: "TIME_08" },
  { title: "기타", key: "TIME_09" },
];

// 회원관리(1depth) > 상담관리(2depth)
const ConsultManagementContents = () => {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  // 검색 조건 (form)
  const [searchData, setSearchData] = useState({
    createStartDate: "",
    createEndDate: "",
    visitStartDate: "",
    visitEndDate: "",
    status: "",
    type: "",
    search: "name",
  });
  const [dataList, setDataList] = useState(null);
  const [selectedMemberList, setSelectedMemberList] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [consultationsStatus, setConsultationsStatus] = useState([]);
  const [consultationsType, setConsultationsType] = useState();

  const paginationData = usePagination();
  const { openSmsWindow } = useSmsWindow();
  const { openSmsListWindow } = useSmsListWindow();
  const { getCollapseProps } = useCollapse({ isExpanded });

  const [sortTarget, setSortTarget] = useState("");
  const [directionTF, setDirectionTF] = useState(true);

  const onExpandedChange = () => {
    setExpanded((prev) => !prev);
  };
  const onSearchDataChange = (data) => {
    setSearchData((prev) => ({ ...prev, ...data }));
  };
  const openSmsModal = () => {
    if (selectedMemberList && selectedMemberList.length > 0) {
      openSmsWindow(selectedMemberList);
    } else {
      alert("선택된 회원이 없습니다.")
      return;
    }
  };
  const openSmsListModal = (smsList) => {
    openSmsListWindow(smsList);
  };

  const onSelected = (data) => {
    setSelectedData(data);
  };

  const onClickMemberCheckbox = (evt, member) => {
    if (evt.target.checked) {
      setSelectedMemberList(selectedMemberList.concat([member]));
    } else {
      setSelectedMemberList(selectedMemberList.filter((m) => m !== member));
    }
  };

  const sortHeader = (target) => {
    if(sortTarget === target && !directionTF) {
      setDirectionTF(true)
      setSearchData((prev) => ({...prev, order: target, direction: "DESC"}))
    } else {
      setDirectionTF(false)
      setSortTarget(target);
      setSearchData((prev) => ({...prev, order: target, direction: "ASC"}))
    }
  }

  const onSearch = async () => {
    try {
      const saveData = {
        createDateFrom: searchData?.createStartDate
          ? dayjs(searchData?.createStartDate).format("YYYY-MM-DD")
          : null,
        createDateTo: searchData?.createEndDate
          ? dayjs(searchData?.createEndDate).format("YYYY-MM-DD")
          : null,
        status: searchData?.status || null,
        search: searchData.search,
        keyword: searchData?.keyword || null,
        limit: searchData?.limit || "20",
      };
      console.log("onSearch ==>", saveData);
      const res = await ServiceConsultations.getConsultationList(saveData);

      paginationData.setTotalPage(res.totalPage);
      setTotalCount(res.totalCount);
      setDataList(res.list);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getConsultationList = useCallback(async () => {
    try {
      const saveData = {
        createDateFrom: searchData?.createStartDate
          ? dayjs(searchData?.createStartDate).format("YYYY-MM-DD")
          : null,
        createDateTo: searchData?.createEndDate
          ? dayjs(searchData?.createEndDate).format("YYYY-MM-DD")
          : null,
        status: searchData.status,
        search: searchData.search,
        order: searchData.order,
        direction: searchData.direction,
        page: paginationData.page,
        limit: searchData?.limit || "20",
      };
      console.log(saveData);
      const res = await ServiceConsultations.getConsultationList(saveData);
      console.log("getConsultationList ==>", res);
      paginationData.setTotalPage(res.totalPage);
      setTotalCount(res.totalCount);
      setDataList(res.list);
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationData.page,
    searchData?.createEndDate,
    searchData?.createStartDate,
    searchData?.status,
    searchData?.limit,
    searchData?.order,
    searchData?.direction,
  ]);

  const goBack = async () => {
    setSelectedData(null);
    await getConsultationList();
  };

  const getType = async () => {
    try {
      const res = await ServiceCommon.getCodeGroup(100);
      setConsultationsType(res);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatus = async () => {
    try {
      const res = await ServiceCommon.getCodeGroup(200);
      setConsultationsStatus(res);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getConsultationList();
  }, [getConsultationList]);

  // 전체 선택 체크박스 클릭 기능
  useEffect(() => {
    if (isSelectedAll) {
      setSelectedMemberList(dataList);
    } else {
      setSelectedMemberList([]);
    }
  }, [dataList, isSelectedAll, setSelectedMemberList]);

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <>
      {selectedData ? (
        <CreateConsult
          selectedData={selectedData}
          consultationsStatus={consultationsStatus}
          goBack={goBack}
          navigate={navigate}
        />
      ) : (
        <ConsultManagementList
          dataList={dataList}
          consultationsStatus={consultationsStatus}
          searchData={searchData}
          isExpanded={isExpanded}
          paginationData={paginationData}
          selectedMemberList={selectedMemberList}
          isSelectedAll={isSelectedAll}
          totalCount={totalCount}
          onExpandedChange={onExpandedChange}
          getCollapseProps={getCollapseProps}
          onSearchDataChange={onSearchDataChange}
          openSmsModal={openSmsModal}
          openSmsListModal={openSmsListModal}
          onSearch={onSearch}
          onSelected={onSelected}
          onClickMemberCheckbox={onClickMemberCheckbox}
          setIsSelectedAll={setIsSelectedAll}
          sortHeader={sortHeader}
        />
      )}
    </>
  );
};

const ConsultManagementList = ({
  dataList,
  consultationsStatus,
  searchData,
  isExpanded,
  isSelectedAll,
  selectedMemberList,
  paginationData,
  onExpandedChange,
  getCollapseProps,
  onSearchDataChange,
  openSmsModal,
  openSmsListModal,
  onSelected,
  onClickMemberCheckbox,
  setIsSelectedAll,
  onSearch,
  totalCount,
  sortHeader,
}) => {
  const checkVisitDateColor = (date) => {
    if (!date) {
      return false;
    }
    // const diff = dayjs(date).diff(new Date());
    const diff = dayjs(date).startOf('day').diff(dayjs().startOf('day'));
    return diff >= 0;
  };

  const getStatusColor = (data) => {
    switch (data.status) {
      case "10":
        return "bgc-abs";
      case "8":
        return "bgc-completed";
        case "3":
          return "bgc-wait";
      default:
        return "";
    }
  };
  const getStatusFontColor = (data) => {
    switch (data.status) {
      case "8":
        return "txt-red";
      default:
        return "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="ui-contents-wrap flex1 max-width">
      <section className="ui-contents-inner">
        <div className="ui-location-wrap">
          <div className="ui-location-title">상담관리</div>
          <div className="ui-location">
            <NavLink>
              <i className="fa-solid fa-house"></i>
            </NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <NavLink className="ui-link primary">회원관리</NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <strong>상담관리</strong>
          </div>
        </div>
        <div className="flex">
          <div className="ml-auto">
            <Buttons onClick={() => onExpandedChange((prevExpanded) => !prevExpanded)}>
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
                <th>등록일</th>
                <td>
                  <div className="flexYCenter gap">
                    <div className="ui-datepicker-wrap">
                      <div>
                        <DatePicker
                          selected={searchData?.createStartDate}
                          onChange={(date) => onSearchDataChange({ createStartDate: date })}
                          selectStart
                          startDate={searchData?.createStartDate}
                          endDate={searchData?.createEndDate}
                        ></DatePicker>
                      </div>
                      <div className="txt-grey500">~</div>
                      <div>
                        <DatePicker
                          selected={searchData?.createEndDate}
                          onChange={(date) => onSearchDataChange({ createEndDate: date })}
                          selectStart
                          startDate={searchData?.createStartDate}
                          endDate={searchData?.createEndDate}
                        ></DatePicker>
                      </div>
                    </div>

                    <Buttons
                      className="ui-button outlined xsmall"
                      onClick={() =>
                        onSearchDataChange({ createStartDate: null, createEndDate: null })
                      }
                    >
                      Clear
                    </Buttons>
                    <Buttons
                      className="ui-button outlined xsmall"
                      onClick={() =>
                        onSearchDataChange({
                          createStartDate: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                          ),
                          createEndDate: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + 1,
                            0
                          ),
                        })
                      }
                    >
                      당월
                    </Buttons>
                    <Buttons
                      className="ui-button outlined xsmall"
                      onClick={() =>
                        onSearchDataChange({
                          createStartDate: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() - 1,
                            1
                          ),
                          createEndDate: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            0
                          ),
                        })
                      }
                    >
                      전달
                    </Buttons>
                    <Buttons
                      className="ui-button outlined xsmall"
                      onClick={() =>
                        onSearchDataChange({
                          createStartDate: new Date(new Date().getFullYear(), 0, 1),
                          createEndDate: new Date(new Date().getFullYear(), 11, 31),
                        })
                      }
                    >
                      금년
                    </Buttons>
                  </div>
                </td>
                <th>처리상태</th>
                 <td>
                  <div className="ui-select">
                    <select
                      className="input-init"
                      value={searchData?.status || ""}
                      onChange={({ target: { value } }) => onSearchDataChange({ status: value })}
                    >
                      <option value="">-선택-</option>
                    </select>
                  </div>
                </td>
              </tr>
             
              <tr>
                <th>검색구분</th>
                <td>
                  <div className="flexYCenter gap">
                    <div className="ui-radio-group size-small gap">
                      {ConsultationsSearchType.map((item) => {
                        return (
                          <div key={item.key}>
                            <input
                              type="radio"
                              id={item.key}
                              checked={searchData?.search === item.key}
                              name="Clarity"
                              defaultChecked={item.key === "name"}
                              onChange={() => onSearchDataChange({ search: item.key })}
                            />
                            <label htmlFor={item.key}>{item.title}</label>
                          </div>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      className="input-init"
                      placeholder="검색"
                      value={searchData?.keyword}
                      onChange={({ target: { value } }) => onSearchDataChange({ keyword: value })}
                      onKeyPress={handleKeyPress}
                    />
                    <Buttons
                      className="ui-button outlined xsmall"
                      onClick={() => {
                        onSearchDataChange({
                          keyword: "",
                          search: "name",
                        });
                      }}
                    >
                      Clear
                    </Buttons>
                    <Buttons className="outlined xsmall" onClick={onSearch}>
                      <span className="flexYCenter gap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        검색
                      </span>
                    </Buttons>
                  </div>
                </td>
                <th>회원수</th>
                <td>
                  <div className="ui-select">
                    <select
                      className="input-init"
                      onChange={({ target: { value } }) => onSearchDataChange({ limit: value })}
                    >
                      <option value="20">20명</option>
                      <option value="40">40명</option>
                      <option value="80">80명</option>
                      <option value="100">100명</option>
                      <option value="200">200명</option>
                    </select>
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
              <strong className="txt-secondary">{totalCount}</strong>{" "}
              <span className="txt-grey600">건</span>
            </div>
          </div>

          <div className="gap-s">
            <Buttons className="outlined small" onClick={openSmsModal}>
              <div className="flex gap">SMS발송</div>
            </Buttons>
            <Buttons className="outlined small" onClick={() => onSelected({})}>
              <div className="flex gap">상담등록</div>
            </Buttons>
          </div>
        </div>
        <div className="ui-list-table sp-mt-10">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th onClick={() => sortHeader('status')}>처리상태</th>
                <th onClick={() => sortHeader('name')}>성명</th>
                <th onClick={() => sortHeader('cellPhone')}>전화번호</th>
                <th onClick={() => sortHeader('callTime')}>통화가능시간</th>
                <th onClick={() => sortHeader('createdBy')}>등록일시</th>
                <th onClick={() => sortHeader('modifiedBy')}>상담직원</th>
                <th onClick={() => sortHeader('details')}>상담내용</th>
                <th>SMS발송일시(건수)</th>
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
              {dataList?.map((data, index) => (
                <tr key={data.id} className={getStatusColor(data)}>
                  <td>{(totalCount - (paginationData.page -1) * 20) - index}</td>
                 <td>{data.status}</td>
                  <td>
                    <Buttons className="ui-link secondary-high" onClick={() => onSelected(data)}>
                      {data.name}
                    </Buttons>
                  </td>
                  <td>
                    <Buttons className="ui-link secondary-high">
                      {data.cellPhone ?
                        data.cellPhone?.length > 13 ? `${data.cellPhone.substring(0, 13)}...` : `${data.cellPhone.substring(0, 4)}****${data.cellPhone.substring(8)}`
                      : ""}
                    </Buttons>
                  </td>
                  <td>{ConsultationsCallTime.find((item) => item.key === data.callTime)?.title}</td>
                
                  <td>{dayjs(data.createdOn).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{data.creatorName}</td>
                  <td className="text-left" style={{ maxWidth: 300, position: 'relative' }}>
                    <div className="ui-ellipsis">{data.details}</div>
                    {data?.details && (
                      <div className="ui-tooltip">
                        <div className="row">
                          {data.details}
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    {data?.smsList?.[0]?.sendDate && (
                      <Buttons
                        className="ui-link secondary-high"
                        onClick={() => openSmsListModal(data?.smsList)}
                      >
                        {`${dayjs(data?.smsList?.[0]?.sendDate).format("YYYY-MM-DD")}(${
                          data?.smsList.length
                        })`}
                      </Buttons>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMemberList?.includes(data)}
                      onChange={(e) => onClickMemberCheckbox(e, data)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PageNations key={paginationData.startPage} data={paginationData} />
        </div>
      </section>
    </section>
  );
};



const CreateConsult = ({ selectedData, consultationsStatus, goBack, navigate }) => {
  const loginUser = useSelector((state) => state.loginUser);

  const [data, setData] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [historyDetail, setHistoryDetail] = useState("");
  const { 
    openMemberRegistWindow,
    setNewState,
    isClose,
  } = useMemberRegistWindow();
  const [duplicateNum, setDuplicateNum] = useState(false);

  const fileRef = useRef();

  const onChangeData = (item) => {
    if (item?.file?.length > 0 && !!data.files) {
      setData((prev) => ({ ...prev, isDeleteFile: true }));
    }
    setData((prev) => ({ ...prev, ...item }));
  };

  const checkDuplicate = async () => {
    try {
      const res = await ServiceCommon.checkPhone({cellPhone: data?.cellPhone});
      setDuplicateNum(true);
      alert("사용할 수 있는 전화번호입니다.")
    } catch (error) {
      console.error(error.message);
    }
  };

  const onRegisterUserConsultClick = async () => {
    if (!data.foundPath) {
      alert("알게된 동기를 선택해주세요.")
      return;
    }

    if (!data.email) {
      alert("이메일을 입력해주세요.")
      return;
    }

    openMemberRegistWindow(data, false);
  };

  const onModifyClick = async () => {
    try {
      const formData = new FormData();
      console.log("data:",data)
      for (let key in data) {
        if (
          key !== "file" &&
          key !== "isDeleteFile" &&
          key !== "fileUrl" &&
          key !== "originalFile"
        ) {
          console.log("key ==>", key);
          if (key === "consultationDate" && data[key] !== null) {
            formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm:ss"));
          } else if (key === "visitDate" && data[key] !== null) {
              formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm:ss"));
          } else if (data[key] !== null) {
              formData.append(key, data[key]);
          }
          // if ((key === "consultationDate" && data[key]) || (key === "visitDate" && data[key])) {
          //   formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm:ss"));
          // } else {
          //   formData.append(key, data[key]);
          // }
        }

        // 필수값 체크
        if (
          (key === "status" && data[key] === "") ||
          (key === "name" && data[key] === "") ||
          (key === "cellPhone" && data[key] === "") 
        ) {
          alert("필수값을 입력해 주세요.");
          return;
        }
      }
      console.log(data?.file?.[0]);

      if (data?.file?.[0].name) {
        formData.append("file", data?.file[0]);
      } else if (data?.fileUrl && data?.originalFile) {
        // 새 파일이 없으면 서버에서 파일 다운로드 후 추가
        const response = await fetch(data.fileUrl);
        const blob = await response.blob();
        formData.append("file", blob, data.originalFile);
      }

      formData.append("isDeleteFile", !!data?.isDeleteFile);
      formData.delete("id");
      await ServiceConsultations.modifyConsult(data.id, formData);
      alert("상담정보가 수정되었습니다.")
    } catch (error) {
      console.error(error.message);
    }
  };
  const onDeleteClick = async () => {
    try {
      if (window.confirm("삭제 하시겠습니까?")) {
        await ServiceConsultations.deleteConsult(data.id);

        goBack();
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const onCreateConsultClick = async () => {
    try {
      if (!duplicateNum) {
        alert("연락처 중복체크를 해주세요.")
        return;
      }

      const formData = new FormData();
      for (let key in data) {
        if (key !== "file" || key !== "isDeleteFile") {
          if (key === "consultationDate") {
            formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm:ss"));
          } else {
            formData.append(key, data[key]);
          }
        }
      }

      if (data?.file?.[0].name) {
        formData.delete("file");
        formData.append("file", data?.file[0]);
      }

      formData.delete("id");

      await ServiceConsultations.createConsult(formData);
      goBack();
    } catch (error) {
      console.error(error.message);
    }
  };

  const onCreateHistory = async () => {
    try {
      await ServiceConsultations.createHistory(selectedData.id, { details: historyDetail });
      const res = await ServiceConsultations.getConsultationDetailHistory(selectedData.id);
      console.log(res);
      setHistoryData(res);
    } catch (error) {
      console.error(error.message);
    }
  };
  const onDeleteHistory = async (id) => {
    try {
      await ServiceConsultations.deleteHistory(id);
      const res = await ServiceConsultations.getConsultationDetailHistory(selectedData.id);
      setHistoryData(res);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getData = useCallback(async () => {
    if (selectedData?.id && !data?.id) {
      try {
        const res = await ServiceConsultations.getConsultationDetail(selectedData.id);
        console.log(res);
        setData(res);
      } catch (error) {
        console.error(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHistory = useCallback(async () => {
    if (selectedData?.id) {
      try {
        const historyRes = await ServiceConsultations.getConsultationDetailHistory(selectedData.id);
        setHistoryData(historyRes);
      } catch (error) {
        console.error(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 연락처 포맷
  const formatHP = (value) => {
    const cleaned = (value || '').replace(/\D/g, '');

    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);

    if (match) {
      const groups = match.slice(1);
      return `${groups[0]}${groups[1] ? '-' + groups[1] : ''}${groups[2] ? '-' + groups[2] : ''}`;
    }

    return value;
  }

  useEffect(() => {
    getData();
  }, [getData, getHistory]);

  useEffect(() => {
    getHistory();
  }, [getData, getHistory]);

  useEffect(() => {
    if (isClose) {
      navigate('/operator/members/member')
    }
  }, [isClose, setNewState])

  return (
    <section className="ui-contents-wrap mid-width flex1">
      <section className="ui-contents-inner">
        <div className="ui-location-wrap">
          <div className="ui-location-title">상담관리</div>
        </div>

        <div className="sp-mt-15">
          <div className="ui-sub-title small has-bg">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">기본정보</div>
              </div>
            </div>

            <div>
              <div className="size-small txt-grey700">
                ( <i className="require">*</i> 표시필수 )
              </div>
            </div>
          </div>

          <div className="ui-info-table th-left sp-mt-5">
            <table>
              <colgroup>
                <col style={{ width: 100 }} />
                <col />
                <col style={{ width: 100 }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                   <th>
                    처리상태 <i className="require">*</i>
                  </th>
                  <td>
                    <select
                      className="input-init"
                      defaultValue={data?.status}
                      value={data?.status || ""}
                      onChange={({ target: { value } }) => onChangeData({ status: value })}
                    >
                      <option value="">-선택-</option>
                      <option value="대기">대기</option>
                      <option value="완료">완료</option>
                    </select>
                  </td>
                  <th>상담직원</th>
                  <td>{loginUser.name || data?.modifiedName}</td>
                </tr>
    
                <tr>
                  <th>
                    성명 <i className="require">*</i>
                  </th>
                  <td>
                    <div className="flexYCenter gap-10">
                      <input
                        type="text"
                        className="input-init"
                        value={data?.name || ""}
                        onChange={({ target: { value } }) => onChangeData({ name: value })}
                      />

                      <div className="ui-radio-group size-small">
                        {[
                          { key: "M", title: "남" },
                          { key: "F", title: "여" },
                        ].map((el, i) => {
                          return (
                            <div key={i}>
                              <input
                                type="radio"
                                id={`${el.key}-${i}`}
                                name="Clarity"
                                checked={data?.gender === el.key}
                                onChange={() => onChangeData({ gender: el.key })}
                              />
                              <label htmlFor={`${el}-${i}`}>{el.title}</label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <th>통화가능시간</th>
                  <td>
                    <select
                      name="call_time"
                      className="input-init"
                      value={data?.callTime || ""}
                      onChange={({ target: { value } }) => onChangeData({ callTime: value })}
                    >
                      {ConsultationsCallTime.map((item) => (
                        <option key={item.key} value={item.key}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>
                    연락처 <i className="require">*</i>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="input-init"
                      value={formatHP(data?.cellPhone) || ""}
                      onChange={({ target: { value } }) => onChangeData({ cellPhone: formatHP(value) })}
                      maxLength="13"
                    />{" "}
                    <Buttons className="outlined xsmall" onClick={checkDuplicate}>
                      중복체크
                    </Buttons>
                  </td>
                  <th>이메일</th>
                  <td>
                    <input
                      type="email"
                      className="input-init"
                      value={data?.email || ""}
                      onChange={({ target: { value } }) => onChangeData({ email: value })}
                    />
                  </td>
                </tr>
                <tr>
                  <th>영어공부목적</th>
                  <td colSpan={3}>
                    <div className="ui-check full">
                      {[
                        { key: "COMMON_ENGLISH", title: "생활영어" },
                        { key: "WORK", title: "비즈니스업무" },
                        { key: "STUDY_ABROAD", title: "유학준비" },
                        { key: "DEVELOPMENT", title: "자기개발" },
                        { key: "EMPLOYMENT", title: "취업준비" },
                        { key: "ETC", title: "기타" },
                      ].map((el, i) => {
                        return (
                          <div className="check" key={i}>
                            <input
                              type="checkbox"
                              className="input-init"
                              checked={data?.studyPurposes?.includes(el.key) || false}
                              onChange={() => {
                                const updatedPurposes = data?.studyPurposes?.includes(el.key)
                                ? data.studyPurposes.filter(purpose => purpose !== el.key)
                                : [...(data?.studyPurposes || []), el.key];
                                onChangeData({ studyPurposes: updatedPurposes }); 
                              }}
                            />
                            <label>{el.title}</label>
                            {el.title === "기타" && ":"}
                            {el.title === "기타" && <input type="text" className="input-init" />}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ui-sub-title small has-bg sp-mt-15">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">부가 정보</div>
              </div>
            </div>

            <div>
              <div className="size-small txt-grey700">
                ( <i className="require">*</i> 표시필수 )
              </div>
            </div>
          </div>

          <div className="ui-info-table th-left sp-mt-5">
            <table>
              <colgroup>
                <col style={{ width: 100 }} />
                <col />
                <col style={{ width: 100 }} />
                <col />
              </colgroup>
              <tbody>

                <tr>
                  <th>상담일시</th>
                  <td colSpan={3}>
                    <div className="flexYCenter gap">
                      <div className="ui-datepicker-wrap">
                        <div>
                          <ReactDatePicker
                            dateFormat="YYYY-MM-dd HH:mm"
                            showTimeSelect
                            selected={data?.consultationDate ? dayjs(data?.consultationDate, 'YYYY-MM-dd HH:mm').toDate() : null}
                            timeIntervals={5}
                            onChange={(date) =>
                              onChangeData({
                                consultationDate: date,
                              })
                            }
                            dayClassName={(date) =>
                              dayjs(date).day() === 6
                                ? "saturday"
                                : dayjs(date).day() === 0
                                ? "sunday"
                                : null
                            }
                            customInput={
                              <input
                                style={{
                                  width: "130px", // 원하는 너비
                                }}
                              />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </td>
   
                </tr>
                <tr>
                  <th>상담내용</th>
                  <td colSpan={3}>
                    <textarea
                      className="input-init full"
                      rows="5"
                      value={data?.details}
                      onChange={({ target: { value } }) => onChangeData({ details: value })}
                    />
                  </td>
                </tr>
                <tr>
                  <th>첨부파일</th>
                  <td colSpan={3}>
                    <Buttons
                      className="input-file outlined mid2"
                      onClick={() => fileRef.current.click()}
                    >
                      <div className="flexYCenter gap">
                        파일첨부
                        <i className="fa-solid fa-paperclip txt-primary-deep"></i>
                      </div>

                      <input
                        ref={(ref) => (fileRef.current = ref)}
                        type="file"
                        className="input-init"
                        onChange={({ target: { files } }) => onChangeData({ file: files })}
                      />
                    </Buttons>

                    <div className="ui-detail-list col-2 space-none sp-mt-5">
                      <div className="label">첨부</div>
                      <div className="cont">
                        <Buttons 
                          type="button" 
                          className="xsmall txt-secondary-high"
                          onClick={async () => {
                            if (data?.fileUrl) {
                              try {
                                // 파일 URL의 유효성 검사
                                const response = await fetch(data.fileUrl, { method: 'HEAD' });
                                if (response.ok) {
                                  // 파일이 존재하면 다운로드 진행
                                  const link = document.createElement("a");
                                  link.href = data.fileUrl;
                                  link.download = data?.file?.[0]?.name || data.originalFile; // 파일 이름 설정
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } else {
                                  alert("파일을 찾을 수 없습니다.");
                                }
                              } catch (error) {
                                console.error("파일 다운로드 중 오류 발생:", error);
                                alert("파일을 다운로드할 수 없습니다.");
                              }
                            } else {
                              alert("파일을 찾을 수 없습니다.");
                            }
                          }}
                        >
                          {data?.file?.[0]?.name || data?.originalFile}
                        </Buttons>
                        {data?.file && (
                          <Buttons
                            type="button"
                            className="xsmall"
                            onClick={() => {
                              onChangeData({ 
                                file: undefined, 
                                fileUrl: undefined, 
                                originalFile: undefined, 
                                isDeleteFile: true 
                              });
                              // if (data?.fileUrl) {
                              //   onChangeData({ file: "", isDeleteFile: true });
                              // } else {
                              //   onChangeData({ file: "", isDeleteFile: true });
                              // }
                            }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </Buttons>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="layout-between sp-mt-10">
            <Buttons
              className="grey-light small text-center"
              style={{ width: 80 }}
              onClick={goBack}
            >
              목록
            </Buttons>

            {selectedData?.id ? (
              <div className="gap">
                <Buttons
                  className="primary small text-center"
                  style={{ width: 80 }}
                  onClick={onRegisterUserConsultClick}
                >
                  회원등록
                </Buttons>

                <Buttons
                  className="grey-light small text-center"
                  style={{ width: 80 }}
                  onClick={onModifyClick}
                >
                  수정
                </Buttons>
                <Buttons
                  className="grey small text-center"
                  style={{ width: 80 }}
                  onClick={onDeleteClick}
                >
                  삭제
                </Buttons>
              </div>
            ) : (
              <Buttons
                className="primary small text-center"
                style={{ width: 80 }}
                onClick={onCreateConsultClick}
              >
                등록
              </Buttons>
            )}
          </div>
        </div>

        {data?.createdOn && (
          <div className="sp-mt-20">
            <div className="ui-sub-title ">
              <div className="title">
                <div className="tit-wrap">
                  <div className="tit"> 추가 상담 이력</div>
                </div>
              </div>
            </div>

            <div className="ui-list-table sp-mt-10">
              <table>
                <colgroup></colgroup>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>상담내용</th>
                    <th>날짜</th>
                    <th>상담자</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {historyData?.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index+1}</td>
                      <td className="text-left pre-wrap">{item.details}</td>
                      <td>{dayjs(item.date).format("YYYY.MM.DD HH:mm")}</td>
                      <td>{item.modifiedName}</td>
                      <td>
                        <Buttons
                          className="outlined xsmall"
                          onClick={() => onDeleteHistory(item.id)}
                        >
                          삭제
                        </Buttons>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} style={{ padding: "5px 0" }}>
                      <div className="flex gap">
                        <textarea
                          className="input-init full"
                          rows="5"
                          placeholder="상담내용을 입력해 주세요."
                          value={historyDetail}
                          onChange={({ target: { value } }) => setHistoryDetail(value)}
                        ></textarea>
                        <Buttons
                          className="primary"
                          style={{ width: 70 }}
                          onClick={onCreateHistory}
                        >
                          등록
                        </Buttons>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default ConsultManagementContents;
