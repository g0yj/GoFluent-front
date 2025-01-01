import useSmsListWindow from "@/app/helper/windows-hooks/use-sms-list-window";
import Buttons from "@/components/Buttons";

/**
 * SMS발송내역 모달
 */
const SmsListModal = () => {
  const { smsList } = useSmsListWindow();
  console.log(smsList);
  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">SMS 발송내역</div>
      </div>
      <div>
        <div className="layout-between sp-mt-10">
          <div>
            <div className="size-bodyXS">
              <strong className="m">Total :</strong>{" "}
              <strong className="b txt-secondary">{smsList.length}</strong>
              <span className="txt-grey600">건</span>
            </div>
          </div>
        </div>
        <div className="ui-info-table txt-mid another sp-mt-10">
          <table>
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col style={{ width: 500 }} />
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>수신자</th>
                <th>발송일</th>
                <th>발송자</th>
                <th>내용</th>
                <th>클립보드</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3</td>
                <td>김다운:상담완료</td>
                <td>2024-05-14 16:12</td>
                <td>박수현</td>
                <td>
                  <div
                    className="ui-ellipsis"
                    style={{ maxWidth: 500 }}
                    title="
                    [랭귀지큐브 구로센터] 안녕하세요?^^ 오늘 오후 2시 레벨테스트 및 상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이"
                  >
                    [랭귀지큐브 구로센터] 안녕하세요?^^ 오늘 오후 2시 레벨테스트 및
                    상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이
                  </div>
                </td>
                <td>
                  <Buttons className="outlined small">복사</Buttons>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>김다운:예약완료</td>
                <td>2024-05-09 09:02</td>
                <td>송은주</td>
                <td>
                  <div
                    className="ui-ellipsis"
                    style={{ maxWidth: 500 }}
                    title="
                    [랭귀지큐브 구로센터] 안녕하세요?^^ 오늘 오후 2시 레벨테스트 및 상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이"
                  >
                    [랭귀지큐브 구로센터] 안녕하세요?^^ 오늘 오후 2시 레벨테스트 및
                    상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이
                  </div>
                </td>
                <td>
                  <Buttons className="outlined small">복사</Buttons>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>김다운:예약완료</td>
                <td>2024-05-07 17:57</td>
                <td>한시내</td>
                <td>
                  <div
                    className="ui-ellipsis"
                    style={{ maxWidth: 500 }}
                    title="
                    [랭귀지큐브 구로센터] 안녕하세요?^^ 오늘 오후 2시 레벨테스트 및 상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이"
                  >
                    [랭귀지큐브 구로센터] 안녕하세요?^^ 오늘 오후 2시 레벨테스트 및
                    상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이상담이
                  </div>
                </td>
                <td>
                  <Buttons className="outlined small">복사</Buttons>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <div>paging</div> */}
      </div>
    </div>
  );
};

export default SmsListModal;
