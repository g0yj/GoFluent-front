import useOrderWindow from "@/app/helper/windows-hooks/use-order-window";
import ServiceOrder from "@/app/service/service-order";
import Buttons from "@/components/Buttons";
import { numberCurrency } from "@/utils/number";
import { useCallback, useEffect, useState } from "react";

/**
 * 회원상세 > 주문 탭
 */
const MemberDetailOrder = ({ member }) => {
  const [orderList, setOrderList] = useState(null);

  const { openOrderWindow, orderOpen, orderOpenStatus } = useOrderWindow();

  const onTitlePress = (order) => {
    console.log("order ==>", order);
    openOrderWindow(member, order);
  };

  const init = useCallback(async () => {
    try {
      const res = await ServiceOrder.getOrderList(member.id);
      setOrderList(res.order);
    } catch (error) {
      console.error(error.message);
    }
  }, [member.id]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (orderOpen) {
      init();
      orderOpenStatus(false);
    }
  }, [orderOpen, orderOpenStatus])

  return (
    <div>
      <div className="ui-sub-title sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{member.name}</div>
            <small>({member.email})</small>
          </div>
        </div>

        <div>
          <Buttons className="primary small" onClick={() => openOrderWindow(member)}>
            등록
          </Buttons>
        </div>
      </div>

      <div className="ui-info-table small sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 40 }} />
            <col />
            <col style={{ width: 100 }} />
            <col style={{ width: 150 }} />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style={{ width: 45 }} />
          </colgroup>
          <thead>
            <tr>
              <th>No</th>
              <th>처리자</th>
              <th>주문일시</th>
              <th>상품명</th>
              <th>공급가액</th>
              <th>할인액</th>
              <th>주문금액</th>
              <th>매출액</th>
              <th>미수금</th>
            </tr>
          </thead>
          <tbody>
            {orderList && orderList?.length > 0 ? (
              orderList?.map((order, index) => {
                return(
                  <tr className="text-center">
                    <td>{index +1}</td>
                    <td>{order.creatorName}</td>
                    <td>{order.createdOn}</td>
                    <td>
                      <Buttons
                        className="ui-link secondary-high ui-ellipsis"
                        ellipsis
                        title={order.orderProductName}
                        onClick={() => onTitlePress(order)}
                      >
                        {order.orderProductName}
                      </Buttons>
                    </td>
                    <td className="text-right">{numberCurrency(order.supplyAmount)}</td>
                    <td>{numberCurrency(order.discountAmount)}</td>
                    <td>{numberCurrency(order.billingAmount)}</td>
                    <td>{numberCurrency(order.paymentAmount)}</td>
                    <td>{numberCurrency(order.receivableAmount)}</td>
                  </tr>
                )
              })
            ):(
              <tr className="text-center">
                <td colSpan="9">해당 자료가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* {orderList?.map((order, index) => (
        <OrderItem key={order.id} order={order} no={index} onTitlePress={onTitlePress} />
      ))} */}
    </div>
  );
};

const OrderItem = ({ order, no, onTitlePress }) => {
  return (
    <div className="ui-info-table small sp-mt-5">
      <table>
        <colgroup>
          <col style={{ width: 40 }} />
          <col />
          <col style={{ width: 100 }} />
          <col style={{ width: 150 }} />
          <col />
          <col />
          <col />
          <col />
          <col style={{ width: 45 }} />
        </colgroup>
        <thead>
          <tr>
            <th>No</th>
            <th>처리자</th>
            <th>주문일시</th>
            <th>상품명</th>
            <th>공급가액</th>
            <th>할인액</th>
            <th>주문금액</th>
            <th>매출액</th>
            <th>미수금</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td>{no}</td>
            <td>{order.creatorName}</td>
            <td>{order.createdOn}</td>
            <td>
              <Buttons
                className="ui-link secondary-high ui-ellipsis"
                ellipsis
                title={order.orderProductName}
                onClick={() => onTitlePress(order)}
              >
                {order.orderProductName}
              </Buttons>
            </td>
            <td className="text-right">{numberCurrency(order.supplyAmount)}</td>
            <td>{numberCurrency(order.discountAmount)}</td>
            <td>{numberCurrency(order.billingAmount)}</td>
            <td>{numberCurrency(order.paymentAmount)}</td>
            <td>{numberCurrency(order.receivableAmount)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MemberDetailOrder;
