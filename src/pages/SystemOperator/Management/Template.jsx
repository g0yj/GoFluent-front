import Buttons from "@/components/Buttons";
import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ServiceCommon from "@/app/service/service-common";
import { template } from "lodash";

const Template = () => {
  const [template, setTemplate] = useState();

  const getTemplate = useCallback(async () => {
    const res = await ServiceCommon.getTemplates();

    setTemplate(res);
  })

  const onChangeTemplate = (e) => {
    setTemplate(e)
  }

  const updateTemplate = async() => {
    const sendText = {
      text: template
    }
    
    try {
      await ServiceCommon.updateTemplates(sendText)

      alert("저장되었습니다.");
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTemplate();
  }, [])

  return (
    <section className="ui-contents-wrap mid-width flex1">
      <div className="ui-contents-inner">
        <div>
          <div className="ui-location-wrap">
            <div className="ui-location-title">템플릿 관리</div>
            <div className="ui-location">
              <NavLink>
                <i className="fa-solid fa-house"></i>
              </NavLink>
              <NavLink>
                <i className="fa-solid fa-caret-right"></i>
                <strong>홈페이지관리</strong>
              </NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>템플릿 관리</strong>
            </div>
          </div>

          <div className="layout-between sp-mt-10">
            <div className="ml-auto gap">
              <Buttons className="outlined small" onClick={updateTemplate}>저장</Buttons>
            </div>
          </div>

          <div className="ui-info-table sp-mt-10">
            <table>
              <colgroup>
                <col style={{ width: 140 }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>템플릿</th>
                  <td>
                    <textarea
                      className="input-init full"
                      rows="5"
                      defaultValue={template?.text}
                      onChange={(e) => onChangeTemplate(e.target.value)}
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Template;
