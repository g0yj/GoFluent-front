import usePrintMemberTestWindow from "@/app/helper/windows-hooks/use-print-member-test-window";
import ServiceTest from "@/app/service/service-test";
import Buttons from "@/components/Buttons";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { default as ReactDatePicker } from "react-datepicker";

const LearnerManagementDetailTest = ({ member, memberId}) => {
  const [listData, setListData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const onSelectDate = (data) => {
    setSelectedDate(data);
  };

  const goBack = () => {
    setSelectedDate(null);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ServiceTest.getList(memberId);
        console.log(data);
        setListData(data.levelTest);
      } catch (e) {
        console.error(e.message);
      }
    };
    fetch();
  }, [memberId]);

  return (
    <div>
      {!selectedDate && (
        <div className="ui-sub-title sticky-tabs sp-mt-10">
          <div className="title">
            <div className="tit-wrap">
              <div className="tit">{member.name}</div>
              <small>({member.email})</small>
            </div>
          </div>
        </div>
      )}

      {selectedDate ? (
        <MemberDetailTestForm member={member} selectedData={selectedDate} goBack={goBack} />
      ) : (
        <MemberDetailTestList
          listData={listData}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      )}
    </div>
  );
};

const MemberDetailTestList = ({ listData, selectedDate, onSelectDate }) => {
  return (
    <div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>테스트 일시</th>
              <td colSpan={3}>
                <div className="ui-datepicker-wrap">
                  <select
                    className="input-init"
                    value={selectedDate}
                    onChange={({ target: { value } }) => onSelectDate(value)}
                  >
                    <option>- 선택 -</option>
                    {listData?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.testStartTime}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MemberDetailTestForm = ({ member, selectedData, goBack }) => {
  const { openPrintMemberTestWindow } = usePrintMemberTestWindow();

  const [data, setData] = useState();
  const [recommendedLevel, setRecommendedLevel] = useState([]);

  const fileRef = useRef();

  const onChangeData = (item) => {
    setData((prev) => ({ ...prev, ...item }));
  };

  const handleCheckboxChange = (event, key) => {
    const { checked } = event.target;
    setRecommendedLevel(prevLevel => 
      checked
        ? [...prevLevel, key]
        : prevLevel.filter(item => item !== key)
    );
  };

  const onModifyClick = async () => {
    const formData = new FormData();

    for (let key in data) {
      if (key === "testStartTime") {
        formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm:ss"));
      } else if (key === "studyTypeEtc" && data[key]) {
        formData.append("studyType", "ETC");
        formData.append(key, data[key]);
      } else if (data[key] && data[key] !== "NULL" && data[key] !== "0") {
        formData.append(key, data[key]);
      }
    }

    formData.delete('recommendedLevel');
    formData.append('recommendedLevel', recommendedLevel.filter(item => item !== null));

    formData.append("isDeleteFile", !data?.file?.name);
    for (let key of formData.keys()) {
      console.log(key);
      console.log(formData.get(key));
    }

    // 파일을 FormData에 추가
    if (data?.file?.[0]) {
      formData.append('file', data.file[0]); // 단일 파일인 경우
  } else {
      // 파일이 없는 경우 처리 로직
      formData.append('isDeleteFile', 'true');
  }

    // FormData 객체를 직접 출력하여 내용 확인
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    await ServiceTest.update(member.id, selectedData, formData);
  };

  const onCreateClick = async () => {
    const formData = new FormData();

    for (let key in data) {
      if (key === "testStartTime") {
        console.log("testStartTime ==>", dayjs(data[key]).format("YYYY-MM-DD HH:mm:ss"));
        formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm:ss"));
      } else if (key === "studyTypeEtc" && data[key]) {
        formData.append("studyType", "ETC");
        formData.append(key, data[key]);
      } else if (data[key] && data[key] !== "null") {
        formData.append(key, data[key]);
      }
    }

    formData.append("isDeleteFile", !data?.file?.name);
    await ServiceTest.register(member.id, data);
  };

  const onDeleteClick = async () => {
    await ServiceTest.delete(member.id, data.id);
  };

  const onPrintClick = () => {
    openPrintMemberTestWindow();
  };

  const getData = useCallback(async () => {
    const res = await ServiceTest.get(member.id, selectedData);
    setData(res.levelTest);
    setRecommendedLevel(res.recommendedLevel);
  }, [member.id, selectedData]);

  useEffect(() => {
    if (selectedData) {
      getData();
    }
  }, [getData, selectedData]);

  return (
    <div>
      <div className="ui-sub-title sticky-tabs sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">{member.name}</div>
            <small>({member.email})</small>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>테스트 일시</th>
              <td>
                <div className="ui-datepicker-wrap">
                  <div>
                    {data?.testStartTime}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>Interviewer</th>
              <td>
                {data?.interviewer}
              </td>
            </tr>
            <tr>
              <th>OBT</th>
              <td>
                {data?.obt}
              </td>
            </tr>
            <tr>
              <th>테스트결과</th>
              <td>
                <div className="ui-detail-list col-2">
                  <div className="label">RBT</div>
                  <div className="cont">
                    {data?.rbt}
                  </div>
                  <div className="label">LBT</div>
                  <div className="cont">
                    {data?.lbt}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>TEST IP</th>
              <td>
                {data?.testIp}
              </td>
            </tr>
            <tr>
              <th>특이사항</th>
              <td>
                {data?.note}
              </td>
            </tr>
            <tr>
              <th>첨부파일</th>
              <td>
                <Buttons
                  className="input-file outlined mid2"
                  onClick={() => fileRef.current.click()}
                >
                  <div className="flexYCenter gap">
                    파일첨부
                    <i className="fa-solid fa-paperclip txt-primary-deep"></i>
                  </div>

                  <input
                    ref={(ref) => (fileRef.current = ref)}
                    type="file"
                    className="input-init"
                    onChange={({ target: { files } }) => onChangeData({ file: files })}
                  />
                </Buttons>
                <div className="ui-detail-list col-2 space-none sp-mt-5">
                  <div className="label">첨부</div>
                  <div className="cont">
                    <Buttons type="button" className="xsmall txt-secondary-high">
                      {data?.file?.[0]?.name}
                    </Buttons>
                    {data?.file && (
                      <Buttons
                        type="button"
                        className="xsmall"
                        onClick={() => onChangeData({ file: "" })}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </Buttons>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">Basic Information</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>Purpose of Study</th>
              <td>
                {data?.purpose}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>What kind of English do you want to study and learn?</th>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="ui-check full">
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="lang-1-1"
                      checked={data?.studyType === "EC"}
                      onChange={({ target: { checked } }) =>
                        checked
                          ? onChangeData({ studyType: "EC" })
                          : onChangeData({ studyType: "" })
                      }
                    />
                    <label htmlFor="lang-1-1">English Conversation</label>
                  </div>
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="lang-1-2"
                      checked={data?.studyType === "BE"}
                      onChange={({ target: { checked } }) =>
                        checked
                          ? onChangeData({ studyType: "BE" })
                          : onChangeData({ studyType: "" })
                      }
                    />
                    <label htmlFor="lang-1-2">Business English</label>
                  </div>
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="lang-1-3"
                      checked={data?.studyType === "TS"}
                      onChange={({ target: { checked } }) =>
                        checked
                          ? onChangeData({ studyType: "TS" })
                          : onChangeData({ studyType: "" })
                      }
                    />
                    <label htmlFor="lang-1-3">Toeic Speaking</label>
                  </div>
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="lang-1-4"
                      checked={data?.studyType === "I"}
                      onChange={({ target: { checked } }) =>
                        checked ? onChangeData({ studyType: "I" }) : onChangeData({ studyType: "" })
                      }
                    />
                    <label htmlFor="lang-1-4">Interview</label>
                  </div>
                  <div className="check flex1">
                    <label htmlFor="lang-1-5">ETC.</label>
                    <input
                      type="text"
                      id="lang-1-5"
                      className="input-init full"
                      value={
                        [
                          "English Conversation",
                          "Business English",
                          "Toeic Speaking",
                          "Interview",
                        ].includes(data?.studyTypeEtc)
                          ? ""
                          : data?.studyTypeEtc
                      }
                      onChange={({ target: { value } }) => onChangeData({ studyTypeEtc: value })}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">Ability in Spoken English</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>Family Background</th>
              <td>
                {data?.familyBackground}
              </td>
            </tr>
            <tr>
              <th>Company or School</th>
              <td>
                {data?.usageType}
              </td>
            </tr>
            <tr>
              <th>Occupation</th>
              <td>
                {data?.occupation}
              </td>
            </tr>
            <tr>
              <th>Spare Time</th>
              <td>
                  {data?.spareTime}
              </td>
            </tr>
            <tr>
              <th>Travel Abroad </th>
              <td>
                  {data?.Travel}
              </td>
            </tr>
            <tr>
              <th>Future Plans</th>
              <td>
                {data?.futurePlans}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">Ability in Spoken English</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <tbody>
            <tr>
              <th rowSpan={5}>Pronunciation</th>
              <th className="n">Consonants</th>
              <td>
                <div className="ui-check full gap-10">
                  {[
                    { key: "R", title: "r" },
                    { key: "L", title: "l" },
                    { key: "P", title: "p" },
                    { key: "F", title: "f" },
                    { key: "B", title: "b" },
                    { key: "V", title: "v" },
                    { key: "S", title: "s" },
                    { key: "Z", title: "z" },
                    { key: "SH", title: "ʃ" },
                    { key: "EZH", title: "ʒ" },
                    { key: "CH", title: "ʧ" },
                    { key: "G", title: "ʤ" },
                    { key: "TTH", title: "ɵ" },
                    { key: "TH", title: "ð" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.consonaants?.includes(el.key);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.title}</strong> : el.title}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Vowels</th>
              <td>
                <div className="ui-check full gap-10">
                  {[
                    { key: "A", title: "iː" },
                    { key: "B", title: "ɪ" },
                    { key: "C", title: "ɛ" },
                    { key: "D", title: "æ" },
                    { key: "E", title: "ɔː" },
                    { key: "F", title: "ʋ" },
                    { key: "G", title: "uː" },
                    { key: "H", title: "ʌ" },
                    { key: "I", title: "ə" },
                    { key: "J", title: "eɪ" },
                    { key: "K", title: "oʋ" },
                    { key: "L", title: "aɪ" },
                    { key: "M", title: "aʋ" },
                    { key: "N", title: "ɔɪ" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.vowels?.includes(el.key);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.title}</strong> : el.title}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Clarity</th>
              <td>
                <div className="ui-radio-group size-small">
                  {[
                    { label: "hard to understand", value: "10" },
                    { label: "average", value: "20" },
                    { label: "easy to understand", value: "30" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.clarity?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Intonation</th>
              <td>
                <div className="ui-radio-group size-small">
                  {[
                    { label: "very Korean", value: "10" },
                    { label: "a bit Korean", value: "20" },
                    { label: "acceptable", value: "30" },
                    { label: "near native", value: "40" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.intonation?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Vocabulary</th>
              <td>
                <div className="ui-radio-group size-small">
                  {[
                    { label: "very limited", value: "10" },
                    { label: "limited", value: "20" },
                    { label: "average", value: "30" },
                    { label: "above average", value: "40" },
                    { label: "extensive", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.vocabulary?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th rowSpan={6}>
                Gramer <br />
                Correct Usage:
                <div className="n sp-mt-5">
                  ① Never <br />
                  ② Seldom <br />
                  ③ Sometimes <br />
                  ④ Usually <br />⑤ Always
                </div>
              </th>
              <th className="n">Verbs tense</th>
              <td>
                <div className="ui-radio-group size-small gap-10">
                  {[
                    { label: "① Never", value: "10" },
                    { label: "② Seldom", value: "20" },
                    { label: "③ Sometimes", value: "30" },
                    { label: "④ Usually", value: "40" },
                    { label: "⑤ Always", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.verbsTense?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Agreement</th>
              <td>
                <div className="ui-radio-group size-small gap-10">
                  {[
                    { label: "① Never", value: "10" },
                    { label: "② Seldom", value: "20" },
                    { label: "③ Sometimes", value: "30" },
                    { label: "④ Usually", value: "40" },
                    { label: "⑤ Always", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.agreement?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Prepositions</th>
              <td>
                <div className="ui-radio-group size-small gap-10">
                  {[
                    { label: "① Never", value: "10" },
                    { label: "② Seldom", value: "20" },
                    { label: "③ Sometimes", value: "30" },
                    { label: "④ Usually", value: "40" },
                    { label: "⑤ Always", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.prepositions?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Articles</th>
              <td>
                <div className="ui-radio-group size-small gap-10">
                  {[
                    { label: "① Never", value: "10" },
                    { label: "② Seldom", value: "20" },
                    { label: "③ Sometimes", value: "30" },
                    { label: "④ Usually", value: "40" },
                    { label: "⑤ Always", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.articles?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Plurals</th>
              <td>
                <div className="ui-radio-group size-small gap-10">
                    {[
                      { label: "① Never", value: "10" },
                      { label: "② Seldom", value: "20" },
                      { label: "③ Sometimes", value: "30" },
                      { label: "④ Usually", value: "40" },
                      { label: "⑤ Always", value: "50" },
                    ].map((el, i, arr) => {
                      const isHighlighted = data?.plurals?.includes(el.value);
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                          <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                            {isHighlighted ? <strong>{el.label}</strong> : el.label}
                          </p>
                          {i !== arr.length - 1 && (
                            <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                              |
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
              </td>
            </tr>
            <tr>
              <th className="n">Others</th>
              <td>
                <div className="ui-radio-group size-small gap-10">
                  {[
                    { label: "① Never", value: "10" },
                    { label: "② Seldom", value: "20" },
                    { label: "③ Sometimes", value: "30" },
                    { label: "④ Usually", value: "40" },
                    { label: "⑤ Always", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.others?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Strong Point</th>
              <td>
                {data?.strongPoint}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Weak Point</th>
              <td>
                {data?.weakPoint}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                Comprehension <br />
                How much does learner understand
              </th>
              <td>
                <div className="ui-radio-group size-small">
                  {[
                    { label: "almost nothing", value: "10" },
                    { label: "some parts", value: "20" },
                    { label: "most parts", value: "30" },
                    { label: "almost everything", value: "40" },
                    { label: "everything", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.comprehension?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                    
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Confidence</th>
              <td>
                <div className="ui-radio-group size-small gap-10">
                  {[
                    { label: "completely lacking", value: "10" },
                    { label: "lacking", value: "20" },
                    { label: "average", value: "30" },
                    { label: "above average", value: "40" },
                    { label: "very confident", value: "50" },
                  ].map((el, i, arr) => {
                    const isHighlighted = data?.confidence?.includes(el.value);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)', margin: 0 }}>
                          {isHighlighted ? <strong>{el.label}</strong> : el.label}
                        </p>
                        {i !== arr.length - 1 && (
                          <span style={{ color: 'var(--grey400)', marginLeft: '4px' }}>
                            |
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Additional Comments</th>
              <td>
                {data?.comments}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">Recommended Level</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-5">
        <table>
          <tbody>
            <tr>
              <td>
                <div className="ui-check full gap">
                  {[
                    { key: "R2", title: "Pre" },
                    { key: "R3", title: "300" },
                    { key: "R4", title: "400" },
                    { key: "R5", title: "500" },
                    { key: "R6", title: "600" },
                    { key: "R7", title: "700" },
                    { key: "R8", title: "800" },
                    { key: "R9", title: "900" },
                  ].map((el, i) => {
                    const isHighlighted = recommendedLevel?.includes(el.key);

                    return (
                      <div className="check" key={i}>
                        <p style={{ color: isHighlighted ? '' : 'var(--grey400)' }}>
                          {isHighlighted ? <strong>{el.title}</strong> : el.title}
                        </p>
                        <span style={{color: 'var(--grey400)'}}>
                          |
                        </span>
                      </div>
                    );
                  })}
                  <div className="check flex1">
                    <p style={{color: 'var(--grey400)'}}>ETC.</p>
                    <p style={{color: 'var(--grey400)'}}>{data?.spareTime}</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LearnerManagementDetailTest;