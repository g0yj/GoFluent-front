import ServiceConsultations from "@/app/service/service-consultations";
import Buttons from "@/components/Buttons";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";

//배경색 추가 필요
const Background = [
  { key: null, backgroundColor: "" },
  { key: "10", backgroundColor: "" },
  { key: "20", backgroundColor: "bgc-c-orange" },
  { key: "30", backgroundColor: "bgc-c-yellow" },
  { key: "40", backgroundColor: "bgc-c-green" },
];

/**
 * 회원상담 > 상담 탭
 */
const MemberDetailConsultation = ({ member }) => {
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [dataList, setDataList] = useState(null);

  const onSelectedChange = (data) => {
    setSelectedConsultation(data);
  };

  const geBack = () => {
    setSelectedConsultation(null);
    init();
  };

  const init = useCallback(async () => {
    try {
      const res = await ServiceConsultations.getConsultationListFromUserId(member.id);

      setDataList(res.consultations);
    } catch (error) {
      console.error(error.message);
    }
  }, [member.id]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div>
      {!selectedConsultation ? (
        <div>
          <div className="ui-sub-title sp-mt-10">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">{member.name}</div>
                <small>({member.email})</small>
              </div>
            </div>

            <div>
              <Buttons className="primary small" onClick={() => onSelectedChange({})}>
                등록
              </Buttons>
            </div>
          </div>
          {dataList?.map((item) => (
            <MemberConsultation key={item.id} data={item} onSelectedChange={onSelectedChange} />
          ))}
        </div>
      ) : (
        <MemberConsultationRegister
          member={member}
          data={selectedConsultation}
          onSelectedChange={onSelectedChange}
          geBack={geBack}
        />
      )}
    </div>
  );
};

