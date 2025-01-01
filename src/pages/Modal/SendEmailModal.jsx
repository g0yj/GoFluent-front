import useEmailWindow from "@/app/helper/windows-hooks/use-email-window";
import useSmsUserListWindow from "@/app/helper/windows-hooks/use-sms-select-user-list";
import ServiceCommon from "@/app/service/service-common";
import Buttons from "@/components/Buttons";
import { useEffect, useRef, useState } from "react";
import usePreviewWindow from "@/app/helper/windows-hooks/use-preview-window";
import "@toast-ui/editor/dist/toastui-editor.css"
import color from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { Editor } from "@toast-ui/react-editor";

/**
 * 이메일 발송 모달
 */
const SendEmailModal = () => {
  const { openPreviewWindow } = usePreviewWindow();
  const { memberList } = useEmailWindow();
  const {
    openSmsUserListWindow,
    isNew,
    memberList: smsUserList,
    setNewState,
  } = useSmsUserListWindow();

  // 발신자 이메일
  const [senderEmail] = useState("desk@englishchannel.co.kr");
  // 이메일 제목
  const [title, setTitle] = useState("");
  // 이메일 내용
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);

  const editorRef = useRef(null);

  // 메일 발송
  const sendEmail = async () => {
    try {
      if (!title) {
        alert("제목을 입력해주세요.")
        return;
      }
      if(!content) {
        alert("내용을 입력해주세요.")
        return;
      }

      const saveData = {
        title,
        content,
        recipients: recipients.map((member) => ({ name: member.name, email: member.email })),
      };
      await ServiceCommon.sendEmail(saveData);
      alert("메일 발송이 완료되었습니다.");
      window.close();
    } catch (e) {
      alert(e.message);
    }
  };

  const onMemberAddClick = () => {
    openSmsUserListWindow(recipients, false);
  };

  const onClickDeleteRecipients = () => {
    const selectedMemberSet = new Set(selectedMember);
    const saveData = recipients.filter(
      (item) => !selectedMemberSet.has(`${item.name}${item.email}`)
    );
    setRecipients(saveData);
  };

  const preview = () => {
    const previewData = {
      title: title, 
      sender: senderEmail, 
      member: recipients, 
      content: content
    }
    openPreviewWindow(previewData);
  }

  useEffect(() => {
    if (isNew) {
      setRecipients(smsUserList);
      setNewState(false);
    }
  }, [isNew, setNewState, smsUserList]);

  useEffect(() => {
    setRecipients(memberList);
  }, [memberList]);

  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">메일발송</div>
      </div>

      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>받는 사람</th>
              <td>
                <div className="flex gap">
                  <div className="flex1">
                    <select
                      className="input-init"
                      multiple
                      style={{ width: "100%" }}
                      onChange={({ target }) => {
                        const selectedValues = Array.from(target.options)
                          .filter((option) => option.selected)
                          .map((option) => option.value);
                        setSelectedMember(selectedValues);
                      }}
                    >
                      {!!recipients &&
                        recipients.map((member, idx) => (
                          <option key={member.name + idx}>
                            {member.name}
                            {member.email}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flexColumn gap" style={{ alignSelf: "flex-end" }}>
                    <Buttons
                      className="ui-button ui-button outlined xsmall"
                      onClick={onMemberAddClick}
                    >
                      대상 선택
                    </Buttons>
                    <Buttons
                      className="ui-button ui-button outlined xsmall"
                      onClick={onClickDeleteRecipients}
                    >
                      대상 삭제
                    </Buttons>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>보내는 사람</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  defaultValue="desk@englishchannel.co.kr"
                />
              </td>
            </tr>
            <tr>
              <th>제목</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  placeholder="제목을 입력 하세요."
                  onChange={({ target: { value } }) => setTitle(value)}
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>
                <Editor 
                  initialValue={content ? content : " "}
                  ref={editorRef}
                  previewStyle="tab"
                  height="400px"
                  toolbarItems={[
                    // 툴바 옵션 설정
                    ["heading", "bold", "italic", "strike"],
                    ["hr", "quote"],
                    ["ul", "ol", "task", "indent", "outdent"],
                    ["table", /*"image",*/ 
                    "link"],
                    ["code", "codeblock"],
                  ]}
                  usageStatistics={false}
                  onChange={() => {
                    const changeContent = editorRef.current.getInstance().getHTML();
                    setContent(changeContent)
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="layout-between sp-mt-20">
        <div className="gap-s">
          <Buttons className="outlined mid grey-light" onClick={() => preview()}>미리보기</Buttons>
        </div>
        <div className="ml-auto gap-s">
          <Buttons className="outlined mid" onClick={() => window.close()}>
            닫기
          </Buttons>
          <Buttons className="primary mid" onClick={sendEmail}>
            발송
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
