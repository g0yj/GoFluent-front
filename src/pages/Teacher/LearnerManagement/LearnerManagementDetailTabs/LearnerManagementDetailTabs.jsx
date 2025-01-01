import Tabs from "@/components/Tabs";
import LearnerManagementDetailLDF from "./tabs/learnerManagementDetailLDF";
import LearnerManagementDetailLesson from "./tabs/learnerManagementDetailLesson";
import LearnerManagementDetailReport from "./tabs/learnerManagementDetailReport";
import LearnerManagementDetailReservation from "./tabs/learnerManagementDetailReservation";
import LearnerManagementDetailTest from "./tabs/learnerManagementDetailTest";

const LearnerManagementDetailTabs = ({ member, initialLabel, onChangeDetailTabsLabel }) => {
  return (
    <div className="ui-contents-wrap inner-shadow">
      <div className="ui-contents-inner">
        <div className="layout-contents-width">
          <div className="ui-tabs-large">
            <Tabs defaultActiveTab={initialLabel || 'Reservation'} onChangeTab={onChangeDetailTabsLabel}>
              <div label="Test">
                <LearnerManagementDetailTest memberId={member.id} member={member}/>
              </div>
              <div label="Reservation">
                <LearnerManagementDetailReservation member={member} />
              </div>
              <div label="Lesson">
                <LearnerManagementDetailLesson member={member} />
              </div>
              <div label="Report">
                <LearnerManagementDetailReport member={member} />
              </div>
              <div label="LDF">
                <LearnerManagementDetailLDF member={member} />
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerManagementDetailTabs;
