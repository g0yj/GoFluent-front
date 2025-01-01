import { useCallback, useEffect, useRef, useState } from "react";

import ServiceLDF from "@/app/service/service-ldf";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";

const LearnerManagementDetailLDF = ({member}) => {
  const [date, setDate] = useState(null);
  const [dataList, setDataList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // 조회조건
  const paginationData = usePagination();

  const getList = useCallback(async () => {
    try {
      const res = await ServiceLDF.getLdfList(member.id, {
        date,
        page: paginationData.page,
        limit: paginationData.limit,
      });
      setDataList(res.list);
      if (paginationData.totalPage === 1) {
        paginationData.setLimit(res.limit);
        paginationData.setPage(res.total);
      }
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member.id]);

  const onSearch = async (date) => {
    const res = await ServiceLDF.getLdfList(member.id, {
      date: dayjs(date).format("YYYY-MM-DD"),
      page: 1,
      limit: paginationData.limit,
    });

    setDataList(res.list);
    setDate(date);
    paginationData.setLimit(res.limit);
    paginationData.setPage(res.total);
  };

  const onSelectItem = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <div>
      {selectedItem ? (
        <LDFDetail member={member} selectedItem={selectedItem} onSelectItem={onSelectItem} />
      ) : (
        <LDFList
          dataList={dataList}
          date={date}
          member={member}
          paginationData={paginationData}
          onSearch={onSearch}
          onSelectItem={onSelectItem}
        />
      )}
    </div>
  );
};

const convertHtmlToText = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  let textContent = doc.body.innerHTML;
  
  textContent = textContent
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

  textContent = textContent.replace(/<p\s*\/?>/gi, '\n');
  textContent = textContent.replace(/&nbsp;/g, ' ');
  textContent = textContent.replace(/<br\s*\/?>/gi, '\n');
  textContent = textContent.replace(/<\/p>/gi, '');
 
  return textContent;
};

