import useSmsUserListWindow from "@/app/helper/windows-hooks/use-sms-select-user-list";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";
import ServiceCommon from "@/app/service/service-common";
import Buttons from "@/components/Buttons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import _ from "lodash";

/**
 * SMS발송 모달
 */
const SendSmsModal = () => {
  const { memberList, contentData } = useSmsWindow();
  const {
    openSmsUserListWindow,
    isNew,
    memberList: smsUserList,
    setNewState,
  } = useSmsUserListWindow();

  const [sendData, setSendData] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);

  const onChangeSendData = (data) => {
    if (data.content) {
      const encoder = new TextEncoder();
      const byteLength = encoder.encode(data.content).length;
      if (byteLength >= 90) {
        setSendData((prev) => ({ ...prev, ...{sendType: "L"} }));
      } else {
        setSendData((prev) => ({ ...prev, ...{sendType: "S"} }));
      }
    }

    if (data.reservationDate) {
      if (dayjs(data.reservationDate).isBefore(dayjs().add(10, "minute"))) {
        alert("예약발송은 발송시간 + 10분 이후부터 가능합니다.");
        return;
      }
    }
      
    setSendData((prev) => ({ ...prev, ...data }));
  };
  const onChangeRecipients = (target) => {
    const selectedValues = Array.from(target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setSelectedMember(selectedValues);
  };

  const onMemberAddClick = () => {
    openSmsUserListWindow(recipients, true);
  };

  const onClickDeleteRecipients = () => {
    const selectedMemberSet = new Set(selectedMember);
    const saveData = recipients.filter(
      (item) => !selectedMemberSet.has(`${item.name} ${item.cellPhone || item.phone}`)
    );

    setRecipients(saveData);
  };

  // 메일 발송
  const sendSms = async () => {
    try {
      const makeRecipients = recipients.map((item) => ({
        name: item.name,
        phone: item.cellPhone || item.phone,
        email: item.email || "",
      }));
      const saveData = {
        ...sendData,
        recipients: makeRecipients,
        ...(sendData.reservationDate && { reservationDate: dayjs(sendData.reservationDate).format("YYYY-MM-DD HH:mm") })
      };
      await ServiceCommon.sendSms(saveData);

      alert("SMS 발송이 완료되었습니다.");
      window.close();
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (isNew) {
      setRecipients(smsUserList);
      setNewState(false);
    }
  }, [isNew, setNewState, smsUserList]);

  useEffect(() => {
    setRecipients(memberList);
  }, [memberList]);

  useEffect(() => {
    if (contentData) {
      setSendData({
        // isReservation: !!contentData.reservationDate,
        // reservationDate: contentData.reservationDate,
        senderPhone: contentData.senderPhone,
        content: contentData.content,
      });
    }
  }, [contentData]);

  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">SMS 발송</div>
      </div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>발송대상</th>
              <td>
                <div className="flex gap">
                  <div className="flex1">
                    <select
                      className="input-init"
                      multiple
                      style={{ width: "100%" }}
                      onChange={({ target }) => onChangeRecipients(target)}
                    >
                      {!!recipients &&
                        recipients?.map((member, idx) => (
                          <option key={member.name + idx}>
                            {member.name} {member.cellPhone || member.phone}
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
              <th>예약발송</th>
              <td>
                <div className="flexYCenter gap-10">
                  <input
                    type="checkbox"
                    className="input-init"
                    // checked={sendData?.isReservation}
                    // onChange={({ target: { checked } }) =>
                    //   onChangeSendData({ isReservation: checked })
                    // }
                  />
                  <div className="ui-datepicker-wrap">
                    <div>
                      <ReactDatePicker
                        customInput={<input style={{ width: '150px' }} />}
                        dateFormat="YYYY-MM-dd HH:mm"
                        showTimeSelect
                        timeIntervals={5}
                        selected={sendData?.reservationDate}
                        onChange={(date) => onChangeSendData({ reservationDate: date })}
                        selectStart
                        startDate={sendData?.reservationDate}
                        endDate={sendData?.reservationDate}
                        dayClassName={(date) =>
                          dayjs(date).day() === 6
                            ? "saturday"
                            : dayjs(date).day() === 0
                            ? "sunday"
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className="ui-hover-info">
                    <i className="fa-solid fa-circle-question size-subtitleL txt-warning"></i>

                    <div className="hover-info-txt end">
                      * 예약발송은 발송시간 <strong className="b">+ 10분</strong>부터 가능합니다.
                      <br />* 예약발송은 발송시간 <strong className="b">+ 180일</strong>까지
                      가능합니다.
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>발신번호</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  value="02-2082-1105"
                  onChange={({ target: { value } }) => onChangeSendData({ senderPhone: value })}
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>
                <textarea
                  className="input-init full"
                  style={{ height: 200 }}
                  value={sendData?.content}
                  onChange={({ target: { value } }) => onChangeSendData({ content: value })}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="layout-between sp-mt-20">
        <div className="ml-auto gap-s">
          <Buttons className="primary mid" onClick={sendSms}>
            {_.isEmpty(contentData) ? "발송" : "재발송"}
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default SendSmsModal;
