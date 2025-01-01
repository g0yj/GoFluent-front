import Tabs from "@/components/Tabs";
import DayAllTab from "./tabs/DayAllTab";

/**
 * 일별
 */
const DayTab = ({ scheduleList, teacherList, getSchedule, language, isReport }) => {
  return (
    <div>
      <div className="ui-tabs-outer">
        <Tabs defaultActiveTab="전체">
          <div label="오전">
            <DayAllTab
              scheduleList={scheduleList?.slice(0, 14)}
              teacherList={teacherList}
              getSchedule={getSchedule}
              language={language}
              isReport={isReport}
            />
          </div>
          <div label="오후">
            <DayAllTab
              scheduleList={scheduleList?.slice(14, scheduleList.length)}
              teacherList={teacherList}
              getSchedule={getSchedule}
              language={language}
              isReport={isReport}
            />
          </div>
          <div label="전체">
            <DayAllTab
              scheduleList={scheduleList}
              teacherList={teacherList}
              getSchedule={getSchedule}
              language={language}
              isReport={isReport}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DayTab;
