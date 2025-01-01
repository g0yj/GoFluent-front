import { TeacherType } from "@/app/api/common";
import ServiceLecture from "@/app/service/service-lecture";
import ServiceResv from "@/app/service/service-resv";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

const statusOption = [
  { label: "대기", value: "WAITING" }, 
  { label: "취소", value: "CANCEL" },
  { label: "정상", value: "NORMAL" },
];

const LectureStatus = {
  valid: { key: "VALID", title: "기본 조회" },
  attending: { key: "ATTENDING", title: "수강중" },
  waiting: { key: "WAITING", title: "대기중" },
  complete: { key: "COMPLETE", title: "수강완료" },
  // refund: { key: "REFUND", title: "환불" },
};

const LectureStatusComponents = [
  LectureStatus.attending,
  LectureStatus.waiting,
  LectureStatus.complete,
  // LectureStatus.refund,
];

const LearnerManagementDetailLesson = ({member}) => {
  const [selectedLecture, setSelectedLecture] = useState(null);

  return selectedLecture ? (
    <MemberLecture
      member={member}
      lecture={selectedLecture}
      goBack={() => setSelectedLecture(null)}
    />
  ) : (
    <MemberLectureList member={member} selectLecture={setSelectedLecture} />
  );
};

const MemberLectureList = ({ member, selectLecture }) => {
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
      {LectureStatusComponents.map(({ key, title }) => (
        <MemberDetailLectureListDetail
          key={key}
          status={key}
          title={title}
          member={member}
          selectLecture={selectLecture}
        />
      ))}
    </div>
  );
};