const MemberConsultation = ({ data, onSelectedChange }) => {
  return (
    <div className="ui-info-table th-left sp-mt-20">
      <table>
        <colgroup>
          <col style={{ width: 150 }} />
          <col />
          <col style={{ width: 150 }} />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>상담일시</th>
            <td>
              <Buttons className="ui-link secondary-high" onClick={() => onSelectedChange(data)}>
                {data.consultationDate}
              </Buttons>
            </td>
            <th>구분</th>
            <td>{data.type}</td>
          </tr>
          <tr>
            <th>상담직원</th>
            <td>{data.creatorName}</td>
            <th>수강내용</th>
            <td>-</td>
          </tr>
          <tr>
            <th>
              상담내용
              {data?.topFixedYn === "Y" && <span style={{ color: "red" }}> [ 중요 ] </span>}
            </th>
            <td
              colSpan={3}
              className={
                Background?.find((item) => item.key === data.backgroundColor)?.backgroundColor
              }
              style={{
                whiteSpace: "pre-wrap",
                fontWeight: data.fontBoldYn ? "bold" : "normal",
              }}
            >
              {data.details}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const MemberConsultationRegister = ({ member, data, onSelectedChange, geBack }) => {
  const [consultationData, setConsultationData] = useState(null);

  const onChangeData = (data) => {
    setConsultationData((prev) => ({ ...prev, ...data }));
  };

  const onSubmitPress = async () => {
    try {
      if (data?.id) {
        const saveData = {
          ...consultationData,
          consultationDate: dayjs(consultationData?.consultationDate).format("YYYY-MM-DD HH:mm"),
        };

        delete saveData.id;
        await ServiceConsultations.modifyConsultation(member.id, consultationData.id, saveData);
      } else {
        const saveData = {
          ...consultationData,
          consultationDate: dayjs(consultationData?.consultationDate).format("YYYY-MM-DD HH:mm"),
        };
        await ServiceConsultations.createConsultation(member.id, saveData);
      }
      geBack();
    } catch (error) {
      console.error(error.message);
    }
  };

  const init = useCallback(async () => {
    try {
      const res = await ServiceConsultations.getConsultation(member?.id, data?.id);
      setConsultationData(res);
    } catch (error) {
      console.error(error.message);
    }
  }, [data.id, member.id]);

  useEffect(() => {
    if (data?.id) {
      init();
    }
  }, [init, data?.id]);

  return (
    <div>
      <div className="ui-sub-title small sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">
              {member.name} - 상담 {data?.id ? "수정" : "등록"}
            </div>
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
              <th>상담일시</th>
              <td>
                <div className="ui-datepicker-wrap">
                  <div>
                    <ReactDatePicker
                      dateFormat="YYYY-MM-dd HH:mm"
                      showTimeSelect
                      selected={
                        consultationData?.consultationDate
                          ? new Date(consultationData?.consultationDate)
                          : new Date()
                      }
                      timeIntervals={5}
                      onChange={(date) =>
                        onChangeData({
                          consultationDate: date,
                        })
                      }
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
              </td>
            </tr>
            <tr>
              <th>구분</th>
              <td>
                <div className="ui-radio-group size-small">
                  {[
                    { key: "COURSE_REGISTRATION", title: "수강등록" },
                    { key: "PROGRESS", title: "진도" },
                    { key: "LESSON", title: "레슨" },
                    { key: "RESERVATION", title: "예약" },
                    { key: "CLASS_CONTENT", title: "수업내용" },
                    { key: "TEACHER", title: "강사" },
                    { key: "ETC", title: "기타" },
                  ].map((el, i) => {
                    return (
                      <div key={i}>
                        <input
                          type="radio"
                          id={`${el.key}-${i}`}
                          name="type"
                          checked={el.key === consultationData?.type}
                          onChange={() => onChangeData({ type: el.key })}
                        />
                        <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th>상단 고정 설정 </th>
              <td>
                <div className="flexYCenter gap-10">
                  <div className="ui-check">
                    <div className="check">
                      <input
                        type="checkbox"
                        className="topFixedYn"
                        id="check-1-1"
                        checked={consultationData?.topFixedYn === "Y" ? true : false}
                        onChange={({ target: { checked } }) =>
                          onChangeData({ topFixedYn: checked ? "Y" : "N" })
                        }
                      />
                      <label htmlFor="check-1-1">
                        <strong className="m txt-primary size-bodyS">중요</strong>
                      </label>
                    </div>
                  </div>
                  <div>- 상담내역이 리스트 상단으로 올라갑니다. </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>배경색 설정</th>
              <td>
                <div className="ui-radio-group size-small">
                  {[
                    { key: "10", title: "배경색 없음" },
                    { key: "20", title: "주황색" },
                    { key: "30", title: "노랑색" },
                    { key: "40", title: "형광색" },
                  ].map((el, i) => {
                    return (
                      <div key={el.key}>
                        <input
                          type="radio"
                          id={`${el.key}-${i}`}
                          name="backgroundColor"
                          checked={consultationData?.backgroundColor === el.key}
                          onChange={() => onChangeData({ backgroundColor: el.key })}
                        />
                        <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <div className="flexYCenter gap-10">
                  <div>상담내용</div>
                  <div className="ui-check">
                    <div className="check">
                      <input
                        type="checkbox"
                        className="input-init"
                        id="check-2-1"
                        checked={consultationData?.fontBoldYn === "Y" ? true : false}
                        onChange={({ target: { checked } }) =>
                          onChangeData({ fontBoldYn: checked ? "Y" : "N" })
                        }
                      />
                      <label htmlFor="check-2-1"> 굵게</label>
                    </div>
                  </div>
                </div>
              </th>
              <td>
                <textarea
                  className="input-init full"
                  rows={8}
                  defaultValue={consultationData?.details}
                  onChange={({ target: { value } }) => onChangeData({ details: value })}
                />
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
            onClick={() => onSelectedChange(null)}
          >
            목록
          </Buttons>
        </div>
        <div>
          <Buttons
            className="primary small text-center"
            style={{ width: 80 }}
            onClick={onSubmitPress}
          >
            {data.id ? "수정" : "등록"}
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailConsultation;
