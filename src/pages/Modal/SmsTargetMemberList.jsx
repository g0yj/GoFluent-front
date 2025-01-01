import useSmsTargetMemberListWindow from "@/app/helper/windows-hooks/use-sms-target-member-list-window";
import ServiceSms from "@/app/service/service-sms";
import Buttons from "@/components/Buttons";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import { useCallback, useEffect, useState } from "react";

const statusType = [
  { key: "WAITING", title: "대기" },
  { key: "SUCCESS", title: "성공" },
  { key: "FAIL", title: "실패" },
];

const SmsTargetMemberList = () => {
  const { data } = useSmsTargetMemberListWindow();
  const paginationData = usePagination();

  const [searchData, setSearchData] = useState({type: "ALL", keyword: ""});
  const [dataList, setDataList] = useState({});
  const [total, setTotal] = useState(0);

  const onChangeSearchData = (item) => {

    setSearchData((prev) => ({ ...prev, ...item }));
  };

  const getList = useCallback(async () => {
    try {
      const res = await ServiceSms.getTargetMemberList(data.id, searchData);

      setDataList(res.list);
      setTotal(res.totalCount);
      paginationData.setPage(data.totalPage);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, searchData]);

  const onSearch = async () => {
    const res = await ServiceSms.getTargetMemberList(data.id, searchData);
    setDataList(res.list);
    setTotal(res.totalCount);
    paginationData.setPage(data.totalPage);
  };

  useEffect(() => {
    if(data?.id) getList();
  }, [data?.id, getList]);

  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">대상자</div>
      </div>

      <div className="ui-info-table sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>검색</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select mid">
                    <select
                      className="input-init"
                      value={searchData.search}
                      onChange={({ target: { value } }) => onChangeSearchData({ search: value })}
                    >
                      <option value="ALL">- 전체 -</option>
                      <option value="email">이메일</option>
                      <option value="recipientName">이름</option>
                    </select>
                  </button>
                  <input
                    type="text"
                    className="input-init"
                    placeholder="검색"
                    value={searchData.keyword}
                    onChange={({ target: { value } }) => onChangeSearchData({ keyword: value })}
                  />
                  <Buttons className="outlined xsmall" onClick={onSearch}>
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

      <div>
        <div className="layout-between sp-mt-20">
          <div>
            <div className="size-bodyXS">
              <strong className="m">Total :</strong>{" "}
              <strong className="b txt-secondary">{total}</strong>
              <span className="txt-grey600">건</span>
            </div>
          </div>

          <div>
            <Buttons className="outlined small">
              <div className="flex gap">
                EXCEL
                <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
              </div>
            </Buttons>
          </div>
        </div>
        <div className="ui-info-table txt-mid another sp-mt-10">
          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>이메일</th>
                <th>이름</th>
                <th>수신번호</th>
                <th>발송여부</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataList) ? (
                dataList?.map((item) => (
                  <tr key={item.listNumber}>
                    <td>{item.listNumber}</td>
                    <td>{item.email}</td>
                    <td>{item.recipientName}</td>
                    <td>
                      <div className="ui-ellipsis" style={{ maxWidth: 100, margin: "auto" }}>
                        {item.recipientPhone}
                      </div>
                    </td>
                    <td>{statusType.find((status) => status.key === item.status).title}</td>
                  </tr>
                ))

              ):(
                <tr>
                  <td colSpan={5}>발송건이 없습니다.</td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>

        <PageNations data={paginationData} />

        <div className="layout-between sp-mt-20">
          <div className="ml-auto">
            <Buttons className="primary mid" onClick={() => window.close()}>
              확인
            </Buttons>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsTargetMemberList;
