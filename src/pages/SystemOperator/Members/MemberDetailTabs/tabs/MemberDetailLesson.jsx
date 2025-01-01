import ServiceLesson from "@/app/service/service-lesson";
import ServiceMember from "@/app/service/service-members";
import ServiceReport from "@/app/service/service-report";
import Buttons from "@/components/Buttons";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";


const statusMessages = {
  "출석": "txt-secondary",
  "결석": "txt-error",
  "예약": "txt-ok-color"
};
/**
 * 회원상세 > 학습 탭
 */
const MemberDetailLesson = ({ member }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonList, setLessonList] = useState(null);

  // 표시정보
  const [lessonInfo, setLessonInfo] = useState(""); // 학습정보

  // 조회조건
  const paginationData = usePagination();
  const [year, setYear] = useState(dayjs(new Date).format("YYYY"));
  const [month, setMonth] = useState(dayjs(new Date).format("MM"));
  const [date, setDate] = useState(null);

  const getLessonInfo = async () => {
    const res = await ServiceMember.get(member.id);
    setLessonInfo(res.lessonInfo);
  }

  useEffect(() => {
    const fetch = async () => {
      const saveData = {
        page: paginationData.page,
        limit: 20,
        date: date ? `${year}-${month}-${date}` : null,
        yearMonth: date ? null : `${year}-${month}`,
        excludeCancel: true,
      };
      const res = await ServiceLesson.getList(member.id, saveData);

      paginationData.setTotalPage(res.totalPage);
      setLessonList(res.list);
      getLessonInfo();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member.id, paginationData.page, year, month, date, selectedLesson]);

  if (!lessonList) return null;

  return selectedLesson ? (
    <MemberLessonContents
      member={member}
      lesson={selectedLesson}
      goBack={() => setSelectedLesson(null)}
    />
  ) : (
    <MemberLessonListContents
      year={year}
      month={month}
      date={date}
      member={member}
      lessonInfo={lessonInfo}
      lessonList={lessonList}
      paginationData={paginationData}
      selectLesson={setSelectedLesson}
      setYear={setYear}
      setDate={setDate}
      setMonth={setMonth}
    />
  );
};

