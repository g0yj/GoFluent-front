import Tabs from "@/components/Tabs";
import TeacherDetailBasic from "./tabs/TeacherDetailBasic";
import TeacherTimeTable from "./tabs/TeacherTimeTable";

const TeacherDetailTabs = ({ selectedData, getTeachers }) => {
  return (
    <div className="ui-tabs-large">
      <Tabs>
        <div label="기본정보">
          <TeacherDetailBasic selectedData={selectedData} getTeachers={getTeachers} />
        </div>
        <div label="강의OPEN(주별)">
          <TeacherTimeTable selectedData={selectedData} />
        </div>
      </Tabs>
    </div>
  );
};

export default TeacherDetailTabs;