const LDFDetail = ({ member, selectedItem, onSelectItem }) => {
  const [data, setData] = useState({});
  const [contentSp, setContentSp] = useState('');
  const [contentV, setContentV] = useState('');
  const [contentSg, setContentSg] = useState('');
  const [contentC, setContentC] = useState('');

  const onChangeData = (data) => {
    setData((prev) => ({ ...prev, ...data }));
  };

  const createLdf = async () => {
    const saveData = {
      ...data,
      reservationId: selectedItem?.id
    }
    if (selectedItem?.ldfId) {
      await ServiceLDF.modifyLdf(selectedItem.ldfId, saveData);
    } else {
      await ServiceLDF.registLdf(member.id, saveData);
    }
    onSelectItem(null);
  }

  // 인쇄 기능
  const printRef = useRef(null);
  const print = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @media print {
        body { zoom: 0.8; }  /* 페이지 크기를 줄이는 설정, 숫자는 조정 가능 */
        table { page-break-inside: avoid; }
        tr, td, th, textarea { page-break-inside: avoid; }
        textarea {
          overflow: hidden; /* 텍스트가 잘리지 않도록 함 */
          resize: none; /* 사용자가 크기를 조절하지 못하게 함 */
        }
      }
    `,
  })

  const clickPrint = () => {
    print();
  }

  const getLdfDetail = useCallback(async () => {
    try {
      const res = await ServiceLDF.getLdf(member.id, selectedItem.ldfId);

      setData(res);
      setContentSp(convertHtmlToText(res.contentSp));
      setContentV(convertHtmlToText(res.contentV));
      setContentSg(res.contentSg);
      setContentC(res.contentC);
    } catch (error) {
      console.error(error);
    }
  }, [member.id, selectedItem.ldfId]);

  useEffect(() => {
    if (selectedItem.ldfId) {
      getLdfDetail();
    }
  }, [getLdfDetail, selectedItem.ldfId]);

  return (
    <div>
      <div ref={printRef}>
        <div className="ui-sub-title sticky-tabs sp-mt-10">
          <div className="title">
            <div className="tit-wrap">
              <div className="tit">{member.name}</div>
              <small>({member.email})</small>
            </div>
          </div>
        </div>

        <div className="ui-scroll-wrap bottom-line sp-mt-20" style={{ height: 720 }}>
          <div className="ui-scroll-inner">
            <div className="ui-info-table th-left ">
              <table>
                <colgroup>
                  <col style={{ width: 130 }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th>Lesson</th>
                    <td dangerouslySetInnerHTML={{ __html: data?.lesson? data.lesson : selectedItem.courseName }}></td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td>{data?.date? data.date : selectedItem.date}</td>
                  </tr>
                  <tr>
                    <th>Teacher</th>
                    <td>{data?.teacherName? data.teacherName : selectedItem.teacherName}</td>
                  </tr>
                  <tr>
                    <th>Stress and Pronunciation</th>
                    <td >
                      <textarea
                        className="input-init full"
                        rows="10"
                        value={convertHtmlToText(contentSp)}
                        onChange={({ target: { value } }) => {
                          setContentSp(value)
                          onChangeData({ contentSp: value })
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Vocabulary</th>
                    <td >
                      <textarea
                        className="input-init full"
                        rows="10"
                        value={convertHtmlToText(contentV)}
                        onChange={({ target: { value } }) => {
                          setContentV(value)
                          onChangeData({ contentV: value })
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Sentence Structure & Grammar</th>
                    <td >
                      <textarea
                        className="input-init full"
                        rows="10"
                        value={convertHtmlToText(contentSg)}
                        onChange={({ target: { value } }) => {
                          setContentSg(value)
                          onChangeData({ contentSg: value })
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Comment</th>
                    <td >
                      <textarea
                        className="input-init full"
                        rows="10"
                        value={convertHtmlToText(contentC)}
                        onChange={({ target: { value } }) => {
                          setContentC(value)
                          onChangeData({ contentC: value })
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="layout-between sp-mt-10">
        <div>
          <Buttons
            className="grey-light small text-center"
            style={{ width: 80 }}
            onClick={() => onSelectItem(null)}
          >
            목록
          </Buttons>
        </div>
        <div className="gap">
          <Buttons className="outlined small text-center" style={{ width: 80 }} onClick={() => createLdf()}>
            저장
          </Buttons>
          <Buttons className="outlined small text-center" style={{ width: 80 }} onClick={() => clickPrint()}>
            인쇄
          </Buttons>
          <Buttons className="outlined small text-center" style={{ width: 80 }}>
            이메일
          </Buttons>
        </div>
      </div>
    </div>
  );
};

const LDFList = ({ member, dataList, date, paginationData, onSearch, onSelectItem }) => {
  return (
    <div>
      <div className="ui-sub-title sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{member.name}</div>
            <small>({member.email})</small>
          </div>
        </div>
      </div>

      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>날짜</th>
              <td>
                <div className="ui-datepicker-wrap">
                  <div>
                    <DatePicker
                      selected={date}
                      onChange={(date) => onSearch(date)}
                      selectStart
                      startDate={date}
                      endDate={date}
                    ></DatePicker>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-list-table small sp-mt-20">
        <table>
          <colgroup>
            <col style={{ width: 40 }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>No</th>
              <th>수강시간</th>
              <th>과정</th>
              <th>콘텐츠</th>
              <th>강사</th>
              <th>출결</th>
              <th>LDF</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {dataList?.map((data) => (
              <LDFItem key={data.id} item={data} onSelectItem={onSelectItem} />
            ))}
          </tbody>
        </table>
      </div>

      <PageNations key={paginationData.startPage} data={paginationData} />
    </div>
  );
};

const LDFItem = ({ item, onSelectItem }) => {
  return (
    <tr className="text-center">
      <td>{`${item.listNumber}`}</td>
      <td>{`${item.date} ${item.startTime} ~ ${item.endTime}`}</td>
      <td>{`${item.courseName || ""}`}</td>
      <td>{`${item.content || ""}`}</td>
      <td>{`${item.teacherName || ""}`}</td>
      <td className={item.attendanceStatus === "예약" ? "txt-ok-color" : ""}>{`${
        item.attendanceStatus || ""
      }`}</td>
      <td>
        {item.ldfId ? (
          <Buttons className="primary small text-center" onClick={() => onSelectItem(item)}>
            수정
          </Buttons>
        ) : (
          <Buttons className="input-init active small text-center" style={{color: 'white'}} onClick={() => onSelectItem(item)}>
            등록
          </Buttons>
        )}
      </td>

      <td className="txt-warning">{item?.email ? "Sent" : ""}</td>
    </tr>
  );
};

export default LearnerManagementDetailLDF;
