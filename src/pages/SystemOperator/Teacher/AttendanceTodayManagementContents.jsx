import { NavLink } from "react-router-dom";

import dayjs from "dayjs";
import Table from "./TeacherDetailTabs/table/table";

// 강사관리(1depth) > 출석률(일일)(2depth)
const AttendanceTodayManagementContents = () => {
  return (
    <section className="ui-contents-wrap max-width flex1">
      <div className="ui-contents-inner">
        <div className="ui-location-wrap">
          <div className="ui-location-title">출석률(일일)</div>
          <div className="ui-location">
            <NavLink>
              <i className="fa-solid fa-house"></i>
            </NavLink>
            <NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>강사관리</strong>
            </NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <strong>출석률(일일)</strong>
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
                  <td>{dayjs().format("YYYY-MM-DD (ddd)")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {<Table status={"Y"} year={dayjs().format("YYYY")} month={dayjs().format("MM")} day={dayjs().format("DD")}/>}
        </div>
      </div>
    </section>
  );
};

export default AttendanceTodayManagementContents;
