import Tabs from "@/components/Tabs";
import MemberDetailBasic from "./tabs/MemberDetailBasic";
import MemberDetailConsultation from "./tabs/MemberDetailConsultation";
import MemberDetailLDF from "./tabs/MemberDetailLDF";
import MemberDetailLecture from "./tabs/MemberDetailLecture";
import MemberDetailLesson from "./tabs/MemberDetailLesson";
import MemberDetailOrder from "./tabs/MemberDetailOrder";
import MemberDetailReservation from "./tabs/MemberDetailReservation";
import MemberDetailTest from "./tabs/MemberDetailTest";

// 추후에 별도의 창으로 만들어서 사용해야할 일을 대비해서 분리함
// 회원관리 우측에 나타나는 회원 상세 탭들
const MemberDetailTabs = ({ member, initialLabel, onChangeDetailTabsLabel }) => {
  return (
    <div className="ui-contents-wrap inner-shadow">
      <div className="ui-contents-inner">
        <div className="layout-contents-width">
          <div className="ui-tabs-large">
            <Tabs defaultActiveTab={initialLabel} onChangeTab={onChangeDetailTabsLabel}>
              <div label="기본">
                <MemberDetailBasic memberId={member.id} />
              </div>
              <div label="테스트">
                <MemberDetailTest memberId={member.id} member={member} />
              </div>
              <div label="예약">
                <MemberDetailReservation member={member} />
              </div>
              <div label="수강">
                <MemberDetailLecture member={member} />
              </div>
              <div label="학습">
                <MemberDetailLesson member={member} />
              </div>
              <div label="상담">
                <MemberDetailConsultation member={member} />
              </div>
              <div label="주문">
                <MemberDetailOrder member={member} />
              </div>
              <div label="LDF">
                <MemberDetailLDF member={member} />
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailTabs;
