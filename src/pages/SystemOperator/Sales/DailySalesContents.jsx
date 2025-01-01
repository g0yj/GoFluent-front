import { useCallback, useEffect, useRef, useState } from "react";
import { useCollapse } from "react-collapsed";
import { NavLink } from "react-router-dom";

import useOrderWindow from "@/app/helper/windows-hooks/use-order-window";
import ServiceOrder from "@/app/service/service-order";
import ServiceMember from "@/app/service/service-members";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";

const DailySalesContents = () => {
    const [isExpanded, setExpanded] = useState(true);
    const { getCollapseProps } = useCollapse({ isExpanded });
    const { openOrderWindow } = useOrderWindow(); //주문등록 모달
  
    const [searchData, setSearchData] = useState({
      dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      dateTo: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      creatorName: '',
    });
    const [data, setData] = useState(null);
  
    const onChangeSearchData = (data) => {
      setSearchData((prev) => ({ ...prev, ...data }));
    };
  
    const onItemClick = async(id, order) => {
        const userInfo = await ServiceMember.get(id)
      openOrderWindow(userInfo, order);
    };
  
    const maskAccountNumber = (text) => {
      if (text) {
        // const maskedNumber = text.slice(0, 3) + "*".repeat(text.length - 6) + text.slice(-3);
        const maskedNumber = text.slice(0, 3) + "*".repeat(text.length - 2) + text.slice(-3);
        return maskedNumber;
      } else {
        return text;
      }
    };
  
    // 캘린더 버튼 클릭 기능들
    const onClickCalendarClearBtn = () => {
      onChangeSearchData({ dateFrom: null, dateTo: null });
    };
    const onClickCalendarThisMonthBtn = () => {
      const now = new Date();
      onChangeSearchData({
        dateFrom: new Date(now.getFullYear(), now.getMonth(), 1),
        dateTo: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      });
    };
    const onClickCalendarPrevMonthBtn = () => {
      const now = new Date();
      onChangeSearchData({
        dateFrom: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        dateTo: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      });
    };
    const onClickCalendarThisYearBtn = () => {
      const now = new Date();
      onChangeSearchData({
        dateFrom: new Date(now.getFullYear(), 0, 1),
        dateTo: new Date(now.getFullYear(), 11, 31),
      });
    };

    const printRef = useRef(null);
    const print = useReactToPrint({
      content: () => printRef.current,
      pageStyle: `
        @media print {
          body { zoom: 0.6; }  /* 페이지 크기를 줄이는 설정, 숫자는 조정 가능 */
          table { page-break-inside: avoid; } /* 테이블이 페이지 중간에서 잘리지 않도록 */
          tr, td, th { page-break-inside: avoid; }
        }
      `,
    })

    const clickPrint = () => {
      print();
    }
  
    const onClickSearchBtn = async () => {
      await getData();
    };
  
    const getData = useCallback(async () => {
      try {
        const saveData = {
          ...searchData,
          dateFrom: dayjs(searchData.dateFrom).format("YYYY-MM-DD"),
          dateTo: dayjs(searchData.dateTo).format("YYYY-MM-DD"),
        };

        const res = await ServiceOrder.getCalculates(saveData);
        setData(res);
      } catch (error) {
        console.error(error.message);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData?.dateFrom, searchData?.dateTo, searchData?.creatorName]);
  
    const paymentAmountTotal = () => {
      return data?.summaries.reduce((acc, cur) => acc + cur.paymentAmount, 0).toLocaleString();
    };
    const refundAmountTotal = () => {
      return data?.summaries.reduce((acc, cur) => acc + cur.refundAmount, 0).toLocaleString();
    };
  
    const onBeforeDayClick = () => {
      const dateFrom = dayjs(searchData?.dateFrom).subtract(1, "day").toDate();
      const dateTo = dayjs(searchData?.dateTo).subtract(1, "day").toDate();
      onChangeSearchData({ dateFrom, dateTo });
    };
    const onNextDayClick = () => {
      const dateFrom = dayjs(searchData?.dateFrom).add(1, "day").toDate();
      const dateTo = dayjs(searchData?.dateTo).add(1, "day").toDate();
      onChangeSearchData({ dateFrom, dateTo });
    };

    useEffect(() => {
        getData();
    }, [searchData?.dateFrom]);
  
    return (
      <>
        <section className="ui-contents-wrap mid-width flex1">
          <div className="ui-contents-inner">
            <div className="ui-location-wrap">
              <div className="ui-location-title">일일 정산관리</div>
              <div className="ui-location">
                <NavLink>
                  <i className="fa-solid fa-house"></i>
                </NavLink>
                <i className="fa-solid fa-caret-right"></i>
                <strong>일일정산관리</strong>
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
                    <th>결제기간</th>
                    <td colSpan="3">
                      <div className="flexYCenter gap">
                        <div className="ui-datepicker-wrap">
                          <div>
                            <DatePicker
                              selected={searchData?.dateFrom}
                              onChange={(date) => onChangeSearchData({ dateFrom: date, dateTo: date })}
                              selectStart
                            />
                          </div>
                        </div>
  
                        <div className="flexYCenter gap">
                          <Buttons className="ui-button outlined xsmall" onClick={onBeforeDayClick}>
                            <i className="fa-solid fa-caret-left txt-primary"></i>
                          </Buttons>
                          <Buttons className="ui-button outlined xsmall" onClick={onNextDayClick}>
                            <i className="fa-solid fa-caret-right txt-primary"></i>
                          </Buttons>
                        </div>
                        {/* 
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
                        </Buttons> */}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>검색</th>
                    <td colSpan="3">
                      <div className="flexYCenter gap">
                        <input
                          type="text"
                          className="input-init"
                          placeholder="검색"
                          value={searchData?.creatorName}
                          onChange={({ target: { value } }) => onChangeSearchData({ creatorName: value })}
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
  
            <div className="layout-between sp-mt-20">
              <div className="ml-auto gap-s">
                <Buttons className="outlined mid" onClick={() => clickPrint()}>인쇄</Buttons>
              </div>
            </div>
  
            <div ref={printRef} className="sp-mt-20">
              <div className="ui-info-table txt-mid another">
                <table>
                  <colgroup>
                    <col style={{ width: 70 }} />
                    <col style={{ width: 180 }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>처리자</th>
                      <th>매출액</th>
                      <th>환불금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.summaries?.map((item, index) => (
                      <tr key={item.creatorName}>
                        <td>{index+1}</td>
                        <td>{item.creatorName}</td>
                        <td className="text-right">{item.paymentAmount.toLocaleString()} 원</td>
                        <td className="text-right">{item.refundAmount.toLocaleString()} 원</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bgc-grey300">
                      <td colSpan={2}>
                        <strong className="b">합계</strong>
                      </td>
                      <td className="text-right">
                        <strong className="b">{paymentAmountTotal()} 원</strong>
                      </td>
                      <td className="text-right">
                        <strong className="b">{refundAmountTotal()} 원</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
  
              <div className="sp-mt-10">
                {data?.orders?.map((item) => {
                  return (
                    <div className="ui-info-table txt-mid another section">
                      <table>
                        <colgroup>
                          <col style={{ width: 100 }} />
                          <col style={{ width: 150 }} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>처리자</th>
                            <th>주문일시</th>
                            <th colSpan={3}>상품명</th>
                            <th>주문자</th>
                            <th>주문액</th>
                            <th>매출액</th>
                            <th>환불금액</th>
                            <th>미수금액</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{item.creatorName}</td>
                            <td>{item.createdOn}</td>
                            <td colSpan={3}>
                              <Buttons
                                className="ui-link secondary-high ui-ellipsis"
                                style={{ maxWidth: 220 }}
                                onClick={() => onItemClick(item.userId, item)}
                              >
                                {item.orderProductName}
                              </Buttons>
                            </td>
                            <td>{item.userName}</td>
                            <td className="text-right txt-secondary">
                              {item.billingAmount.toLocaleString()}
                            </td>
                            <td className="text-right txt-pink">
                              {item.paymentAmount.toLocaleString()}
                            </td>
                            <td className="text-right txt-green-light">
                              {item.refundAmount.toLocaleString()}
                            </td>
                            <td className="text-right txt-red">
                              {item.receivableAmount.toLocaleString()}
                            </td>
                          </tr>
                          <tr>
                            <th>처리자</th>
                            <th>결제일시</th>
                            <th>구분</th>
                            <th>거래처명</th>
                            <th>할부개월</th>
                            <th colSpan={2}>카드번호</th>
                            <th>매출액</th>
                            <th>환불금액</th>
                            <th></th>
                          </tr>
                          {item.payments?.map((payment, index) => (
                            <tr key={index}>
                              <td>{payment.creatorName}</td>
                              <td>{payment.createdOn}</td>
                              <td>{payment.orderType}</td>
                              <td>{payment.transactionName}</td>
                              <td>
                                {payment.installmentMonths === null
                                  ? "일시불"
                                  : payment.installmentMonths}
                              </td>
                              <td colSpan={2}>{maskAccountNumber(payment.cardNumber)}</td>
                              <td className="text-right txt-pink">
                                {payment.paymentAmount.toLocaleString()}
                              </td>
                              <td className="text-right txt-green-light">
                                {payment.refundAmount.toLocaleString()}
                              </td>
                              <td className="text-right txt-red"></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </>
    );
};

export default DailySalesContents;