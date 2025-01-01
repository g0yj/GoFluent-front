import ServiceSms from "@/app/service/service-sms";
import Buttons from "@/components/Buttons";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";

const sendType = [
  { key: "ALL", title: "- 전체 -" },
  { key: "L", title: "LMS" },
  { key: "S", title: "SMS" },
];

const search = [
  { key: "ALL", title: "- 전체 -" },
  { key: "recipientPhone", title: "수신번호" },
  { key: "senderPhone", title: "발신번호" },
  { key: "content", title: "내용" },
];

const HoldTab = () => {
  const [searchData, setSearchData] = useState({
    sendType: sendType[0].key,
    search: search[0].key,
    keyword: "",
  });
  const [dataList, setDataList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [isExpanded, setExpanded] = useState(true);
  const [total, setTotal] = useState(0);

  const { getCollapseProps } = useCollapse({ isExpanded });
  const paginationData = usePagination();

  const onSearchDataChange = (data) => {
    setSearchData((prev) => ({ ...prev, ...data }));
  };

  const getList = useCallback(async () => {
    try {
      const res = await ServiceSms.getSmsHoldList(searchData);

      setDataList(res.list);
      setTotal(res.totalCount);
      paginationData.setTotalPage(res.totalPage);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData.search, searchData.sendType]);

  useEffect(() => {
    getList();
  }, [getList]);

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
              <th>구분</th>
              <td>
                <button className="ui-select">
                  <select
                    className="input-init"
                    value={searchData.sendType}
                    onChange={({ target: { value } }) => onSearchDataChange({ sendType: value })}
                  >
                    {sendType.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
              <th>처리상태</th>
              <td>
                <button className="ui-select">
                  <select className="input-init">
                    <option value={"ALL"}>- 전체 -</option>
                    <option>예약발송</option>
                    <option>발송대기</option>
                    <option>발송완료</option>
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
                      value={searchData.search}
                      onChange={({ target: { value } }) => onSearchDataChange({ search: value })}
                    >
                      {search.map((item) => (
                        <option key={item.key} value={item.key}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </button>
                  <input
                    type="text"
                    className="input-init"
                    placeholder="검색"
                    value={searchData.keyword}
                    onChange={({ target: { value } }) => onSearchDataChange({ keyword: value })}
                  />
                  <Buttons className="outlined xsmall">
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

      <div className="sp-mt-10">
        <div>
          * 메시지 전송은 시스템의 상태에 따라 [<span className="txt-red">대기시간</span>] 이 존재할
          수 있으며 시간이 경과되면 [<span className="txt-secondary">발송완료</span>]로 변경됩니다.
        </div>
        <div>
          * [<span className="txt-secondary">발송완료</span>]인 메시지는 매시간 정각에 발송내역에서
          확인 가능합니다.
        </div>
        <div>
          * [<span className="txt-red">예약취소</span>]는 발송시간 10분 전까지만 가능합니다.
        </div>
      </div>

      <div className="layout-between sp-mt-10">
        <div>
          <div className="size-bodyXS">
            <strong className="m">Total :</strong>
            <strong className="b txt-secondary">{total}</strong>
            <span className="txt-grey600">건</span>
          </div>
        </div>

        <div className="gap">
          <Buttons className="outlined small">예약취소</Buttons>
        </div>
      </div>

      <div className="ui-list-table sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 60 }} />
          </colgroup>
          <thead>
            <tr>
              <th>No</th>
              <th>수신/발신번호</th>
              <th>발송건수</th>
              <th>구분</th>
              <th>처리상태</th>
              <th>내용</th>
              <th>클립보드</th>
              <th>발송일시</th>
              <th>
                <input
                  type="checkbox"
                  checked={selectedList.length === dataList.length}
                  onChange={() => {
                    if (selectedList.length === dataList.length && selectedList.length > 0) {
                      setSelectedList([]);
                    } else {
                      setSelectedList(dataList);
                    }
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={`${index}-${item.senderName}-${item.content}`}>
                <td>{index + 1}</td>
                <td>
                  <div className="secondary-high small">{item.smsTarget.recipientPhone}</div>
                </td>
                <td>1 (1/0)</td>
                <td>SMS</td>
                <td></td>
                <td className="text-left">
                  <div className=" secondary-high small ui-ellipsis" style={{ maxWidth: 600 }}>
                    {item.content}
                  </div>
                </td>
                <td></td>
                <td>{item.smsTarget.sendDate}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedList.find(
                      (selectedItem) => selectedItem.smsTarget.id === item.smsTarget.id
                    )}
                    onChange={() => {
                      if (
                        selectedList.find(
                          (selectedItem) => selectedItem.smsTarget.id === item.smsTarget.id
                        )
                      ) {
                        const saveData = selectedList.filter(
                          (selectedItem) => selectedItem.smsTarget.id !== item.smsTarget.id
                        );
                        setSelectedList(saveData);
                      } else {
                        setSelectedList((prev) => [...prev, item]);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PageNations key={paginationData.startPage} data={paginationData} />
      </div>
    </>
  );
};

export default HoldTab;
