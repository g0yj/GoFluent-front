import useSmsUserListWindow from "@/app/helper/windows-hooks/use-sms-select-user-list";
import ServiceCommon from "@/app/service/service-common";
import Buttons from "@/components/Buttons";
import { useCallback, useEffect, useState } from "react";

const CommonUserListModal = () => {
  const { memberList, isSms, setUserList, setNewState } = useSmsUserListWindow();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [addUsers, setAddUsers] = useState([]);
  const [deleteUsers, setDeletedUsers] = useState([]);
  const [selectedData, setSelectedData] = useState({ type: "", search: "", keyword: "" });

  const onChangeData = (data) => {
    setSelectedData((prev) => ({ ...prev, ...data }));
  };

  const getUsers = useCallback(async () => {
    if (isSms) {
      const res = await ServiceCommon.getSmsUsers(selectedData);
      setUsers(res.users);
    } else {
      const res = await ServiceCommon.getEmailUsers(selectedData);
      setUsers(res.users);
    }
  }, [isSms, selectedData]);

  const onSelectUser = (target, isAdd) => {
    const selectedValues = Array.from(target.options)
      .filter((option) => option.selected)
      .map((option) => JSON.parse(option.value));
    if (isAdd) {
      setAddUsers(selectedValues);
    } else {
      console.log(selectedValues);
      setDeletedUsers(selectedValues);
    }
  };

  const onAddClick = () => {
    const removeDuplicationUser = [...selectedUsers, ...addUsers].filter((user) => {
      return selectedUsers.findIndex((item) => item.id === user.id) === -1;
    });
    setSelectedUsers((prev) => [...prev, ...removeDuplicationUser]);
  };

  const onDeleteClick = () => {
    const removeUser = selectedUsers.filter((user) => {
      return deleteUsers.findIndex((item) => item.id === user.id) === -1;
    });

    setSelectedUsers(removeUser);
  };

  const onClose = () => {
    window.close();
  };

  const onConfirm = () => {
    setUserList(selectedUsers);
    setNewState(true);
    window.close();
  };

  useEffect(() => {
    if (users.length === 0) getUsers();
  }, [getUsers, users.length]);

  useEffect(() => {
    setSelectedUsers(memberList);
  }, [memberList]);

  return (
    <div className="layout-popup-wrap h-full flexColumn gap-10">
      <div className="ui-location-wrap sp-none">
        <div className="ui-location-title">대상선택</div>
      </div>

      <div className="ui-info-table">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>회원구분</th>
              <td>
                <button className="ui-select" style={{ width: 90 }}>
                  <select
                    className="input-init"
                    onChange={({ target: { value } }) => onChangeData({ type: value })}
                  >
                    <option value="">- 전체 -</option>
                    <option value="S">일반회원</option>
                    <option value="T">강사</option>
                    <option value="A">관리자</option>
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>검색</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select" style={{ width: 90 }}>
                    <select
                      className="input-init"
                      onChange={({ target: { value } }) => onChangeData({ search: value })}
                    >
                      <option value="">- 전체 -</option>
                      <option value="name">이름</option>
                      <option value="id">아이디</option>
                    </select>
                  </button>
                  <input
                    type="text"
                    className="input-init"
                    placeholder="검색"
                    onChange={({ target: { value } }) => onChangeData({ keyword: value })}
                  />
                  <Buttons className="outlined xsmall" onClick={getUsers}>
                    <span className="flexYCenter gap">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      검색
                    </span>
                  </Buttons>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-multiple-bx h-full">
        <div className="flex1">
          <div className="ui-sub-title xsmall has-bg grey">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">대상회원</div>
              </div>
            </div>
          </div>
          <select
            className="input-init"
            multiple
            onChange={({ target }) => onSelectUser(target, true)}
          >
            {users.map((item) => (
              <option key={`left-${item.id}`} value={JSON.stringify(item)}>
                {item.name} / ({isSms ? item.cellPhone : item.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <Buttons className="outlined" onClick={onAddClick}>
            <i className="fa-solid fa-right-to-bracket"></i>
          </Buttons>
        </div>
        <div className="flex1">
          <div className="ui-sub-title xsmall has-bg grey">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">선택회원</div>
              </div>
            </div>

            <Buttons className="grey xsmall" onClick={onDeleteClick}>
              선택삭제
            </Buttons>
          </div>

          <select
            className="input-init"
            multiple
            readOnly
            onChange={({ target }) => onSelectUser(target, false)}
          >
            {selectedUsers?.map((item) => (
              <option key={`right-${item.id}`} value={JSON.stringify(item)}>
                {item.name} / ({isSms ? item.cellPhone : item.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="layout-between">
        <div className="ml-auto">
          <Buttons className="outlined mid" onClick={onClose}>
            닫기
          </Buttons>
          <Buttons className="primary mid" onClick={onConfirm}>
            확인
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default CommonUserListModal;