// 학습 내역 리스트
const MemberLessonListContents = ({
  year,
  month,
  date,
  member,
  lessonInfo,
  lessonList,
  paginationData,
  selectLesson,
  setYear,
  setMonth,
  setDate,
}) => {
  return (
    <div>
      <div className="ui-sub-title sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{member.name}</div>
            <small>({member.email})</small>
          </div>
        </div>
      </div>

      <div className="ui-info-table th-left sp-mt-20">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>학습정보</th>
              <td dangerouslySetInnerHTML={{ __html: lessonInfo}}>
              </td>
            </tr>

            <tr>
              <th>날짜</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select
                      className="input-init"
                      value={year}
                      onChange={({ target: { value } }) => setYear(value)}
                    >
                      <option value="2019">2019 년</option>

                      <option value="2020">2020 년</option>

                      <option value="2021">2021 년</option>

                      <option value="2022">2022 년</option>

                      <option value="2023">2023 년</option>

                      <option value="2024">2024 년</option>

                      <option value="2025">2025 년</option>

                      <option value="2026">2026 년</option>

                      <option value="2027">2027 년</option>

                      <option value="2028">2028 년</option>
                    </select>
                  </button>
                  <button className="ui-select">
                    <select
                      className="input-init"
                      value={month}
                      onChange={({ target: { value } }) => setMonth(value)}
                    >
                      <option value="01">01 월</option>

                      <option value="02">02 월</option>

                      <option value="03">03 월</option>

                      <option value="04">04 월</option>

                      <option value="05">05 월</option>

                      <option value="06">06 월</option>

                      <option value="07">07 월</option>

                      <option value="08">08 월</option>

                      <option value="09">09 월</option>

                      <option value="10">10 월</option>

                      <option value="11">11 월</option>

                      <option value="12">12 월</option>
                    </select>
                  </button>
                  <button className="ui-select">
                    <select
                      className="input-init"
                      value={date}
                      onChange={({ target: { value } }) => setDate(value)}
                    >
                      <option value="">-선택-</option>

                      <option value="01">01 일</option>

                      <option value="02">02 일</option>

                      <option value="03">03 일</option>

                      <option value="04">04 일</option>

                      <option value="05">05 일</option>

                      <option value="06">06 일</option>

                      <option value="07">07 일</option>

                      <option value="08">08 일</option>

                      <option value="09">09 일</option>

                      <option value="10">10 일</option>

                      <option value="11">11 일</option>

                      <option value="12">12 일</option>

                      <option value="13">13 일</option>

                      <option value="14">14 일</option>

                      <option value="15">15 일</option>

                      <option value="16">16 일</option>

                      <option value="17">17 일</option>

                      <option value="18">18 일</option>

                      <option value="19">19 일</option>

                      <option value="20">20 일</option>

                      <option value="21">21 일</option>

                      <option value="22">22 일</option>

                      <option value="23">23 일</option>

                      <option value="24">24 일</option>

                      <option value="25">25 일</option>

                      <option value="26">26 일</option>

                      <option value="27">27 일</option>

                      <option value="28">28 일</option>

                      <option value="29">29 일</option>

                      <option value="30">30 일</option>

                      <option value="31">31 일</option>
                    </select>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-list-table small sp-mt-20">
        <table>
          <colgroup>
            <col style={{ width: 40 }} />
            <col />
            <col />
            <col style={{ width: 100 }} />
            <col style={{ width: 50 }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>No</th>
              <th>수강시간</th>
              <th>과정</th>
              <th>강사</th>
              <th>출결</th>
              <th>학사보고서</th>
            </tr>
          </thead>
          <tbody>
            {lessonList?.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="text-center" key={index}>
                  <td rowSpan="2">{index}</td>
                  <td>
                    {item.date} {item.startTime} ~ {item.endTime}{" "}
                  </td>
                  <td>{item.courseName}</td>
                  <td>{item.teacherName}</td>
                  <td className={statusMessages[item.attendanceStatus]}>{item.attendanceStatus}</td>
                  <td>
                    <Buttons className={item.report ? "primary small" : "input-init active small"} style={{color: 'white'}} onClick={() => selectLesson(item)}>
                      {item.report ? "수정" : "등록"}
                    </Buttons>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5">
                    <p>{item.todayLesson}</p>
                    <p>{item.report}</p>
                    <p>{item.nextLesson}</p>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <PageNations key={paginationData.startPage} data={paginationData} />
    </div>
  );
};

// 학습 상세 내역
const MemberLessonContents = ({ member, lesson, goBack }) => {
  const [report, setReport] = useState(null);

  const onChangeSelectedReport = (data) => {
    setReport((prev) => ({ ...prev, ...data }));
  };

  const onSubmitClick = async () => {
    try {
      await ServiceReport.setReport(lesson?.id, report);
      goBack();
    } catch (error) {
      console.error(error.message);
    }
  };

  const init = useCallback(async () => {
    try {
      const res = await ServiceReport.getReport(lesson?.id);
      setReport(res);
    } catch (error) {
      console.error(error.message);
    }
  }, [lesson?.id]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div>
      <div className="ui-sub-title small sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{member.name}</div>
            <small>({member.email})</small>
          </div>
        </div>
      </div>

      <div className="ui-info-table th-left sp-mt-20">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>날짜</th>
              <td>
                {report?.date} {report?.startTime} ~ {report?.endTime}
              </td>
            </tr>
            <tr>
              <th>과정</th>
              <td>{report?.courseName}</td>
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
                          checked={el.key === report?.attendanceStatus}
                          name="Clarity"
                          onChange={() => onChangeSelectedReport({ attendanceStatus: el.key })}
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
                  minLength={5}
                  value={report?.todayLesson}
                  onChange={({ target: { value } }) =>
                    onChangeSelectedReport({ todayLesson: value })
                  }
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
                  minLength={20}
                  value={report?.report}
                  onChange={({ target: { value } }) => onChangeSelectedReport({ report: value })}
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
                  minLength={5}
                  value={report?.nextLesson}
                  onChange={({ target: { value } }) =>
                    onChangeSelectedReport({ nextLesson: value })
                  }
                />
                <div className="text-right xsmall txt-grey500">(0 / 최소 5자)</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-10">
        <div>
          <Buttons className="grey-light small text-center" style={{ width: 80 }} onClick={goBack}>
            목록
          </Buttons>
        </div>
        <div>
          <Buttons
            className="primary small text-center"
            style={{ width: 80 }}
            onClick={onSubmitClick}
          >
            저장
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailLesson;
