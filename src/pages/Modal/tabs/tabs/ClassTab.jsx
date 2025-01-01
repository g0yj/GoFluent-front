/**
 * 주문 - 과정
 */
const ClassTab = ({
  selectedData,
  languages,
  lessonTypes,
  products,
  teachers,
  onChangeSelectedData,
}) => {
  return (
    <div className="ui-tab-inner shadow">
      <div className="flex gap-20">
        <div
          className="flexColumn gap bgc-grey100 flex-none"
          style={{ padding: "5px 20px 5px 5px", borderRight: "1px dashed var(--grey400)" }}
        >
          <div className="flexYCenter gap-10">
            <button className="ui-select">
              <select
                className="input-init"
                value={languages?.find((item) => item.value === selectedData.language).value}
                onChange={({ target: { value } }) => onChangeSelectedData({ language: value })}
              >
                {languages?.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </button>

            <div className="ui-radio-group gap">
              {lessonTypes?.map((item) => {
                return (
                  <div key={item?.value}>
                    <input
                      type="radio"
                      id={item?.value}
                      name="Clarity"
                      checked={item?.value === selectedData?.lesson ? true : false}
                      onChange={() => onChangeSelectedData({ lesson: item?.value })}
                    />
                    <label htmlFor={item?.value}>{item?.label}</label>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <button className="ui-select">
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
                <th>레슨횟수</th>
                <td colSpan={3}>
                  <div className="flexYCenter gap">
                    <button className="ui-select">
                      <select
                        className="input-init"
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
                      value={selectedData?.quantity}
                      onChange={({ target: { value } }) =>
                        onChangeSelectedData({ quantity: value })
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
                      type="text"
                      className="input-init"
                      style={{ width: 150 }}
                      readOnly
                      value={(
                        selectedData?.product?.price - (selectedData?.discountAmount || 0)
                      ).toLocaleString()}
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

export default ClassTab;
