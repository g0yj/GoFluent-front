import ServiceReport from "@/app/service/service-report";
import Buttons from "@/components/Buttons";
import { useEffect, useState } from "react";

// 회원관리(1depth) > 학사보고서(2depth) > 학사보고서 등록/수정 폼 - 회원 학습 공통사용
const AcademicReportDetailForm = ({ academicReport, goBack, onSubmit: onSave }) => {
  const [data, setData] = useState(null);

  const onChangeData = (data) => {
    setData((prev) => ({ ...prev, ...data }));
  };

  const onSubmit = async () => {
    try {
      const saveData = {
        attendanceStatus: data?.attendanceStatus || "",
        todayLesson: data?.todayLesson || "",
        report: data?.report || "",
        nextLesson: data?.nextLesson || "",
      };

      await ServiceReport.setReport(academicReport.id, saveData);
      onSave();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log(academicReport);
    setData(academicReport);
  }, [academicReport]);

  return (
    <>
      <section className="ui-contents-wrap small-width flex1">
        <section className="ui-contents-inner">
          <div className="ui-location-wrap">
            <div className="ui-location-title">학사보고서</div>
          </div>

          <div>
            <div className="ui-info-table th-left sp-mt-20">
              <table>
                <colgroup>
                  <col style={{ width: 150 }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>날짜</th>
                    <td>{`${academicReport.date} ${academicReport.startTime} ~ ${academicReport.endTime}`}</td>
                  </tr>
                  <tr>
                    <th>회원명</th>
                    <td>{academicReport.userName}</td>
                  </tr>
                  <tr>
                    <th>과정</th>
                    <td>{academicReport.courseName}</td>
                  </tr>
                  <tr>
                    <th>콘텐츠</th>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>출결</th>
                    <td>
                      <div className="ui-radio-group size-small">
                        {[
                          { key: "R", title: "예약" },
                          { key: "Y", title: "출석" },
                          { key: "N", title: "결석" },
                        ].map((el, i) => {
                          return (
                            <div key={i}>
                              <input
                                type="radio"
                                id={`${el.key}-${i}`}
                                checked={el.key === data?.attendanceStatus}
                                name="attendanceStatus"
                                onChange={() => onChangeData({ attendanceStatus: el.key })}
                              />
                              <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Today&apos;s Lesson</th>
                    <td>
                      <textarea
                        className="input-init full"
                        rows={5}
                        value={data?.todayLesson || ""}
                        onChange={({ target: { value } }) => onChangeData({ todayLesson: value })}
                      />
                      <div className="text-right xsmall txt-grey500">(0 / 최소 5자)</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      Lesson Content <br />
                      and Feedback
                    </th>
                    <td>
                      <textarea
                        className="input-init full"
                        rows={5}
                        value={data?.report || ""}
                        onChange={({ target: { value } }) => onChangeData({ report: value })}
                      />
                      <div className="text-right xsmall txt-grey500">(0 / 최소 20자)</div>
                    </td>
                  </tr>
                  <tr>
                    <th>Next Lesson</th>
                    <td>
                      <textarea
                        className="input-init full"
                        rows={5}
                        value={data?.nextLesson || ""}
                        onChange={({ target: { value } }) => onChangeData({ nextLesson: value })}
                      />
                      <div className="text-right xsmall txt-grey500">(0 / 최소 5자)</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="layout-between sp-mt-10">
              <div>
                <Buttons
                  className="grey-light small text-center"
                  style={{ width: 80 }}
                  onClick={goBack}
                >
                  목록
                </Buttons>
              </div>
              <div>
                <Buttons
                  className="primary small text-center"
                  style={{ width: 80 }}
                  onClick={onSubmit}
                >
                  저장
                </Buttons>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default AcademicReportDetailForm;
