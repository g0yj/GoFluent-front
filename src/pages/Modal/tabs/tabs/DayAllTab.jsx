import { Fragment } from "react";

import Buttons from "@/components/Buttons";

/**
 * 일별 전체
 */
const DayAllTab = () => {
  return (
    <div className="sp-mt-10" style={{ minHeight: 180 }}>
      <div className="ui-date-table">
        <table>
          <tbody>
            <tr className="sticky">
              <th className="th">
                <div className="inner">시</div>
              </th>
              <th className="th">
                <div className="inner">분</div>
              </th>
              <th className="th">
                <div className="inner">한가영</div>
              </th>
              <th className="th">
                <div className="inner">서안나</div>
              </th>
              <th className="th">
                <div className="inner">김나래</div>
              </th>
              <th className="th">
                <div className="inner">최태연</div>
              </th>
              <th className="th">
                <div className="inner">정지은</div>
              </th>
              <th className="th">
                <div className="inner">박제은</div>
              </th>
              <th className="th">
                <div className="inner bgc-mainColor">
                  <strong class="b ">Olivia</strong>
                </div>
              </th>
              <th className="th">
                <div className="inner bgc-subColor">
                  <strong class="b">Austin</strong>
                </div>
              </th>
              <th className="th">
                <div className="inner">
                  <strong class="b">Steven</strong>
                </div>
              </th>
            </tr>
            {[
              "06 시",
              "07 시",
              "08 시",
              "09 시",
              "10 시",
              "11 시",
              "12 시",
              "13 시",
              "14 시",
              "15 시",
              "16 시",
              "17 시",
              "18 시",
              "19 시",
              "20 시",
              "21 시",
              "22 시",
            ].map((el, i) => {
              return (
                <Fragment key={i}>
                  <tr className="bgc-greydc">
                    <th rowSpan={2} className="th main">
                      <div className="inner">{el}</div>
                    </th>
                    <td className="th main">
                      <div className="inner">00 분</div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`한가영 : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`서안나 : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`김나래 : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`최태연 : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`정지은 : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`박제은 : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`Olivia : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`Austin : ${el} 00분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`Steven : ${el} 00분`}</div>
                      </div>
                    </td>
                  </tr>
                  <tr className="bgc-greydc">
                    <td className="th main">
                      <div className="inner">30 분</div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`한가영 : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`서안나 : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`김나래 : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`최태연 : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`정지은 : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`박제은 : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`Olivia : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`Austin" : ${el} 30 분`}</div>
                      </div>
                    </td>
                    <td>
                      <div className="ui-teacher">
                        <div></div>
                        <div></div>
                      </div>

                      <div className="ui-tooltip">
                        <div className="row">{`Steven" : ${el} 30 분`}</div>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="sticky">
              <th className="th">
                <div className="inner">시</div>
              </th>
              <th className="th">
                <div className="inner">분</div>
              </th>
              <th className="th">
                <div className="inner">한가영</div>
              </th>
              <th className="th">
                <div className="inner">서안나</div>
              </th>
              <th className="th">
                <div className="inner">김나래</div>
              </th>
              <th className="th">
                <div className="inner">최태연</div>
              </th>
              <th className="th">
                <div className="inner">정지은</div>
              </th>
              <th className="th">
                <div className="inner">박제은</div>
              </th>
              <th className="th">
                <div className="inner bgc-mainColor">
                  <strong class="b ">Olivia</strong>
                </div>
              </th>
              <th className="th">
                <div className="inner bgc-subColor">
                  <strong class="b">Austin</strong>
                </div>
              </th>
              <th className="th">
                <div className="inner">
                  <strong class="b">Steven</strong>
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* tab 상단 */}
      <div className="tabs-right-btn">
        <Buttons className="primary add">저장</Buttons>
      </div>
      {/* tab 상단 */}
      <div className="text-right sp-mt-10">
        <Buttons className="primary add">저장</Buttons>
      </div>
    </div>
  );
};

export default DayAllTab;
