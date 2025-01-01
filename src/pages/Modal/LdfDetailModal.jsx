import useLdfWindow from "@/app/helper/windows-hooks/use-ldf-window";
import ServiceLDF from "@/app/service/service-ldf";
import { useCallback, useEffect, useState } from "react";

/**
 * LDF 모달
 */
const LdfDetailModal = () => {
  const { id } = useLdfWindow();

  const [data, setData] = useState({});

  const getLdfDetail = useCallback(async () => {
    try {
      const res = await ServiceLDF.getLdfDetail(id);
      console.log(res);
      if (res) {
        setData(res);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getLdfDetail();
    }
  }, [getLdfDetail, id]);

  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">LDF</div>
      </div>

      <div className="ui-scroll-wrap bottom-line sp-mt-20" style={{ height: 720 }}>
        <div className="ui-scroll-inner">
          <div className="ui-info-table th-left ">
            <table>
              <colgroup>
                <col style={{ width: 130 }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>Lesson</th>
                  <td dangerouslySetInnerHTML={{ __html: data?.lesson }}></td>
                </tr>
                <tr>
                  <th>Stress and Pronunciation</th>
                  <td dangerouslySetInnerHTML={{ __html: data?.contentSp }}></td>
                </tr>
                <tr>
                  <th>Vocabulary</th>
                  <td dangerouslySetInnerHTML={{ __html: data?.contentV }}></td>
                </tr>
                <tr>
                  <th>Sentence Structure & Grammar</th>
                  <td dangerouslySetInnerHTML={{ __html: data?.contentSg }}></td>
                </tr>
                <tr>
                  <th>Comment</th>
                  <td dangerouslySetInnerHTML={{ __html: data?.contentC }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LdfDetailModal;
