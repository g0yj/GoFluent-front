import ServiceMember from "@/app/service/service-members";
import { useEffect, useState } from "react";
import MemberForm from "../../common/MemberForm";

/**
 * 회원상세 > 기본 탭
 */
const MemberDetailBasic = ({ memberId }) => {
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ServiceMember.get(memberId);
        setMember(data);
      } catch (e) {
        console.error(e.message);
      }
    };
    fetch();
  }, [memberId]);

  if (!member) return null;
  return <MemberForm data={member} />;
};

export default MemberDetailBasic;
