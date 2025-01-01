import { createContext } from "react";

export const MemberManagementContext = createContext();

const MemberManagementProvider = ({ refreshMemberList, onDeletedMember, children }) => {
  return (
    <MemberManagementContext.Provider value={{ refreshMemberList, onDeletedMember }}>
      {children}
    </MemberManagementContext.Provider>
  );
};

export default MemberManagementProvider;
