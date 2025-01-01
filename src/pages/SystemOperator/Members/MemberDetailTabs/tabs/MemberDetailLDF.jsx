import { useCallback, useEffect, useState } from "react";

import ServiceLDF from "@/app/service/service-ldf";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import useChangeEmailWindow from "@/app/helper/windows-hooks/use-change-email-window";

/**
 * 회원상세 > LDF 탭
 */
const MemberDetailLDF = ({ member }) => {
  const [date, setDate] = useState(null);
  const [dataList, setDataList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [emailData, setEmailData] = useState();
  const [changeEmail, setChangeEmail] = useState();

  const {openChangeEmailWindow} = useChangeEmailWindow();

  // 조회조건
  const paginationData = usePagination();

  const getList = useCallback(async () => {
    try {
      const res = await ServiceLDF.getLdfList(member.id, {
        date,
        page: paginationData.page,
        limit: paginationData.limit,
      });
      console.log(res);
      setDataList(res.list);
      if (paginationData.totalPage === 1) {
        paginationData.setLimit(res.limit);
        paginationData.setPage(res.page);
      }

      paginationData.setTotalPage(res.totalPage)

      console.log("get List page data ::", paginationData)
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member.id, paginationData.page]);

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

    if (!item) {
      getList();
    }
  };

  const onLdfEmail = async (ldfData) => {
    console.log(ldfData)
    const sendData = {
      ldfId: ldfData.id,
      email: member.email,
      name: member.name,
      title: `[랭귀지큐브] ${member.name}님, ${ldfData.date} ${ldfData.startTime} ~ ${ldfData.endTime} 수업 내용입니다.`,
      lesson: ldfData.lesson,
      lessonDate: `${ldfData.date} ${ldfData.startTime} ~ ${ldfData.endTime}`,
      teacher: ldfData.teacherName,
      contentSp: ldfData.contentSp,
      contentV: ldfData.contentV,
      contentSg: ldfData.contentSg,
      contentC: ldfData.contentC,
    }
    
    try {
      await ServiceLDF.emailLdf(sendData);
      alert("메일이 발송되었습니다.");
    } catch (error) {
      console.error(error);
    }
  }

  const onChangeEmail = async (changeData) => {
    console.log(changeData)
    const sendData = {
      ldfId: changeData.id,
      email: member.email,
      name: member.name,
      title: `[랭귀지큐브] ${member.name}님, ${changeData.date} ${changeData.startTime} ~ ${changeData.endTime} 수업 내용입니다.`,
      lesson: changeData.lesson,
      lessonDate: `${changeData.date} ${changeData.startTime} ~ ${changeData.endTime}`,
      teacher: changeData.teacherName,
      contentSp: changeData.contentSp,
      contentV: changeData.contentV,
      contentSg: changeData.contentSg,
      contentC: changeData.contentC,
    }
    openChangeEmailWindow(sendData);
  }

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <div>
      {selectedItem ? (
        <LDFDetail 
          member={member} 
          selectedItem={selectedItem} 
          onSelectItem={onSelectItem}
          onLdfEmail={onLdfEmail}
          onChangeEmail={onChangeEmail}
        />
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

const LDFDetail = ({ member, selectedItem, onSelectItem, onLdfEmail, onChangeEmail }) => {
  const [data, setData] = useState({});

  const getLdfDetail = useCallback(async () => {
    try {
      const res = await ServiceLDF.getLdf(member.id, selectedItem.ldfId);
      console.log(res);
      setData(res);
    } catch (error) {
      console.error(error);
    }
  }, [member.id, selectedItem.ldfId]);

  const onPrint = () => {
    const content = document.getElementById('printArea').innerHTML;

    // 새 창을 열어 인쇄할 내용 설정
    const printWindow = window.open('', '', 'height=900,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>body{font-family: Arial;} table{width: 100%; border-collapse: collapse;} th, td{border: 1px solid #ddd; padding: 8px;} th{background-color: #f4f4f4;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  useEffect(() => {
    if (selectedItem.ldfId) {
      getLdfDetail();
    }
  }, [getLdfDetail, selectedItem.ldfId]);

  return (
    <div>
      <div  id="printArea">
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
                    <td dangerouslySetInnerHTML={{ __html: data?.lesson }}></td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td>{data?.date}</td>
                  </tr>
                  <tr>
                    <th>Teacher</th>
                    <td>{data?.teacherName}</td>
                  </tr>
                  <tr>
                    <th>Stress and Pronunciation</th>
                    <td dangerouslySetInnerHTML={{ __html: data?.contentSp }}></td>
                  </tr>
                  <tr>
                    <th>Vocabulary</th>
                    <td dangerouslySetInnerHTML={{ __html: data?.contentV }}></td>
                  </tr>
                  <tr>
                    <th>Sentence Structure & Grammar</th>
                    <td dangerouslySetInnerHTML={{ __html: data?.contentSg }}></td>
                  </tr>
                  <tr>
                    <th>Comment</th>
                    <td dangerouslySetInnerHTML={{ __html: data?.contentC }}></td>
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
          <Buttons className="outlined small text-center" style={{ width: 80 }} onClick={() => onPrint()}>
            프린트
          </Buttons>
          <Buttons className="outlined small text-center" style={{ width: 80 }} onClick={() => onLdfEmail(data)}>
            EMAIL
          </Buttons>
          <Buttons className="outlined small text-center" style={{ width: 80 }} onClick={() => onChangeEmail(data)}>
            주소입력
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
      <td className={
        item.attendanceStatus === "예약" ? "txt-ok-color" : 
        item.attendanceStatus === "결석" ? "txt-error" :
        item.attendanceStatus === "출석" ? "txt-secondary" : 
        ""
      }>
        {`${item.attendanceStatus || ""}`}
      </td>
      <td>
        {item.ldfId ? (
          <Buttons className="ui-button primary xsmall3" onClick={() => onSelectItem(item)}>
            확인
          </Buttons>
        ) : (
          <div>-</div>
        )}
      </td>

      <td className="txt-warning">{item?.email ? "Sent" : ""}</td>
    </tr>
  );
};

export default MemberDetailLDF;
