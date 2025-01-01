import Tabs from "@/components/Tabs";
import TeacherDetailBasic from "./tabs/TeacherDetailBasic";

const TeacherNonUserDetailTabs = ({ selectedData, getTeachers }) => {
  return (
    <div className="ui-tabs-large">
      <Tabs>
        <div label="기본정보">
          <TeacherDetailBasic selectedData={selectedData} getTeachers={getTeachers} />
        </div>
      </Tabs>
    </div>
  );
};

export default TeacherNonUserDetailTabs;
