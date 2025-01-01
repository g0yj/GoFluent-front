import Tabs from "@/components/Tabs";
import { NavLink } from "react-router-dom";
import HoldTab from "./Tabs/HoldTab";
import SendTab from "./Tabs/SendTab";

// 통계보고서(1depth) > sms 전송현황(2depth)
const SmsStatusContents = () => {
  return (
    <div className="ui-contents-wrap max-width flex1">
      <div className="ui-contents-inner">
        <div className="ui-location-wrap">
          <div className="ui-location-title">SMS 전송현황</div>

          <div className="ui-location">
            <NavLink>
              <i className="fa-solid fa-house"></i>
            </NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <strong>SMS 전송현황</strong>
          </div>
        </div>

        <div className="ui-tabs-large">
          <Tabs>
            <div label="발송내역">
              <SendTab />
            </div>
            <div label="대기내역">
              <HoldTab />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SmsStatusContents;
