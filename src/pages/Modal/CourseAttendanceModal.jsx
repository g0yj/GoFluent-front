import { Fragment } from "react";
import Buttons from "@/components/Buttons";

/**
 *
 * @description 회원상세 > 수강 > 수강중 > 회원 강의시간표
 */
const CourseAttendance = () => {
  return (
    <div style={{ padding: 10 }}>
      <div className="ui-sub-title sticky-tabs">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">회원 - 강의 시간표</div>
          </div>
        </div>

        <div className="control">
          <Buttons type="button" className="outlined xsmall2">
            인쇄
          </Buttons>
        </div>
      </div>

      <div className="ui-info-table sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: "105px" }} />
            <col />
            <col style={{ width: "105px" }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>회원정보</th>
              <td>
                <strong className="b">유성현</strong>
                (modagoda170@naver.com)
              </td>
              <th>기간</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select className="input-init">
                      <option value="2019">2019 년</option>

                      <option value="2020">2020 년</option>

                      <option value="2021">2021 년</option>

                      <option value="2022">2022 년</option>

                      <option value="2023">2023 년</option>

                      <option value="2024">2024 년</option>

                      <option value="2025">2025 년</option>

                      <option value="2026">2026 년</option>

                      <option value="2027">2027 년</option>

                      <option value="2028">2028 년</option>
                    </select>
                  </button>
                  <button className="ui-select">
                    <select className="input-init">
                      <option value="01">01 월</option>

                      <option value="02">02 월</option>

                      <option value="03">03 월</option>

                      <option value="04">04 월</option>

                      <option value="05">05 월</option>

                      <option value="06">06 월</option>

                      <option value="07">07 월</option>

                      <option value="08">08 월</option>

                      <option value="09">09 월</option>

                      <option value="10">10 월</option>

                      <option value="11">11 월</option>

                      <option value="12">12 월</option>
                    </select>
                  </button>

                  <div className="ui-check">
                    <div className="check">
                      <input type="checkbox" id="res" />
                      <label htmlFor="res">예약취소 제외</label>
                    </div>
                  </div>

                  <div className="ml-auto flexYCenter gap size-bodyXS">
                    <div>[범례] :</div>
                    <div className="ui-space bgc-ok txt-ok-color">출석</div>
                    <div className="ui-space bgc-no txt-no-color">결석</div>
                    <div className="ui-space bgc-res txt-res-color">예약</div>
                    <div className="ui-space bgc-res-cancel">예약취소</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="ui-date-table col-hover sp-mt-10">
        <table>
          <tbody>
            <tr>
              <th className="th">
                <div className="inner">시</div>
              </th>
              <th className="th">
                <div className="inner">분</div>
              </th>
              {[...Array(30)].map((el, i) => {
                return (
                  <th className={`th ${i % 7 ? "" : "txt-red"}`} key={i}>
                    <div className="inner">{i + 1}</div>
                  </th>
                );
              })}
              <th className="th">
                <div className="inner">분</div>
              </th>
              <th className="th">
                <div className="inner">시</div>
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
              "23 시",
            ].map((el, index) => {
              return (
                <Fragment key={index}>
                  <tr className="bgc-greydc">
                    <th rowSpan={2} className="th main">
                      <div className="inner">{el}</div>
                    </th>
                    <td className="th main">
                      <div className="inner">00 분</div>
                    </td>
                    {[...Array(30)].map((el, i) => {
                      const num0 = i === 0 && index === 0;
                      const num1 = i === 1 && index === 0;
                      const num2 = i === 2 && index === 0;
                      const num3 = i === 3 && index === 0;
                      return (
                        <Fragment key={i}>
                          <td>
                            <div
                              className={`ui-td flexCenter 
                              ${num0 ? "bgc-ok txt-ok-color" : ""} 
                              ${num1 ? "bgc-no txt-no-color" : ""} 
                              ${num2 ? "bgc-res txt-res-color" : ""} 
                              ${num3 ? "bgc-res-cancel" : ""}`}
                            >
                              {num0 && "김나래"}
                              {num1 && "김나래"}
                              {num2 && "김나래"}
                              {num3 && "김나래"}
                            </div>
                          </td>
                        </Fragment>
                      );
                    })}
                    <td className="th main">
                      <div className="inner">00 분</div>
                    </td>
                    <th rowSpan={2} className="th main">
                      <div className="inner">{el}</div>
                    </th>
                  </tr>
                  <tr className="bgc-greydc">
                    <td className="th main">
                      <div className="inner">30 분</div>
                    </td>
                    {[...Array(30)].map((el, i) => {
                      return (
                        <td key={i}>
                          <div className="ui-td"></div>
                        </td>
                      );
                    })}
                    <td className="th main">
                      <div className="inner">30 분</div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th className="th">
                <div className="inner">시</div>
              </th>
              <th className="th">
                <div className="inner">분</div>
              </th>
              {[...Array(30)].map((el, i) => {
                return (
                  <th className={`th ${i % 7 ? "" : "txt-red"}`} key={i}>
                    <div className="inner">{i + 1}</div>
                  </th>
                );
              })}
              <th className="th">
                <div className="inner">분</div>
              </th>
              <th className="th">
                <div className="inner">시</div>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CourseAttendance;
