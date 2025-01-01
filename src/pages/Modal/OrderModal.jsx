import { useCallback, useEffect, useState } from "react";

import { TeacherType } from "@/app/api/common";
import useOrderRefundWindow from "@/app/helper/windows-hooks/use-order-refund-window";
import useOrderWindow from "@/app/helper/windows-hooks/use-order-window";
import ServiceCommon from "@/app/service/service-common";
import ServiceOrder from "@/app/service/service-order";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import dayjs from "dayjs";
import OrderTab from "./tabs/OrderTab";
import usePaymentUpdateWindow from "@/app/helper/windows-hooks/use-payment-update-window";

const refundType = [
  { key: "CANCELABLE", title: "취소 가능" },
  { key: "REFUNDABLE", title: "환불 가능" },
  { key: "REFUNDED", title: "환불 완료" },
];

/**
 *
 * @description 회원상세 > 주문 > 등록
 */
const OrderModal = () => {
  const { member, order, orderOpen, setChangeOrder, orderOpenStatus } = useOrderWindow();
  const { refundOpen, openOrderRefundWindow, setRefundState } = useOrderRefundWindow();
  const { openPaymentUpdateWindow, setNewState, updateOpen } = usePaymentUpdateWindow();

  const [payment, setPayment] = useState(false);
  const [payments, setPayments] = useState();
  const [types, setTypes] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [lessonTypes, setLessonTypes] = useState(null);
  const [products, setProducts] = useState(null);
  const [teachers, setTeachers] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [dataList, setDataList] = useState({});
  const [cardList, setCardList] = useState([]); //공통 카드목록 구현되면 추가예정
  const [selectedCount, setSelectedCount] = useState(1);

  // 결제 등록
  const [type, setType] = useState("I");
  const [cashAmount, setCashAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [receivableAmount, setReceivableAmount] = useState(0);
  const [isReceiptIssued, setIsReceiptIssued] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cards, setCards] = useState([])
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [recallDate, setRecallDate] = useState(null);
  const [paymentData, setPaymentData] = useState({
    type: type, 
    paymentDate: paymentDate,
    receivableReason: "",
  });

  const onChangeCards = (index, field, value) => {
    setCards((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      
      const updatedCards = [...prev];
      updatedCards[index] = { ...updatedCards[index], [field]: value };
      return updatedCards;
    });
  };

  const onChangeSelectedData = (data) => {
    setSelectedData((prev) => ({ ...prev, ...data }));
  };

  const getProducts = useCallback(async () => {
    try {
      if (selectedData) {
        const res = await ServiceOrder.getProducts(
      );

        setProducts(res);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [selectedData]);

  const getOrder = useCallback(async () => {
    console.log("getOrder : ", order);
    try {
      if (order.id) {
        const res = await ServiceOrder.getOneOrder(member.id, order.id);
        setDataList(res);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [member.id, order]);

  const onCreateOrder = async () => {
    if (!selectedData.teacherId) {
      alert("강사를 선택해주세요.")
      return;
    } else if (!selectedData.assistantTeacherId) {
      alert("부담임강사를 선택해주세요.")
      return;
    }

    try {
      const saveData = {
        ...selectedData,
        ...selectedData.product,
        productId: selectedData.product.id,
        billingAmount: selectedData?.billingAmount || selectedData.product.price,
        ...(order?.id && { orderId: order.id}),
      };

      delete saveData.product;
      const changeOrder = await ServiceOrder.createOrder(member.id, saveData);
      setChangeOrder({id: changeOrder.orderId});
      
      // if (!order?.id) {
      //   window.close();
      // }
    } catch (error) {
      console.error(error.message);
    }
  };

  const refundCheck = async(data) => {
    const res = await ServiceOrder.getPayments(member.id, order.id);

    if (res.paymentAmount == 0) {
      openOrderRefundWindow({memberId: member.id, orderId: order.id, orderProductId: data.id, orderInfo: data})
    } else {
      alert("결제 금액이 남아있습니다.");
      return;
    }
  }

  const onRefund = async (orderProductId, type) => {
    try {
      switch (type) {
        case refundType[0].key:
          await ServiceOrder.cancelOrder(member.id, order.id, orderProductId);
          await getOrder();
          window.close();
          break;
        case refundType[1].key: {
          const saveData = { refundDate: dayjs().format("YYYY-MM-DD") };
          await ServiceOrder.refund(member.id, order.id, orderProductId, saveData);
          await getOrder();
          break;
        }
        case refundType[2].key:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onReload = () => {
    getPayments();
    setCashAmount(0);
    setDepositAmount(0);
    setCards(
      Array.from({ length: selectedCount }, () => ({
        amount: 0,
        code: "",
        cardNumber: "",
        installmentMonths: 0,
        approvalNumber: ""
      }))
    );
    setPaymentData({
      type: type,
      paymentDate: paymentDate,
      receivableReason: "",
    });
    setRecallDate(null);
  }

  const getPayments = async () => {
    const res = await ServiceOrder.getPayments(member.id, order.id);
    setPayments(res);
  }

  const changePayCount = (value) => {
    setSelectedCount(Number(value));
  }

  const onChangePaymentData = (data) => {
    if (data.receiptNumber) {
      data.receiptNumber = formatPhoneNumber(data.receiptNumber)
    }

    if (data.paymentDate) {
      data.paymentDate = dayjs(data.paymentDate).format('YYYY-MM-DD');
    }

    if (data.recallDate) {
      const formattedDate = dayjs(data.recallDate).format('YYYY-MM-DD')
      if (dayjs(formattedDate).isBefore(dayjs(), 'day')) {
        alert('당일부터 선택 가능합니다.');
        setRecallDate(null);
        return;
      } else {
        data.recallDate = formattedDate;
      }
      
    }
    
    setPaymentData((prev) => ({ ...prev, ...data }));
  }

  const init = useCallback(async () => {
    try {
      const typesRes = await ServiceOrder.getProductTypesList();
      const languagesRes = await ServiceOrder.getProductLanguagesList();
      const lessonTypesRes = await ServiceOrder.getProductLessonTypesList();
      const teachersRes = await ServiceTeacher.getTeacherOptionsList({
        fields: TeacherType[0].id,
      });
      const productRes = await ServiceOrder.getProducts(
      //   {
      //   type: typesRes.types[0].value,
      //   language: languagesRes.languages[0].value,
      //   lessonType: lessonTypesRes.lessonTypes[0].value,
      // }
      );
      const cardRes = await ServiceCommon.getCodeGroup(300);
      setTypes(typesRes.types);
      setLanguages(languagesRes.languages);
      setLessonTypes(lessonTypesRes.lessonTypes);
      setTeachers(teachersRes.teachers);
      setSelectedData({
        type: "CURRICULUM",
        // language: languagesRes.languages[0].value,
        // lessonType: lessonTypesRes.lessonTypes[0].value,
        product: productRes[0],
        months: 3,
      });
      setCardList(cardRes);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const PaymentUpdateModal = async (data) => {
    const paymentInfo = await ServiceOrder.getPaymentDetail(member.id, order.id, data.payment.id);
    const addPaymentInfo = {
      ...paymentInfo,
      memberId: member.id,
      orderId: order.id,
      paymentId: data.id,
      cards: cardList,
      paymentMethod: data.payment.paymentMethod,
      cardCompany: data.payment.code,
    }
    
    openPaymentUpdateWindow(addPaymentInfo);
  }

  const calculateReceivableAmount = useCallback(() => {
    const totalCardAmount = getTotalCardAmount();

    return (payments?.receivableAmount || 0) - cashAmount - depositAmount - totalCardAmount;
  }, [payments, cashAmount, depositAmount, cards]);

  const createPayment = async() => {
    const totalCardAmount = getTotalCardAmount();
    if(cashAmount === 0 && depositAmount === 0 && totalCardAmount === 0) {
      alert("한 가지 이상의 결제방식으로 금액을 등록하세요.")
      return;
    } else {
      if (paymentData.receivableAmount > 0 && (!paymentData.recallDate || !paymentData.receivableReason)) {
        alert("회수예정일과 미수금사유를 입력해주세요.")
        return;
      }

      if (paymentData.cards) {
        for (const card of paymentData.cards) {
          if (card.amount && !card.approvalNumber) {
            alert("승인번호를 입력해주세요.");
            return;
          }
        }
      }
      
      if(confirm("아래와 같이 납부하시겠습니까?")) {
        await ServiceOrder.postPayments(member.id, order.id, paymentData);
        onReload();
        getOrder();
      }
    }
  }

  const getTotalCardAmount = () => {
    return cards.reduce((total, card) => total + (Number(card.amount) || 0), 0);
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');

    // 10자리 또는 11자리 숫자에 따라 형식 지정
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3').trim();
    }
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3').trim();
  };

  const cancelPayment = async (data) => {
    if(confirm("취소하시겠습니까?")) {
      await ServiceOrder.cancelPayment(member.id, order.id, data.id);
      getPayments();
    }
    
  }

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    getOrder();
  }, [getOrder, getProducts]);

  useEffect(() => {
    const newReceivableAmount = calculateReceivableAmount();
    setReceivableAmount(newReceivableAmount);
    onChangePaymentData({ receivableAmount: newReceivableAmount });
  }, [payments, cashAmount, depositAmount, cards, calculateReceivableAmount]);

  useEffect(() => {
    if (isReceiptIssued) {
      setPhoneNumber(formatPhoneNumber(member.cellPhone) || '');
    } else {
      setPhoneNumber('010-000-1234');
    }
  }, [isReceiptIssued, member.cellPhone]);

  useEffect(() => {
    setCards(
      Array.from({ length: selectedCount }, () => ({
        amount: 0,
        code: "",
        cardNumber: "",
        installmentMonths: 0,
        approvalNumber: ""
      }))
    );
  }, [selectedCount]);

  useEffect(() => {
    onChangePaymentData({ cards: cards });
  }, [cards]);

  useEffect(() => {
    if (updateOpen) {
      getPayments();
      setNewState(false);
    }
  }, [updateOpen, setNewState])

  useEffect(() => {
    if (refundOpen) {
      getOrder();
      getPayments();
      setRefundState(false);
    }
  })

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      orderOpenStatus(true);
      event.preventDefault();
    }

    // window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <div className="ui-sub-title sticky-tabs">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{`주문등록 - ${member.name}`}</div>
            <small>{`(${member.email})`}</small>
          </div>
        </div>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">주문정보</div>
          </div>
        </div>

        <div className="txt-error-deep">* 삭제는 주문 당일만 가능합니다.</div>
      </div>

      <div className="ui-info-table sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 60 }} />
            <col style={{ width: 50 }} />
            <col style={{ width: 60 }} />
            <col style={{ width: 300 }} />
            <col />
            {/* <col /> */}
            <col />
            <col />
            <col style={{ width: 130 }} />
            <col style={{ width: 100 }} />
          </colgroup>

          <thead>
            <tr>
              <th>분류</th>
              <th>No</th>
              <th>구분</th>
              <th>상품명</th>
              <th>공급가액</th>
              {/* <th>할인액</th> */}
              <th>실청구금액</th>
              <th>환불금액</th>
              <th>주문일시</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {dataList?.orderProducts?.map((order, index) => (
              <tr key={`${order.id}`} className="text-center">
                <td>{order.productType === 'Y' ? '과정' : ""}</td>
                <td>{index + 1}</td>
                <td>{order.orderType}</td>
                <td className="text-left">{order.productName}/{order.months}개월/{order.quantity}회</td>
                <td className="text-right">{order.amount?.toLocaleString() || 0}</td>
                {/* <td className="text-right txt-secondary">
                  {order.discountAmount?.toLocaleString()}
                </td> */}
                <td className="text-right txt-green-light">
                  {order.billingAmount?.toLocaleString()}
                </td>
                <td className="text-right txt-green-light">
                  {order.refundAmount?.toLocaleString()}
                </td>
                <td>{order.createdOn}</td>
                <td>
                  {order.refundType !== refundType[2].key ? (
                    <div>
                      {order.refundType === refundType[0].key && (
                        <Buttons
                          type="button"
                          className="outlined xsmall bgc-white"
                          onClick={() => onRefund(order.id, refundType[0].key)}
                        >
                          취소
                        </Buttons>
                      )}
                      {order.refundType === refundType[1].key && (
                        <Buttons
                          type="button"
                          className="outlined xsmall bgc-white"
                          onClick={() =>
                            refundCheck(order)
                          }
                        >
                          환불
                        </Buttons>
                      )}
                    </div>
                  ) : (
                    <div>환불처리</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="text-center bgc-grey200">
              <td colSpan={4}>
                <strong className="b">합계</strong>
              </td>
              <td className="text-right">
                <strong className="b">{dataList.supplyAmount?.toLocaleString()}</strong>
              </td>
              {/* <td className="text-right txt-secondary">
                <strong className="b">{dataList.discountAmount?.toLocaleString()}</strong>
              </td> */}
              <td className="text-right txt-green-light">
                <strong className="b">{dataList.billingAmount?.toLocaleString()}</strong>
              </td>
              <td className="text-right txt-green-light">
                <strong className="b">{dataList.refundAmount?.toLocaleString()}</strong>
              </td>
              <td>
                <strong className="b">-</strong>
              </td>
              <td>
                <div className="flex gap">
                  <Buttons
                    type="button"
                    className="outlined xsmall bgc-white"
                    onClick={() => {setPayment(() => true); getPayments();}}
                  >
                    결제
                  </Buttons>
                  <Buttons
                    type="button"
                    className="outlined xsmall bgc-white"
                    onClick={() => setPayment(() => false)}
                  >
                    추가
                  </Buttons>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {!payment && (
        <div className="sp-mt-20">
          <OrderTab
            selectedData={selectedData}
            types={types}
            languages={languages}
            lessonTypes={lessonTypes}
            products={products}
            teachers={teachers}
            onChangeSelectedData={onChangeSelectedData}
          />
          <div className="flexCenter sp-mt-30">
            <Buttons className="primary mid" onClick={onCreateOrder}>
              주문등록
            </Buttons>
          </div>
        </div>
      )}

      {payment && (
        <div>
          <div className="sp-mt-20">
            <div className="ui-sub-title small has-bg sp-mt-20">
              <div className="title">
                <div className="tit-wrap">
                  <div className="tit">결제내역</div>
                </div>
              </div>

              <Buttons className="outlined xsmall2 bgc-white" onClick={() => onReload()}>새로고침</Buttons>
            </div>

            <div className="ui-info-table txt-mid another sp-mt-5" style={{ whiteSpace: "nowrap" }}>
              <table>
                <colgroup>
                  <col style={{ width: 150 }} />
                  <col style={{ width: 110 }} />
                  <col />
                  <col style={{ width: 100 }} />
                  <col style={{ width: 100 }} />
                  <col />
                  <col />
                  <col style={{ width: 150 }} />
                  <col />
                  <col style={{ width: 100 }} />
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>결제일</th>
                    <th>결제구분</th>
                    <th>결제방식</th>
                    <th>결제금액</th>
                    <th>예금자명</th>
                    <th>카드사</th>
                    <th>카드번호</th>
                    <th>카드할부</th>
                    <th>카드승인번호</th>
                    <th>결제메모</th>
                    <th>처리자</th>
                    <th>취소처리</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {payments?.payments.map((payment, index) => (
                    <tr>
                      <td>{payment.id}</td>
                      <td>{payment.paymentDate}</td>
                      <td>
                        <strong className="b txt-primary">{payment.type}</strong>
                      </td>
                      <td>{payment.paymentMethod}</td>
                      <td className="text-right">{payment.paymentAmount.toLocaleString()}</td>
                      <td>{payment.accountHolder}</td>
                      <td>{payment.codeName}</td>
                      <td>{payment.cardNumber}</td>
                      <td>{payment.installmentMonthsLabel}</td>
                      <td>{payment.approvalNumber}</td>
                      <td>{payment.memo}</td>
                      <td>{payment.modifierName}</td>
                      <td>
                        {payment.isCancelable && (
                          <Buttons type="button" className="outlined xsmall bgc-white" onClick={() => cancelPayment(payment)}>
                            취소
                          </Buttons>
                        )}
                      </td>
                      <td>
                        <Buttons type="button" className="outlined xsmall bgc-white" onClick={() => {PaymentUpdateModal({payment})}}>
                          수정
                        </Buttons>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bgc-grey200">
                    <td colSpan={3}>
                      <strong className="b">합계</strong>
                    </td>
                    <td className="text-right">
                      <strong className="b">{payments?.paymentAmount.toLocaleString()}</strong>
                    </td>
                    <td colSpan={10}>
                      실청구금액 : <strong className="b">{payments?.billingAmount.toLocaleString()}</strong> 원 - 결제금액 :{" "}
                      <strong className="b">{payments?.paymentAmount.toLocaleString()}</strong> 원 - 환불금액 :{" "}
                      <strong className="b">{payments?.refundAmount.toLocaleString()}</strong> 원 = 미수금액 :{" "}
                      <strong className="b">{payments?.receivableAmount.toLocaleString()}</strong> 원
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="sp-mt-20">
            <div className="ui-sub-title small has-bg sp-mt-20">
              <div className="title">
                <div className="tit-wrap">
                  <div className="tit">환불내역</div>
                </div>
              </div>

              <Buttons className="outlined xsmall2 bgc-white" onClick={() => onReload()}>새로고침</Buttons>
            </div>

            <div className="ui-info-table txt-mid another sp-mt-5" style={{ whiteSpace: "nowrap" }}>
              <table>
                <colgroup>
                  <col style={{ width: 150 }} />
                  <col style={{ width: 110 }} />
                  <col style={{ width: 220 }} />
                  <col style={{ width: 100 }} />
                  <col style={{ width: 100 }} />
                  <col />
                  <col />
                  <col style={{ width: 100 }} />
                  <col />
                  <col style={{ width: 100 }} />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>환불일</th>
                    <th>상품명</th>
                    <th>환불금액</th>
                    <th>카드금액</th>
                    <th>현금금액</th>
                    <th>계좌이체금액</th>
                    <th>은행명</th>
                    <th>계좌번호</th>
                    <th>환불사유</th>
                    <th>처리자</th>
                    <th>취소처리</th>
                  </tr>
                </thead>
                <tbody>
                  {payments?.refunds.map((refund, index) => (
                    <tr>
                      <td>{refund.id}</td>
                      <td>{refund.refundDate}</td>
                      <td>{refund.orderProductName}</td>
                      <td className="text-right">{refund.refundAmount.toLocaleString()}</td>
                      <td>{refund.cardAmount.toLocaleString()}</td>
                      <td>{refund.cashAmount.toLocaleString()}</td>
                      <td>{refund.depositAmount.toLocaleString()}</td>
                      <td>{refund.bank}</td>
                      <td>{refund.accountNumbeer}</td>
                      <td>{refund.refundReason}</td>
                      <td>{refund.modifierName}</td>
                      <td>
                        <Buttons type="button" className="outlined xsmall bgc-white" onClick={() => cancelPayment(refund)}>
                          취소
                        </Buttons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sp-mt-20">
            <div className="ui-sub-title small has-bg sp-mt-20">
              <div className="title">
                <div className="tit-wrap">
                  <div className="tit">결제등록</div>
                </div>
              </div>
            </div>

            <div className="ui-info-table th-left sp-mt-5">
              <table className="fixed">
                <colgroup>
                  <col style={{ width: 160 }} />
                  <col />
                  <col style={{ width: 160 }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>청구금액</th>
                    <td>
                      <div className="flexYCenter gap-10">
                        <button className="ui-select">
                          <select 
                            className="input-init" 
                            value={type}
                            onChange={(e) => {setType(e.target.value), onChangePaymentData({type: e.target.value})}}
                          >
                            <option value="I">신규</option>
                            <option value="P">회수</option>
                            <option value="T">변경</option>
                          </select>
                        </button>

                        <div className="flexYCenter gap">
                          <strong className="b txt-error">{payments?.receivableAmount.toLocaleString()}</strong>
                          <span>원</span>
                        </div>
                      </div>
                    </td>
                    <th>결제일</th>
                    <td>
                      <div className="ui-datepicker-wrap size" style={{ width: 150 }}>
                        <DatePicker
                          selected={paymentDate}
                          onChange={(e) => {setPaymentDate(e); onChangePaymentData({paymentDate: e})}}
                        >
                        </DatePicker>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>현금수입</th>
                    <td>
                      <div className="flexYCenter gap">
                        <input 
                          type="text" 
                          className="input-init" 
                          style={{ width: 150 }} 
                          value={Number(cashAmount).toLocaleString()} 
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                            setCashAmount(numericValue);
                            onChangePaymentData({cashAmount: numericValue});
                          }}
                        />
                        <div>원</div>
                      </div>
                    </td>
                    <th>현금영수증발행</th>
                    <td>
                      <div className="flexYCenter gap-20">
                        <div className="ui-radio-group size-small gap">
                          {["Y", "N"].map((el, i) => {
                            return (
                              <div key={i}>
                                <input 
                                  type="radio"
                                  id={`${el}-${i}`} 
                                  value={el} 
                                  checked={isReceiptIssued ? el === 'Y' : el === 'N'}
                                  onChange={(e) => {setIsReceiptIssued(el==='Y'); onChangePaymentData({isReceiptIssued: e.target.value === 'Y'})}} 
                                  name="test1" 
                                />
                                <label htmlFor={`${el}-${i}`}>{el}</label>
                              </div>
                            );
                          })}
                        </div>

                        <input
                          type="text"
                          className="input-init"
                          style={{ width: 100 }}
                          value={formatPhoneNumber(phoneNumber)}
                          onChange={(e) => {setPhoneNumber(e.target.value); onChangePaymentData({receiptNumber: e.target.value})}}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>보통예금</th>
                    <td>
                      <div className="flexYCenter gap">
                        <input 
                          type="text" 
                          className="input-init" 
                          style={{ width: 150 }} 
                          value={Number(depositAmount).toLocaleString()} 
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                            setDepositAmount(numericValue);
                            onChangePaymentData({depositAmount: numericValue});
                          }}
                        />
                        <div>원</div>
                      </div>
                    </td>
                    <th>예금자명</th>
                    <td>
                      <input 
                        type="text" 
                        className="input-init" 
                        style={{ width: 187 }} 
                        onChange={(e) => {onChangePaymentData({accountHolder: e.target.value})}}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div className="flexYCenter gap-10">
                        <div>신용카드</div>
                        <div>
                          <button className="ui-select">
                            <select className="input-init" value={selectedCount} onChange={(e) => changePayCount(e.target.value)}>
                              {Array.from({ length: 10 }, (_, i) => (
                                <option key={i} value={i+1}>{i+1}개</option>
                              ))}
                            </select>
                          </button>
                        </div>
                      </div>
                    </th>
                    <td colSpan={3}>
                      <table className="fixed" style={{ width: 618 }}>
                        <thead>
                          <tr>
                            <th className="text-center">금액</th>
                            <th className="text-center">카드종류</th>
                            <th className="text-center">카드번호</th>
                            <th className="text-center">할부개월수</th>
                            <th className="text-center">승인번호</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                          Array.from({ length: selectedCount}, (_, i) => (
                          <tr>
                            <td>
                              <div className="flexYCenter gap">
                                <input 
                                  type="text" 
                                  className="input-init full" 
                                  value={Number(cards[i]?.amount).toLocaleString() || 0}
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                    onChangeCards(i, 'amount', numericValue);
                                  }}
                                />
                                <div>원</div>
                              </div>
                            </td>
                            <td>
                              <button className="ui-select full">
                                <select 
                                  className="input-init" 
                                  value={cards[i]?.code} 
                                  onChange={(e) => onChangeCards(i, 'code', e.target.value)}
                                >
                                  <option value="">-선택-</option>
                                  {cardList.map((card) => (
                                    <option key={card.code} value={card.code}>{card.name}</option>
                                  ))}
                                </select>
                              </button>
                            </td>
                            <td>
                              <input 
                                type="text" 
                                className="input-init full text-left" 
                                value={cards[i]?.cardNumber}
                                onChange={(e) => onChangeCards(i, 'cardNumber', e.target.value)}
                              />
                            </td>
                            <td>
                              <button className="ui-select full">
                                <select 
                                  className="input-init"
                                  value={cards[i]?.installmentMonths}
                                  onChange={(e) => onChangeCards(i, 'installmentMonths', e.target.value)}
                                >
                                  <option value>-선택-</option>
                                  <option key={0} value={0}>일시불</option>
                                  <option key={2} value={2}>2개월</option>
                                  <option key={3} value={3}>3개월</option>
                                  <option key={4} value={4}>4개월</option>
                                  <option key={5} value={5}>5개월</option>
                                  <option key={6} value={6}>6개월</option>
                                  <option key={10} value={10}>10개월</option>
                                  <option key={12} value={12}>12개월</option>
                                </select>
                              </button>
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="input-init full text-left" 
                                value={cards[i]?.approvalNumber}
                                onChange={(e) => onChangeCards(i, 'approvalNumber', e.target.value)}
                              />
                            </td>
                          </tr>
                          ))
                        }
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <th>미수금액</th>
                    <td>
                      <div className="flexYCenter gap-20">
                        <div className="flexYCenter gap">
                          <input type="text" className="input-init" style={{ width: 150 }} readOnly value={Number(receivableAmount).toLocaleString()}/>
                          <div>원</div>
                        </div>
                        <div className="flexYCenter gap">
                          <input type="checkbox" className="input-init" id="test2" />
                          <label htmlFor="test2">전액미수금</label>
                        </div>
                      </div>
                    </td>
                    <th>회수예정일</th>
                    <td>
                      <div className="ui-datepicker-wrap size" style={{ width: 150 }}>
                        <DatePicker
                          selected={recallDate}
                          onChange={(e) => {setRecallDate(e); onChangePaymentData({recallDate: e})}}
                        >
                        </DatePicker>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>미수금사유</th>
                    <td colSpan={3}>
                      <textarea 
                        className="input-init full" 
                        rows="2" 
                        value={paymentData?.receivableReason}
                        onChange={(e) => onChangePaymentData({receivableReason: e.target.value})}
                      >
                      </textarea>
                    </td>
                  </tr>
                  <tr>
                    <th>결제메모</th>
                    <td colSpan={3}>
                      <textarea 
                        className="input-init full" 
                        rows="2"
                        onChange={(e) => onChangePaymentData({memo: e.target.value})}
                      >
                      </textarea>
                    </td>
                  </tr>
                  {/* <tr>
                    <th>계산서발행</th>
                    <td colSpan={3}>
                      <div className="ui-radio-group size-small gap">
                        {["Y", "N"].map((el, i) => {
                          return (
                            <div key={i}>
                              <input type="radio" id={`${el}-${i}`} value={el} name="test3" />
                              <label htmlFor={`${el}-${i}`}>{el}</label>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
            <div className="flexCenter sp-mt-30">
              <Buttons className="primary mid" type="submit" onClick={createPayment}>
                결제등록
              </Buttons>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderModal;
