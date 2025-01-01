import { NavLink } from "react-router-dom";

import { useState } from "react";
import Table from "./TeacherDetailTabs/table/table";
import dayjs from "dayjs";

// 강사관리(1depth) > 결석률(2depth)
const AbsenceManagementContents = () => {
  const [date, setDate] = useState({ year: dayjs(new Date()).format("YYYY"), month: dayjs(new Date()).format("MM") });

  const onChangeDate = (value) => {
    setDate((prev) => ({ ...prev, ...value }));
  };

  return (
    <section className="ui-contents-wrap max-width flex1">
      <div className="ui-contents-inner">
        <div className="ui-location-wrap">
          <div className="ui-location-title">결석률</div>
          <div className="ui-location">
            <NavLink>
              <i className="fa-solid fa-house"></i>
            </NavLink>
            <NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>강사관리</strong>
            </NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <strong>결석률</strong>
          </div>
        </div>

        <div className="sp-mt-10">
          <div className="ui-info-table th-left sp-mt-5">
            <table>
              <colgroup>
                <col style={{ width: 150 }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>기간</th>
                  <td>
                    <div className="flexYCenter gap">
                      <button className="ui-select">
                        <select
                          className="input-init"
                          value={date?.year}
                          onChange={({ target: { value } }) => onChangeDate({ year: value })}
                        >
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
                        <select
                          className="input-init"
                          value={date?.month}
                          onChange={({ target: { value } }) => onChangeDate({ month: value })}
                        >
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
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {<Table status={"N"} year={date.year} month={date.month} />}
        </div>
      </div>
    </section>
  );
};

export default AbsenceManagementContents;
