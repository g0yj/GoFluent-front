import useEvaluationStatusWindow from "@/app/helper/windows-hooks/use-evaluation-status-window";
import useLdfWindow from "@/app/helper/windows-hooks/use-ldf-window";
import Buttons from "@/components/Buttons";

/**
 * 강사 평가현황 상세 모달
 */
const EvaluationStatusModal = () => {
  const { data } = useEvaluationStatusWindow();
  const { openLdfWindow } = useLdfWindow();

  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">{`${data.year}년 ${data.month}월 ${data.teacherName} 강사 평가현황`}</div>

        <div>
          <Buttons className="outlined small text-center" style={{ width: 80 }}>
            PRINT
          </Buttons>
        </div>
      </div>

      <div className="ui-info-table txt-mid another td fixed sp-mt-20">
        <table>
          <tr>
            <th>평가인원수</th>
            <td>{data.gradeCount}</td>
            <th>총점</th>
            <td>{data.total}</td>
            <th>평점</th>
            <td>{data.gradeAvg}</td>
          </tr>
        </table>

        <table className="sp-mt-20">
          <colgroup>
            <col style={{ width: "50px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "80px" }} />
            <col />
            <col style={{ width: "100px" }}  />
          </colgroup>

          <thead>
            <tr>
              <th>No</th>
              <th>수업일</th>
              <th>학습자</th>
              <th>별점</th>
              <th>설명</th>
              <th>LDF</th>
            </tr>
          </thead>
          <tbody>
            {data?.ldfList?.map((item, index) => (
              <tr key={item.id}>
                <td>{index+1}</td>
                <td>{`${item.date} ${item.endTime}`}</td>
                <td>{`${item.userName.slice(0, 1)}**`}</td>
                <td>{item.grade}</td>
                <td>{item.evaluation}</td>
                <td>
                  <Buttons className="outlined small" onClick={() => openLdfWindow(item.ldf.id)}>
                    보기
                  </Buttons>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationStatusModal;
