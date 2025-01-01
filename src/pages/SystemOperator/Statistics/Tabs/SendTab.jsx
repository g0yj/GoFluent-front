import useSmsTargetMemberListWindow from "@/app/helper/windows-hooks/use-sms-target-member-list-window";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";
import ServiceSms from "@/app/service/service-sms";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";
import ExcelTest from "@/pages/SystemOperator/Members/ExcelTest";

const ExcelHeader = [
  "No",
  "고유값",
  "발송자(id)",
  "발송자(이름)",
  "발송자(mobile)",
  "내용",
  "발송건수",
  "발송일"
]

const SendTab = () => {
  const [isExpanded, setExpanded] = useState(true);
  const { getCollapseProps } = useCollapse({ isExpanded });

  const { openSmsWindow } = useSmsWindow();
  const { openSmsTargetMemberListWindow } = useSmsTargetMemberListWindow();

  // 검색 조건 (form)
  const paginationData = usePagination();
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [search, setSearch] = useState("ALL");
  const [Active, setActive] = useState("ALL");

  // 표시 데이터
  const [totalCount, setTotalCount] = useState(0);
  const [smsList, setSmsList] = useState([]);

  //사용자 클릭 동작을 위한 데이터
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [selectedSmsList, setSelectedSmsList] = useState([]);
  const [excelData, setExcelData] = useState();

  // 검색 조건 request data 만들기
  const makeSearchCondition = () => {
    return {
      page: paginationData.page,
      limit: paginationData.limit,
      sendDateFrom: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
      sendDateTo: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
      sendType: Active,
      search,
      keyword,
    };
  };

  const onClickSendSms = () => {
    const saveData = selectedSmsList.map((item) => ({
      name: item.recipientName,
      phone: item.recipientPhone,
    }));
    openSmsWindow(saveData);
  };

  // API 호출
  const searchSmsList = async () => {
    try {
      const res = await ServiceSms.getSmsList(makeSearchCondition());
      console.log(res);
      setTotalCount(res.totalCount); // totalCount 표시용
      paginationData.setTotalPage(res.totalPage); // pagination 계산용
      setSmsList(res.list); // sms 목록 표시용
    } catch (e) {
      alert(e.message);
    }
  };

  const getExcelData = async () => {
    const res = await ServiceSms.getSmsExcel(makeSearchCondition());
    console.log("excel::", res);
    setExcelData(res);
  }

  //검색 버튼 클릭
  const onClickSearchBtn = () => {
    searchSmsList();
  };

  // 체크박스 클릭 기능
  const onClickSmsCheckbox = (evt, data) => {
    if (evt.target.checked) {
      setSelectedSmsList(selectedSmsList.concat([data]));
    } else {
      setSelectedSmsList(selectedSmsList.filter((m) => m !== data));
    }
  };

  const onDeleteClick = async () => {
    try {
      const saveData = selectedSmsList.map((item) => item.id);
      await ServiceSms.deleteSms(saveData);
      await searchSmsList();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    searchSmsList();
    getExcelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationData.page, startDate, endDate, Active]);

  // 체크박스 선택 기능
  // 전체 선택 체크박스 클릭 기능
  useEffect(() => {
    if (isSelectedAll) {
      setSelectedSmsList([...smsList]);
    } else {
      setSelectedSmsList([]);
    }
  }, [isSelectedAll, setSelectedSmsList, smsList]);

  return (
    <>
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
            <col style={{ width: 120 }} />
            <col />
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>발송일</th>
              <td>
                <div className="flexYCenter gap">
                  <div className="ui-datepicker-wrap">
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                    <div className="txt-grey500">~</div>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                </div>
              </td>
              <th>구분</th>
              <td>
                <button className="ui-select">
                  <select
                    className="input-init"
                    value={Active}
                    onChange={({ target: { value } }) => setActive(value)}
                  >
                    <option value={"ALL"}>- 전체 -</option>
                    <option value={"S"}>SMS</option>
                    <option value={"L"}>LMS</option>
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>검색</th>
              <td colSpan="3">
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select
                      className="input-init"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    >
                      <option value="ALL">- 전체 -</option>
                      <option value={"content"}>내용</option>
                      <option value={"senderName"}>발송자</option>
                    </select>
                  </button>
                  <input
                    type="text"
                    className="input-init"
                    placeholder="검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
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
            <strong className="m">Total :</strong>
            <strong className="b txt-secondary">{totalCount}</strong>
            <span className="txt-grey600">건</span>
          </div>
        </div>

        <div className="gap">
          <Buttons className="outlined small" onClick={onClickSendSms}>
            SMS발송
          </Buttons>
          <ExcelTest page="SMS발송관리" header={ExcelHeader} excelData={excelData}>
          </ExcelTest>
          <Buttons className="outlined small" onClick={onDeleteClick}>
            선택삭제
          </Buttons>
        </div>
      </div>

      <div className="ui-list-table sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              <th>No</th>
              <th>발송자</th>
              <th>
                발송건수 (<span className="txt-secondary">성공</span> /{" "}
                <span className="txt-red">실패</span>)
              </th>
              <th>대상자</th>
              <th>내용</th>
              <th>발송일</th>
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
            {smsList.map((data, i) => {
              return (
                <tr key={i} className={`${i === 0 ? "active" : ""}`}>
                  <td>{totalCount - (paginationData.page * i)}</td>
                  <td>{data.senderName}</td>
                  <td>
                    {data.total} (<span className="txt-secondary">{data.success}</span> /
                    <span className="txt-red">{data.fail}</span>)
                  </td>
                  <td>
                    <Buttons
                      className="outlined xsmall bgc-white"
                      onClick={() => openSmsTargetMemberListWindow(data)}
                    >
                      보기
                    </Buttons>
                  </td>
                  <td className="text-left">
                    <Buttons
                      className="ui-link secondary-high small ui-ellipsis"
                      style={{ maxWidth: 800 }}
                      onClick={() =>
                        openSmsWindow(
                          [
                            {
                              name: data.recipientName,
                              phone: data.recipientPhone,
                            },
                          ],
                          data
                        )
                      }
                    >
                      {data.content}
                    </Buttons>
                  </td>
                  <td>{dayjs(data.sendDate).format("YYYY-MM-DD hh:mm")}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSmsList.includes(data)}
                      onChange={(e) => onClickSmsCheckbox(e, data)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <PageNations key={paginationData.startPage} data={paginationData} />
      </div>
    </>
  );
};

export default SendTab;
