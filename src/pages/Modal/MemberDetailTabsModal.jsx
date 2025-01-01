import { useEffect, useState } from "react";
import MemberDetailTabs from "../SystemOperator/Members/MemberDetailTabs/MemberDetailTabs";
import MemberManagementProvider from "../SystemOperator/Members/context/MemberManagementProvider";

const MemberDetailTabsModal = () => {
  const [member, setMember] = useState(null);
  const [label, setLabel] = useState(null);

  const getData = async () => {
    const getMember = await localStorage.getItem("MemberDetailTabs");
    const getLabel = await localStorage.getItem("label");
    setMember(JSON.parse(getMember));
    setLabel(JSON.parse(getLabel));
  };

  useEffect(() => {
    getData();
  }, []);

  if (member) {
    return (
      <MemberManagementProvider>
        <MemberDetailTabs member={member} memberId={member?.id} initialLabel={label} />
      </MemberManagementProvider>
    );
  } else {
    return <></>;
  }
};

export default MemberDetailTabsModal;
