import useOrderRefundWindow from "@/app/helper/windows-hooks/use-order-refund-window";
import DatePicker from "@/components/DatePicker";
import Buttons from "@/components/Buttons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import ServiceOrder from "@/app/service/service-order";

//환불 모달
const OrderRefundModal = () => {
  const { ids, refundOpen, setRefundState } = useOrderRefundWindow();
  const [cardAmount, setCardAmount] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const [refundData, setRefundData] = useState({
    refundDate: dayjs(new Date()).format("YYYY-MM-DD")
  });
  const [refundDate, setRefundDate] = useState(new Date());

  const handleRefundData = (data) => {
    if (data?.refundDate) {
     data.refundDate = dayjs(data.refundDate).format("YYYY-MM-DD");
    }
    setRefundData((prev) => ({...prev, ...data}));
  }

  const createRefund = async(data) => {
    const amount = Number(data?.cardAmount || 0) 
                  + Number(data?.cashAmount || 0) 
                  + Number(data?.depositAmount || 0);

    if (Number(data?.depositAmount) > 0 && !data?.bank && !data?.accountNumber) {
      alert("은행명과 계좌번호를 입력해주세요.")
      return;
    }
    
    if (amount == 0) {
      alert("환불 금액을 입력해주세요.")
      return;
    } else if (amount > ids?.orderInfo.billingAmount) {
      alert("환불 금액이 맞지 않습니다.")
      return;
    } else {
      if (!data?.refundReason) {
        alert("환불사유를 입력해주세요.")
        return;
      }
      try {
        await ServiceOrder.refund(ids.memberId, ids.orderId, ids.orderProductId, refundData);
        setRefundState(true);
        window.close();
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <div className="ui-sub-title sticky-tabs">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">환불내역</div>
          </div>
        </div>
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
              <th>No</th>
              <th>환불일</th>
              <th>상품명</th>
              <th>카드금액</th>
              <th>현금금액</th>
              <th>계좌이체금액</th>
              <th>은행명</th>
              <th>계좌번호</th>
              <th>환불사유</th>
              <th>처리자</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={10}>환불내역이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sp-mt-20">
        <div className="ui-sub-title small has-bg sp-mt-20">
          <div className="title">
            <div className="tit-wrap">
              <div className="tit">환불등록</div>
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
                <th>상품명</th>
                <td>{ids?.orderInfo?.name}</td>
                <th>환불일</th>
                <td>
                  <div className="ui-datepicker-wrap size" style={{ width: 150 }}>
                    <DatePicker
                      selected={refundDate}
                      onChange={(e) => {handleRefundData({refundDate: e}); setRefundDate(e)}}
                    >
                    </DatePicker>
                  </div>
                </td>
              </tr>
              <tr>
                <th>카드환불</th>
                <td>
                  <div className="flexYCenter gap">
                    <input 
                      type="text" 
                      className="input-init" 
                      style={{ width: 150 }}
                      value={Number(cardAmount).toLocaleString()}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        setCardAmount(numericValue);
                        handleRefundData({cardAmount: numericValue}
                      )}}
                    />
                    <div>원</div>
                  </div>
                </td>
                <th>현금환불</th>
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
                        handleRefundData({cashAmount: numericValue}
                        )}}
                    />
                    <div>원</div>
                  </div>
                </td>
              </tr>
              <tr>
                <th>계좌이체</th>
                <td>
                  <div className="flexYCenter gap">
                    <input 
                      type="text" 
                      className="input-init" 
                      style={{ width: 150 }} 
                      value={Number(depositAmount).toLocaleString()}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        setDepositAmount(numericValue)
                        handleRefundData({depositAmount: numericValue}
                        )}}
                    />
                    <div>원</div>
                  </div>
                </td>
                <th>은행명/계좌번호</th>
                <td>
                  <div className="flexYCenter gap">
                    <input 
                      type="text" 
                      className="input-init" 
                      style={{ width: 150 }} 
                      onChange={(e) => handleRefundData({bank: e.target.value})}
                    />
                    /
                    <input 
                      type="number" 
                      className="input-init" 
                      style={{ width: 150 }} 
                      onChange={(e) => handleRefundData({accountNumber: e.target.value})}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>환불사유</th>
                <td colSpan={3}>
                  <textarea 
                    className="input-init full" 
                    rows="2"
                    onChange={(e) => handleRefundData({refundReason: e.target.value})}
                  >
                  </textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flexCenter sp-mt-30">
        <Buttons className="primary mid" onClick={() => createRefund(refundData)}>환불등록</Buttons>
      </div>
    </div>
  );
};

export default OrderRefundModal;
