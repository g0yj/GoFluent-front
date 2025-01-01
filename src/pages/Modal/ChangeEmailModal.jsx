import useChangeEmailWindow from "@/app/helper/windows-hooks/use-change-email-window";
import ServiceLDF from "@/app/service/service-ldf";
import Buttons from "@/components/Buttons";
import { useState } from "react";

const ChangeEmailModal = () => {
    const { emailInfo } = useChangeEmailWindow();
    const [newEmail, setNewEmail] = useState();


    const changeEmailSend = async () => {
        if (!newEmail) {
            alert("받으실 이메일 주소를 입력해주세요.")
            return;
        }

        const sendData = {
            ...emailInfo,
            email : newEmail
        }

        try {
            await ServiceLDF.emailLdf(sendData);
            alert("메일이 발송되었습니다.");
            window.close();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div>
                <div className="ui-sub-title sticky-tabs sp-mt-10">
                    <div className="title">
                        <div className="tit-wrap">
                            <div className="tit">LDF</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ui-info-table th-left sp-mt-20">
              <table>
                <colgroup>
                  <col style={{ width: 80 }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th>현재 Email</th>
                    <td>{emailInfo.email}</td>
                  </tr>
                  <tr>
                    <th>새로 입력</th>
                    <td>
                        <input style={{width:"100%"}}
                            onChange={(e) => setNewEmail(e.target.value)}
                        >
                        </input>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="sp-mt-10">
                <p>
                    * 새로 입력하신 이메일은 일회성으로 발송되는 정보입니다.
                    회원정보는 변경되지 않습니다.
                </p>
              </div>
            </div>
            <div className="text-right sp-mt-20">
                <Buttons className="outlined small text-center" onClick={changeEmailSend}>
                    발송
                </Buttons>
            </div>
        </div>
    )
};

export default ChangeEmailModal;