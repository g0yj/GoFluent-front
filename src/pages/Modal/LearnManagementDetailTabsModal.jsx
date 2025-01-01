import LearnerManagementDetailTabs from "../Teacher/LearnerManagement/LearnerManagementDetailTabs/LearnerManagementDetailTabs";
import MemberManagementProvider from "../SystemOperator/Members/context/MemberManagementProvider";
import { useEffect, useState } from "react";

const LearnManagementDetailTabsModal = () => {
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
                <LearnerManagementDetailTabs member={member} memberId={member?.id} initialLabel={label} />
            </MemberManagementProvider>
        );
    } else {
        return <></>;
    }
};

export default LearnManagementDetailTabsModal;