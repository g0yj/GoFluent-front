import Tabs from "@/components/Tabs";
import BookTab from "./tabs/BookTab";
import ClassTab from "./tabs/ClassTab";
import ContentsTab from "./tabs/ContentsTab";
import DeviceTab from "./tabs/DeviceTab";
import PackageTab from "./tabs/PackageTab";
import { useState } from "react";

/**
 * 주별
 */
const OrderTab = ({
  selectedData,
  products,
  teachers,
  onChangeSelectedData,
}) => {
  const [quantity, setQuantity] = useState(selectedData?.quantity || 1);

  const handleQuantity = (data) => {
    const price = selectedData?.product?.price

    setQuantity(data.value)
    onChangeSelectedData(data);
  }

  return (
    <div>
      <div className="ui-tabs-outer ui-tabs-large">
        <div className="ui-tab-inner shadow">
          <div className="flex gap-20">
            <div
              className="flexColumn gap bgc-grey100 flex-none"
              style={{ padding: "5px 20px 5px 5px", borderRight: "1px dashed var(--grey400)" }}
            >
              <div>
                <button className="ui-select">
                  <select
                    className="input-init"
                    onChange={({ target: { value } }) => {
                      const selectedProduct = products.find((p) => p.id === value);
                      onChangeSelectedData({ product: selectedProduct });
                    }}
                  >
                    {products && products && Object.values(products).map((p) => (
                      <option key={p.id} value={p.id}>
                        {`${p.name} (${p.price}원)`}
                      </option>
                    ))}
                  </select>
                </button>
              </div>
              {products?.length === 0 && (
                <div className="size-bodyXS" style={{ whiteSpace: "nowrap", padding: 20 }}>
                  주문 가능한 상품이 없습니다.
                </div>
              )}
            </div>

            {selectedData?.product.curriculumYN === 'Y' ? (
              <div className="ui-info-table th-left" style={{ width: "100%" }}>
                <table>
                  <colgroup>
                    <col style={{ width: 120 }} />
                    <col />
                    <col style={{ width: 120 }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>레슨횟수</th>
                      <td colSpan={3}>
                        <div className="flexYCenter gap">
                          <button className="ui-select">
                            <select
                              className="input-init"
                              value={selectedData.months}
                              onChange={({ target: { value } }) =>
                                onChangeSelectedData({ months: value })
                              }
                            >
                              <option value="1">1개월</option>
                              <option value="2">2개월</option>
                              <option value="3">3개월</option>
                              <option value="4">4개월</option>
                              <option value="5">5개월</option>
                              <option value="6">6개월</option>
                              <option value="7">7개월</option>
                              <option value="8">8개월</option>
                              <option value="9">9개월</option>
                              <option value="10">10개월</option>
                              <option value="11">11개월</option>
                              <option value="12">12개월</option>
                            </select>
                          </button>
                          <input
                            type="number"
                            className="input-init"
                            style={{ width: 50 }}
                            value={quantity}
                            onChange={({ target: { value } }) =>
                              handleQuantity({ quantity: value })
                            }
                          />
                          <div>회</div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th>등록구분</th>
                      <td colSpan={3}>
                        <button className="ui-select" style={{ width: 150 }}>
                          <select
                            className="input-init"
                            value={selectedData?.isRetake}
                            onChange={({ target: { value } }) =>
                              onChangeSelectedData({ isRetake: value })
                            }
                          >
                            <option>-선택-</option>
                            <option value={false}>신규</option>
                            <option value={true}>재등록</option>
                          </select>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th>담임강사</th>
                      <td>
                        <button className="ui-select">
                          <select
                            className="input-init"
                            style={{ width: 150 }}
                            defaultValue={selectedData?.teacherId}
                            onChange={({ target: { value } }) =>
                              onChangeSelectedData({ teacherId: value })
                            }
                          >
                            <option value="">-선택-</option>
                            {teachers?.map((teacher) => (
                              <option key={teacher.value} value={teacher.value} title="한가영()">
                                {teacher.label}
                              </option>
                            ))}
                          </select>
                        </button>
                      </td>
                      <th>부담임강사</th>
                      <td>
                        <button className="ui-select">
                          <select
                            className="input-init"
                            style={{ width: 150 }}
                            defaultValue={selectedData?.assistantTeacherId}
                            onChange={({ target: { value } }) =>
                              onChangeSelectedData({ assistantTeacherId: value })
                            }
                          >
                            <option value="">-선택-</option>
                            {teachers?.map((teacher) => (
                              <option key={teacher.value} value={teacher.value}>
                                {teacher.label}
                              </option>
                            ))}
                          </select>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th>재등록대상강사</th>
                      <td>
                        <button className="ui-select">
                          <select
                            className="input-init"
                            style={{ width: 150 }}
                            defaultValue={selectedData?.retakeTeacherId}
                            onChange={({ target: { value } }) =>
                              onChangeSelectedData({ retakeTeacherId: value })
                            }
                          >
                            <option value="">-선택-</option>
                            {teachers?.map((teacher) => (
                              <option key={teacher.value} value={teacher.value}>
                                {teacher.label}
                              </option>
                            ))}
                          </select>
                        </button>
                      </td>
                      <th>재등록사유</th>
                      <td>
                        <div className="h-full flexYCenter">
                          <textarea
                            className="input-init full"
                            rows={1}
                            value={selectedData?.retakeNote}
                            onChange={({ target: { value } }) =>
                              onChangeSelectedData({ retakeNote: value })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="sp-mt-5">
                  <colgroup>
                    <col style={{ width: 120 }} />
                    <col />
                    <col style={{ width: 120 }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>
                        <span className="txt-green-light">실청구금액</span>
                      </th>
                      <td colSpan={3}>
                        <div className="flexYCenter gap">
                          <input
                            type="text"
                            className="input-init"
                            style={{ width: 150 }}
                            value={selectedData?.billingAmount?.toLocaleString() || selectedData?.product?.price?.toLocaleString()}
                            onChange={({ target: { value } }) =>{
                              const numericValue = value.replace(/[^0-9]/g, '');
                              if (value === "" || value === null) {
                                // value가 빈 문자열이거나 null이면 billingAmount를 기본값으로 설정
                                onChangeSelectedData({
                                  billingAmount: selectedData?.product?.price,
                                });
                              } else {
                                onChangeSelectedData({ billingAmount: Number(numericValue) });
                              }
                            }}
                          />
                          <div>원</div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ):(
              <div className="ui-tab-inner shadow">
                <div className="flex gap-20">
                  <div className="ui-info-table th-left" style={{ width: "100%" }}>
                    <table>
                      <colgroup>
                        <col style={{ width: 120 }} />
                        <col />
                        <col style={{ width: 120 }} />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>
                            <span className="txt-secondary">수량</span>
                          </th>
                          <td colSpan={3}>
                            <div className="flexYCenter gap">
                              <input
                                type="number"
                                className="input-init"
                                style={{ width: 150 }}
                                value={selectedData?.quantity || 1}
                                onChange={({ target: { value } }) =>
                                  onChangeSelectedData({ quantity: Math.min(99, Math.max(1, value)), billingAmount: selectedData?.product?.price * value })
                                }
                                min={1}
                                max={99}
                              />
                              <div>개</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table className="sp-mt-5">
                      <colgroup>
                        <col style={{ width: 120 }} />
                        <col />
                        <col style={{ width: 120 }} />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>
                            <span className="txt-green-light">실청구금액</span>
                          </th>
                          <td colSpan={3}>
                            <div className="flexYCenter gap">
                              <input
                                type="number"
                                className="input-init"
                                style={{ width: 150 }}
                                value={selectedData?.billingAmount || 
                                  Number(selectedData?.product?.price) *
                                  Number(selectedData?.quantity || 1)
                                }
                                onChange={({ target: { value } }) =>{
                                  if (value === "" || value === null) {
                                    // value가 빈 문자열이거나 null이면 billingAmount를 기본값으로 설정
                                    onChangeSelectedData({
                                      billingAmount: selectedData?.product?.price * (selectedData?.quantity || 1),
                                    });
                                  } else {
                                    onChangeSelectedData({ billingAmount: value });
                                  }
                                }}
                              />
                              <div>원</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};
export default OrderTab;
