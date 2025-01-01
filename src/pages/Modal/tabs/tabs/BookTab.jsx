/**
 * 주문 - 교재
 */
const BookTab = ({ selectedData, languages, products, onChangeSelectedData }) => {
  return (
    <div className="ui-tab-inner shadow">
      <div className="flex gap-20">
        <div
          className="flexColumn gap bgc-grey100 flex-none"
          style={{ padding: "5px 20px 5px 5px", borderRight: "1px dashed var(--grey400)" }}
        >
          <div className="flexYCenter gap-10">
            <button className="ui-select full">
              <select
                className="input-init"
                onChange={({ target: { value } }) => onChangeSelectedData({ language: value })}
              >
                {languages?.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </button>
          </div>
          <div>
            <button className="ui-select full">
              <select
                className="input-init"
                onChange={({ target: { value } }) =>
                  onChangeSelectedData({ product: JSON.parse(value) })
                }
              >
                {products?.map((product) => (
                  <option
                    key={product.id}
                    value={JSON.stringify(product)}
                  >{`${product.name} (${product.price}원)`}</option>
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
                <th>수량</th>
                <td colSpan={3}>
                  <div className="flexYCenter gap">
                    <input
                      type="number"
                      className="input-init"
                      style={{ width: 50 }}
                      onChange={({ target: { value } }) =>
                        onChangeSelectedData({ productCount: value })
                      }
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
                  <span className="txt-secondary">할인금액</span>
                </th>
                <td colSpan={3}>
                  <div className="flexYCenter gap">
                    <input
                      type="number"
                      className="input-init"
                      style={{ width: 150 }}
                      value={selectedData?.discountAmount}
                      onChange={({ target: { value } }) =>
                        onChangeSelectedData({ discountAmount: value })
                      }
                    />
                    <div>원</div>
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
                      defaultValue={
                        Number(selectedData?.product?.price) *
                          Number(selectedData?.productCount || 1) -
                        Number(selectedData?.discountAmount || 0)
                      }
                      readOnly
                      value={
                        Number(selectedData?.product?.price) *
                          Number(selectedData?.productCount || 1) -
                        Number(selectedData?.discountAmount || 0)
                      }
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
  );
};

export default BookTab;