const MemberDetailLectureListDetail = ({ status, title, member, selectLecture }) => {
  const [lectureList, setLectureList] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = {
          status,
        };
        const res = await ServiceResv.getCourseList(member.id, data);
        setLectureList(res);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetch();
  }, [member.id, status]);

  return (
    <div>
      <div>
        <div className="ui-sub-title small has-bg sp-mt-20">
          <div className="title">
            <div className="tit-wrap">
              <div className="tit">{title}</div>
            </div>
          </div>
        </div>

        <div className="ui-info-table small sp-mt-5">
          <table>
            <colgroup>
              <col style={{ width: 50 }} />
              <col />
              <col style={{ width: 70 }} />
              <col style={{ width: 70 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 70 }} />
              <col style={{ width: 80 }} />
              <col style={{ width: 90 }} />
              <col style={{ width: 50 }} />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>과정 </th>
                <th>예약현황</th>
                <th>잔여횟수</th>
                <th>수강기간</th>
                <th>담당강사</th>
                <th>부담임강사</th>
                <th>등록일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {lectureList?.total !== 0 ? (
                lectureList?.list?.map((lec, i) => (
                  <tr className="text-center" key={`lecture-${lec.id}`}>
                    <td>{i + 1}</td>
                    <td className="txt-secondary-high ui-ellipsis">
                      {/* <Buttons
                        className="ui-link secondary-high ui-ellipsis"
                        ellipsis
                        title={lec.name}
                        onClick={() => selectLecture(lec)}
                      > */}
                        {lec.name}
                      {/* </Buttons> */}
                    </td>
                    <td>{`${lec.assignmentCount} / ${lec.lessonCount}`}</td>
                    <td>{`${lec.remainCount}`}</td>
                    <td>
                      {`${lec.startDate}`} <br /> ~ {`${lec.endDate}`}
                    </td>
                    <td>{lec.teacherName}</td>
                    <td>{lec.assistantTeacherName}</td>
                    <td>{`${lec.createDate}`}</td>
                    <td>
                      {statusOption.find(option => option.value === lec.status)?.label}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colSpan={9}>{title} 과정이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MemberLecture = ({ member, lecture, goBack }) => {
  const [historyList, setHistoryList] = useState(null);
  const [lectureData, setLectureData] = useState(null);
  const [teacherList, setTeacherList] = useState(null);
  // 조회조건
  const paginationData = usePagination();

  const onModifyPress = async () => {
    try {
      const saveData = {
        lessonCount: lectureData.lessonCount,
        countChangeReason: lectureData.countChangeReason,
        startDate: dayjs(lectureData.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(lectureData.endDate).format("YYYY-MM-DD"),
        dateChangeReason: lectureData.dateChangeReason,
        cancelReason: lectureData.cancelReason,
        teacherId: lectureData.teacherId,
        assistantTeacherId: lectureData.assistantTeacherId,
      };
      await ServiceLecture.update(member.id, lecture.id, saveData);
      await getHistories();
    } catch (error) {
      console.error(error.message);
    }
  };

  const onChangeLectureData = (data) => {
    setLectureData((prev) => ({ ...prev, ...data }));
  };

  const getTeachers = useCallback(async () => {
    try {
      const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
      setTeacherList(res.teachers);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getHistories = useCallback(async () => {
    try {
      const res = await ServiceLecture.getHistories(member.id, lecture.id, paginationData.page);
      setHistoryList(res.list);
      paginationData.setTotalPage(res.totalPage);
    } catch (error) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lecture.id, member.id, paginationData.page]);

  const init = useCallback(async () => {
    setLectureData(lecture);
    getTeachers();
  }, [getTeachers, lecture]);

  useEffect(() => {
    getHistories();
  }, [getHistories]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div>
      <div className="ui-sub-title small sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{member.name} - 수강정보수정</div>
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
              <th>언어</th>
              <td>영어</td>
            </tr>
            <tr>
              <th>과정</th>
              <td>
                <input type="text" className="input-init" value={lecture.name} />
              </td>
            </tr>
            <tr>
              <th>레슨횟수</th>
              <td>
                <div className="layout-flex gap-20">
                  <div className="gap-s">
                    <input
                      type="text"
                      className="input-init"
                      defaultValue={lectureData?.lessonCount || 0}
                      style={{ width: 70 }}
                      onChange={({ target: { value } }) =>
                        onChangeLectureData({ lessonCount: Number(value) })
                      }
                    />
                    <div>회</div>
                  </div>
                  <div className="gap-s">
                    <div>변경시사유 : </div>
                    <input
                      type="text"
                      className="input-init"
                      value={lectureData?.countChangeReason}
                      onChange={({ target: { value } }) =>
                        onChangeLectureData({ countChangeReason: value })
                      }
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>배정횟수</th>
              <td>{lectureData?.assignmentCount} 회</td>
            </tr>
            <tr>
              <th>잔여횟수</th>
              <td>{lectureData?.remainCount} 회</td>
            </tr>
            <tr>
              <th>수강기간</th>
              <td>
                <div className="ui-datepicker-wrap">
                  <div>
                    <DatePicker
                      selected={lectureData?.startDate}
                      onChange={(date) => onChangeLectureData({ startDate: date })}
                      selectStart
                      startDate={lectureData?.startDate}
                      endDate={lectureData?.endDate}
                    ></DatePicker>
                  </div>
                  <div className="txt-grey500">~</div>
                  <div>
                    <DatePicker
                      selected={lectureData?.endDate}
                      onChange={(date) => onChangeLectureData({ endDate: date })}
                      selectStart
                      startDate={lectureData?.startDate}
                      endDate={lectureData?.endDate}
                    ></DatePicker>
                  </div>

                  <div className="layout-flex" style={{ marginLeft: 10 }}>
                    <div className="gap-s">
                      <div>변경시사유 : </div>
                      <input
                        type="text"
                        className="input-init"
                        value={lectureData?.dateChangeReason}
                        onChange={({ target: { value } }) =>
                          onChangeLectureData({ dateChangeReason: value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>담당강사</th>
              <td>
                <button className="ui-select">
                  <select
                    className="input-init"
                    value={lectureData?.teacherId}
                    onChange={({ target: { value } }) => onChangeLectureData({ teacherId: value })}
                  >
                    <option value="">-선택-</option>
                    {teacherList?.map((item) => (
                      <option value={item.value} key={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>부담임강사</th>
              <td>
                <button className="ui-select">
                  <select
                    className="input-init"
                    value={lectureData?.assistantTeacherId}
                    onChange={({ target: { value } }) =>
                      onChangeLectureData({ assistantTeacherId: value })
                    }
                  >
                    <option value="">-선택-</option>
                    {teacherList?.map((item) => (
                      <option value={item.value} key={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>등록일</th>
              <td>{lectureData?.createDate}</td>
            </tr>
            <tr>
              <th>상태</th>
              <td>
                <div className="ui-radio-group size-small">
                  {["대기", "취소", "정상"].map((el, i) => {
                    return (
                      <div key={i}>
                        <input type="radio" id={`${el}-${i}`} checked={el} name="Clarity" />
                        <label htmlFor={`${el}-${i}`}>{el}</label>
                      </div>
                    );
                  })}
                </div>
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
      </div>

      <div className="ui-sub-title small sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">수강관리 이력</div>
          </div>
        </div>
      </div>

      <div className="ui-list-table sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 60 }} />
            <col />
            <col />
            <col />
            <col style={{ width: 350 }} />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>날짜</th>
              <th>처리자</th>
              <th>구분</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            {historyList?.map((history, index) => (
              <tr key={history.id}>
                <td>{index + 1}</td>
                <td>{history.modifiedOn}</td>
                <td>{history.modifierName}</td>
                <td>{history.type}</td>
                <td className="pre-wrap">{history.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PageNations key={paginationData.startPage} data={paginationData} />
    </div>
  );
};

export default LearnerManagementDetailLesson;
