import Buttons from "@/components/Buttons";

/**
 * 강사공지 모달
 */
const NoticeTeacherModal = () => {
  // const { member } = useNoticeTeacherWindow();

  return (
    <div className="layout-popup-wrap">
      {/* 강사공지 모달 : <br />
      {!!member && <div>{JSON.stringify(member)}</div>} */}
      <div className="ui-location-wrap">
        <div className="ui-location-title">강사공지</div>
      </div>
      <div style={{ padding: 10 }}>
        <div className="ui-sub-title">
          <div className="title">
            <div className="tit-wrap">
              <div className="tit">RE:김미경222</div>
              <small>(mkkim@eosi.kr)</small>
            </div>
          </div>
        </div>

        {/* 등록 시 */}
        <div className="ui-info-table th-left sp-mt-10">
          <table>
            <colgroup>
              <col style={{ width: 150 }} />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>Manager</th>
                <td>김새롬</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>
                  2024-06-04 04:42
                  <Buttons className="xsmall">
                    <i className="fa-solid fa-xmark"></i>
                  </Buttons>
                </td>
              </tr>
              <tr>
                <th>Memo</th>
                <td>test</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ui-info-table th-left sp-mt-10">
          <table>
            <colgroup>
              <col style={{ width: 150 }} />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>Manager</th>
                <td>
                  <button className="ui-select">
                    <select className="input-init">
                      <option value="U1684455278686108">김새롬</option>
                      <option value="U1717398481702885">김시하</option>
                      <option value="U1658468539178711">박수현</option>
                      <option value="U1708587671231709">송은주</option>
                      <option value="U1370839971594082">채인숙</option>
                      <option value="U1670565899112697">한시내</option>
                    </select>
                  </button>
                </td>
              </tr>
              <tr>
                <th>Memo</th>
                <td>
                  <textarea className="input-init full" rows="5"></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="layout-between sp-mt-20">
          <div className="ml-auto gap-s">
            <Buttons className="outlined mid">목록</Buttons>
            <Buttons className="primary mid">등록</Buttons>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeTeacherModal;
