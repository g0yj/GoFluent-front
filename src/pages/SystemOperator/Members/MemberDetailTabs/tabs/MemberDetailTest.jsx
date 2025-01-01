import usePrintMemberTestWindow from "@/app/helper/windows-hooks/use-print-member-test-window";
import ServiceTest from "@/app/service/service-test";
import Buttons from "@/components/Buttons";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { default as ReactDatePicker } from "react-datepicker";
import ExcelDownload from "@/pages/SystemOperator/Members/ExcelDownload";

/**
 * 회원상세 > 테스트 탭
 */
const MemberDetailTest = ({ member, memberId }) => {
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
  }, [memberId, selectedDate]);

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

          <div className="control">
            <Buttons type="button" className="primary small" onClick={() => onSelectDate({})}>
              등록
            </Buttons>
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
  const [consonant, setConsonant] = useState([]);
  const [studyType, setStudyType] = useState([]);
  const [vowel, setVowel] = useState([]);
  const [excelData, setExcelData] = useState({});

  const fileRef = useRef();

  const levels = [
    { key: "R2", title: "Pre" },
    { key: "R3", title: "300" },
    { key: "R4", title: "400" },
    { key: "R5", title: "500" },
    { key: "R6", title: "600" },
    { key: "R7", title: "700" },
    { key: "R8", title: "800" },
    { key: "R9", title: "900" },
  ];

  const confidences = [
    { label: "completely lacking", value: "10" },
    { label: "lacking ", value: "20" },
    { label: "average", value: "30" },
    { label: "above average", value: "40" },
    { label: "very confident", value: "50" },
  ];

  const comprehensions = [
    { label: "almost nothing", value: "10" },
    { label: "some parts", value: "20" },
    { label: "most parts", value: "30" },
    { label: "almost everything", value: "40" },
    { label: "everything", value: "50" },
  ];

  const options = [
    { value: "", label: "--선택--" },
    { value: "10", label: "① Never" },
    { value: "20", label: "② Seldom" },
    { value: "30", label: "③ Sometimes" },
    { value: "40", label: "④ Usually" },
    { value: "50", label: "⑤ Always" },
  ];

  const vocabularys = [
    { label: "very limited", value: "10" },
    { label: "limited", value: "20" },
    { label: "average", value: "30" },
    { label: "above average", value: "40" },
    { label: "extensive", value: "50" },
  ];

  const intonations = [
    { label: "very Korean", value: "10" },
    { label: "a bit Korean", value: "20" },
    { label: "acceptable", value: "30" },
    { label: "near native", value: "40" },
  ];

  const claritys = [
    { label: "hard to understand", value: "10" },
    { label: "average", value: "20" },
    { label: "easy to understand", value: "30" },
  ];

  const vowels = [
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
  ];

  const consonants = [
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
  ];

  const studyTypes = [
    { id: "lang-1-1", value: "EC", label: "English Conversation" },
    { id: "lang-1-2", value: "BE", label: "Business English" },
    { id: "lang-1-3", value: "TS", label: "Toeic Speaking" },
    { id: "lang-1-4", value: "I", label: "Interview" },
  ];

  const onChangeData = (item) => {
    if (item.testStartTime) {
      const formattedDate = dayjs(item.testStartTime).format("YYYY-MM-DD HH:mm");
      item.testStartTime = formattedDate;
    }

    if (item.file) {
      if (item.file?.[0].size > 2000000) {
        alert("파일 용량이 2MB를 초과할 수 없습니다.");
        return;
      }
      const fileUrl = URL.createObjectURL(item.file?.[0]);
      const changeFile = {
        fileUrl: fileUrl,
        originalFile: item?.file?.[0].name,
      };
      setData((prev) => ({ ...prev, ...changeFile }));
    }
    
    setData((prev) => ({ ...prev, ...item }));
  };

  const handleCheckboxChange = (event, key, target) => {
    const { checked } = event.target;

    if (target === "recommendedLevel") {
      setRecommendedLevel((prevLevel) =>
        checked ? [...prevLevel, key] : prevLevel.filter((item) => item !== key)
      )
    } else if (target === "studyType") {
      setStudyType((prevLevel) =>
        checked ? [...prevLevel, key] : prevLevel.filter((item) => item !== key)
      )
    } else if (target === "consonant") {
      setConsonant((prevLevel) =>
        checked ? [...prevLevel, key] : prevLevel.filter((item) => item !== key)
      )
    } else if (target === "vowel") {
      setVowel((prevLevel) =>
        checked ? [...prevLevel, key] : prevLevel.filter((item) => item !== key)
      )
    }
  };

  const onModifyClick = async () => {
    const formData = new FormData();

    for (let key in data) {
      
      if (key === "testStartTime") {
        formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm"));
      } else if (key === "studyTypeEtc" && data[key]) {
        formData.append("studyType", "ETC");
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
    formData.delete("testEndTime")
    
    formData.delete("vowels")
    formData.append(
      "vowels",
      vowel.filter((item) => item != null)
    );
    
    formData.delete("consonants")
    formData.append(
      "consonants",
      consonant.filter((item) => item != null)
    );
    
    formData.delete("studyType")
    formData.append(
      "studyType",
      studyType.filter((item) => item != null)
    );

    formData.delete("recommendedLevel");
    formData.append(
      "recommendedLevel",
      recommendedLevel.filter((item) => item !== null)
    );

    // formData.append("isDeleteFile", !data?.file?.name);
    // for (let key of formData.keys()) {
    //   console.log(key);
    //   console.log(formData.get(key));
    // }

    formData.delete("file");
    
    // 파일을 FormData에 추가
    if(typeof data?.file !== "string") {
      if (data?.file?.[0]) {
        formData.append("file", data.file[0]); // 단일 파일인 경우
        formData.append("isDeleteFile", true);
      }
    } else if (typeof data?.file === "string" && data?.file !== "") {
      formData.append("isDeleteFile", false);
    } else  {
      // 파일이 없는 경우 처리 로직
      formData.append("isDeleteFile", true);
    }

    // FormData 객체를 직접 출력하여 내용 확인
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      await ServiceTest.update(member.id, selectedData, formData);
      goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const onCreateClick = async () => {
    const formData = new FormData();

    for (let key in data) {
      if (key === "testStartTime") {
        formData.append(key, dayjs(data[key]).format("YYYY-MM-DD HH:mm"));
      } else if (key === "studyTypeEtc" && data[key]) {
        formData.append("studyType", "ETC");
        formData.append(key, data[key]);
      } else if (data[key] && data[key] !== "null" && data[key] !== "0") {
        formData.append(key, data[key]);
      }
    }

    formData.delete("vowels")
    formData.append(
      "vowels",
      vowel.filter((item) => item != null)
    );
    
    formData.delete("consonants")
    formData.append(
      "consonants",
      consonant.filter((item) => item != null)
    );
    
    formData.delete("studyType")
    formData.append(
      "studyType",
      studyType.filter((item) => item != null)
    );

    formData.delete("recommendedLevel");
    formData.append(
      "recommendedLevel",
      recommendedLevel.filter((item) => item !== null)
    );
    
    formData.append("isDeleteFile", false);

    formData.delete("file");
    // 파일을 FormData에 추가
    if (data?.file?.[0]) {
      formData.append("file", data.file[0]); // 단일 파일인 경우
    } 
    // else {
    //   // 파일이 없는 경우 처리 로직
    //   formData.append("isDeleteFile", "true");
    // }

    // // FormData 객체를 직접 출력하여 내용 확인
    // console.log("Create FormData entries:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      await ServiceTest.register(member.id, formData);
      goBack();
    } catch (error) {
      alert(error);
    }
  };

  const onDeleteClick = async () => {
    await ServiceTest.delete(member.id, data.id);
    goBack();
  };

  const onPrintClick = () => {
    openPrintMemberTestWindow({member, excelData});
  };

  // others
  const getInitialOption = (value) => {
    const option = options.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const getData = useCallback(async () => {
    const res = await ServiceTest.get(member.id, selectedData);
    setData(res.levelTest);
    setRecommendedLevel(res.recommendedLevel);
    setConsonant(res.consonants);
    setStudyType(res.studyType);
    setVowel(res.vowels);

    // studyTypes
    const initialstudyTypes = res.studyType
      .map((key) => {
        const studyType = studyTypes.find((studyType) => studyType.value === key);
        return studyType ? studyType.label : "";
      })
      .filter((title) => title !== null);

    // consonants
    const initialconsonants = res.consonants
      .map((key) => {
        const consonant = consonants.find((consonant) => consonant.key === key);
        return consonant ? consonant.title : "";
      })
      .filter((title) => title !== null);

    // vowels
    const initialvowels = res.vowels
      .map((key) => {
        const vowel = vowels.find((vowel) => vowel.key === key);
        return vowel ? vowel.title : "";
      })
      .filter((title) => title !== null);

    // clarity
    const initialclarity = (() => {
      const clarity = claritys.find((clarity) => clarity.value === res.levelTest.clarity);
      return clarity ? clarity.label : "";
    })();

    // intonations
    const initialintonation = (() => {
      const intonation = intonations.find(
        (intonation) => intonation.value === res.levelTest.intonation
      );
      return intonation ? intonation.label : "";
    })();

    // vocabulary
    const initialvocabulary = (() => {
      const vocabulary = vocabularys.find(
        (vocabulary) => vocabulary.value === res.levelTest.vocabulary
      );
      return vocabulary ? vocabulary.label : "";
    })();

    //others, verbsTense, agreement, prepositions, articles, plurals
    const initialOptions = {
      others: getInitialOption(res.levelTest.others),
      verbsTense: getInitialOption(res.levelTest.verbsTense),
      agreement: getInitialOption(res.levelTest.agreement),
      prepositions: getInitialOption(res.levelTest.prepositions),
      articles: getInitialOption(res.levelTest.articles),
      plurals: getInitialOption(res.levelTest.plurals),
    };

    // comprehension
    const initialcomprehension = (() => {
      const comprehension = comprehensions.find(
        (comprehension) => comprehension.value === res.levelTest.comprehension
      );
      return comprehension ? comprehension.label : "";
    })();

    // confidence
    const initialConfidence = (() => {
      const confidence = confidences.find(
        (confidence) => confidence.value === res.levelTest.confidence
      );
      return confidence ? confidence.label : "";
    })();

    // Recommended Level
    const initialRecommendedLevel = res.recommendedLevel
      .map((key) => {
        const level = levels.find((level) => level.key === key);
        return level ? level.title : "";
      })
      .filter((title) => title !== null);

    setExcelData({
      ...res.levelTest,
      studyType: initialstudyTypes,
      consonants: initialconsonants,
      vowels: initialvowels,
      clarity: initialclarity,
      intonation: initialintonation,
      vocabulary: initialvocabulary,
      others: initialOptions.others,
      verbsTense: initialOptions.verbsTense,
      agreement: initialOptions.agreement,
      prepositions: initialOptions.prepositions,
      articles: initialOptions.articles,
      plurals: initialOptions.plurals,
      comprehension: initialcomprehension,
      confidence: initialConfidence,
      recommendedLevels: initialRecommendedLevel, // 예: 추천 레벨의 타이틀 리스트를 추가
    });

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

        <div className="control">
          {/* <Buttons type="button" className="outlined small" onClick={onExcelClick}>
            <div className="flex gap">
              EXCEL
              <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
            </div>
          </Buttons> */}
          <ExcelDownload member={member} excelData={excelData} />
          <Buttons type="button" className="outlined small" onClick={onPrintClick}>
            <div className="flex gap">
              PRINT
              <i className="fa-solid fa-print txt-primary-deep"></i>
            </div>
          </Buttons>

          <Buttons type="button" className="grey-light small" onClick={goBack}>
            목록
          </Buttons>

          <Buttons type="button" className="grey small" onClick={onDeleteClick}>
            삭제
          </Buttons>
          <Buttons
            type="button"
            className={`${data?.id ? "grey-light" : "primary"} small`}
            onClick={data?.id ? onModifyClick : onCreateClick}
          >
            {data?.id ? "수정" : "등록"}
          </Buttons>
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
                    <ReactDatePicker
                      dateFormat="YYYY-MM-dd HH:mm"
                      showTimeSelect
                      timeIntervals={5}
                      dayClassName={(date) =>
                        dayjs(date).day() === 6
                          ? "saturday"
                          : dayjs(date).day() === 0
                          ? "sunday"
                          : null
                      }
                      selected={data?.testStartTime ? new Date(data.testStartTime) : null}
                      onChange={(date) => onChangeData({ testStartTime: date })}
                      startDate={data?.testStartTime ? new Date(data.testStartTime) : new Date()}
                      endDate={data?.testStartTime ? new Date(data.testStartTime) : new Date()}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>Interviewer</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  value={data?.interviewer}
                  onChange={({ target: { value } }) => onChangeData({ interviewer: value })}
                />
              </td>
            </tr>
            <tr>
              <th>OBT</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  value={data?.obt}
                  onChange={({ target: { value } }) => onChangeData({ obt: value })}
                />
              </td>
            </tr>
            <tr>
              <th>테스트결과</th>
              <td>
                <div className="ui-detail-list col-2">
                  <div className="label">RBT</div>
                  <div className="cont">
                    <input
                      type="text"
                      className="input-init text-right"
                      placeholder="0"
                      style={{ width: 104 }}
                      value={data?.rbt}
                      onChange={({ target: { value } }) => onChangeData({ rbt: value })}
                    />
                  </div>
                  <div className="label">LBT</div>
                  <div className="cont">
                    <input
                      type="text"
                      className="input-init text-right"
                      placeholder="0"
                      style={{ width: 104 }}
                      value={data?.lbt}
                      onChange={({ target: { value } }) => onChangeData({ lbt: value })}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>TEST IP</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  value={data?.testIp}
                  onChange={({ target: { value } }) => onChangeData({ testIp: value })}
                />
              </td>
            </tr>
            <tr>
              <th>특이사항</th>
              <td>
                <textarea
                  className="input-init full"
                  rows="4"
                  value={data?.note}
                  onChange={({ target: { value } }) => onChangeData({ note: value })}
                />
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
                    {data?.file && (
                      <div>
                        {/* <Buttons type="button" className="xsmall txt-secondary-high">
                          {data?.file?.[0]?.name}
                        </Buttons> */}
                        <a
                          href={data?.fileUrl}
                          download={data?.originalFile}
                          className="xsmall txt-secondary-high"
                        >
                          {data?.originalFile}
                        </a>
                        <Buttons
                          type="button"
                          className="xsmall"
                          onClick={() => onChangeData({ file: "", fileUrl: "", originalFile: "" })}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </Buttons>
                      </div>
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
                <input
                  type="text"
                  className="input-init full"
                  value={data?.purpose}
                  onChange={({ target: { value } }) => onChangeData({ purpose: value })}
                />
              </td>
            </tr>
            <tr>
              <th colSpan={2}>What kind of English do you want to study and learn?</th>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="ui-check full">
                  {studyTypes.map(({ id, value, label }) => (
                    <div className="check-group">
                      <div className="check" key={id}>
                        <input
                          type="checkbox"
                          className="input-init"
                          id={id}
                          checked={studyType?.includes(value)}
                          onChange={(event) => handleCheckboxChange(event, value, "studyType")}
                        />
                        <label htmlFor={id}>{label}</label>
                      </div>
                    </div>
                  ))}
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
            <div className="tit">Background Information</div>
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
                <input
                  type="text"
                  className="input-init full"
                  value={data?.familyBackground}
                  onChange={({ target: { value } }) => onChangeData({ familyBackground: value })}
                />
              </td>
            </tr>
            <tr>
              <th>Company or School</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  value={data?.usageType}
                  onChange={({ target: { value } }) => onChangeData({ usageType: value })}
                />
              </td>
            </tr>
            <tr>
              <th>Occupation</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  value={data?.occupation}
                  onChange={({ target: { value } }) => onChangeData({ occupation: value })}
                />
              </td>
            </tr>
            <tr>
              <th>Spare Time</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  value={data?.spareTime}
                  onChange={({ target: { value } }) => onChangeData({ spareTime: value })}
                />
              </td>
            </tr>
            <tr>
              <th>Travel Abroad </th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  value={data?.travelAbroad}
                  onChange={({ target: { value } }) => onChangeData({ travelAbroad: value })}
                />
              </td>
            </tr>
            <tr>
              <th>Future Plans</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  value={data?.futurePlans}
                  onChange={({ target: { value } }) => onChangeData({ futurePlans: value })}
                />
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
                  {consonants.map((el, i) => {
                    return (
                      <div className="check" key={i}>
                        <input
                          type="checkbox"
                          className="input-init"
                          id={el}
                          checked={consonant?.includes(el.key)}
                          onChange={(event) => handleCheckboxChange(event, el.key, "consonant")}
                        />
                        <label htmlFor={el}>{el.title}</label>
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
                  {vowels.map((el, i) => {
                    return (
                      <div className="check" key={i}>
                        <input
                          type="checkbox"
                          className="input-init"
                          id={el}
                          checked={vowel?.includes(el.key)}
                          onChange={(event) => handleCheckboxChange(event, el.key, "vowel")}
                        />
                        <label htmlFor={el}>{el.title}</label>
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
                  {claritys.map((el, i) => {
                    return (
                      <div key={`Clarity-${i}`}>
                        <input
                          type="radio"
                          id={`${el.value}`}
                          value={el.value}
                          name="Clarity"
                          checked={data?.clarity === el.value}
                          onChange={({ target: { checked } }) =>
                            checked
                              ? onChangeData({ clarity: el.value })
                              : onChangeData({ clarity: "" })
                          }
                        />
                        <label htmlFor={`Clarity-${el.value}`}>{el.label}</label>
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
                  {intonations.map((el, i) => {
                    return (
                      <div key={`Intonation-${i}`}>
                        <input
                          type="radio"
                          id={`${el.value}`}
                          value={el.value}
                          name="Intonation"
                          checked={data?.intonation === el.value}
                          onChange={({ target: { checked } }) =>
                            checked
                              ? onChangeData({ intonation: el.value })
                              : onChangeData({ intonation: "" })
                          }
                        />
                        <label htmlFor={`Intonation-${el.value}`}>{el.label}</label>
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
                  {vocabularys.map((el, i) => {
                    return (
                      <div key={`Vocabulary-${i}`}>
                        <input
                          type="radio"
                          id={`${el.value}-${i}`}
                          value={el.value}
                          name="Vocabulary"
                          checked={data?.vocabulary === el.value}
                          onChange={({ target: { checked } }) =>
                            checked
                              ? onChangeData({ vocabulary: el.value })
                              : onChangeData({ vocabulary: "" })
                          }
                        />
                        <label htmlFor={`Vocabulary-${el.value}-${i}`}>{el.label}</label>
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
                <div className="ui-selet">
                  <select
                    className="input-init"
                    value={data?.verbsTense}
                    onChange={({ target: { value } }) => onChangeData({ verbsTense: value })}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Agreement</th>
              <td>
                <div className="ui-selet">
                  <select
                    className="input-init"
                    value={data?.agreement}
                    onChange={({ target: { value } }) => onChangeData({ agreement: value })}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Prepositions</th>
              <td>
                <div className="ui-selet">
                  <select
                    className="input-init"
                    value={data?.prepositions}
                    onChange={({ target: { value } }) => onChangeData({ prepositions: value })}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Articles</th>
              <td>
                <div className="ui-selet">
                  <select
                    className="input-init"
                    value={data?.articles}
                    onChange={({ target: { value } }) => onChangeData({ articles: value })}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Plurals</th>
              <td>
                <div className="ui-selet">
                  <select
                    className="input-init"
                    value={data?.plurals || ""}
                    onChange={({ target: { value } }) => onChangeData({ plurals: value })}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <th className="n">Others</th>
              <td>
                <div className="ui-selet">
                  <select
                    className="input-init"
                    value={data?.others || ""}
                    onChange={({ target: { value } }) => onChangeData({ others: value })}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Strong Point</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  value={data?.strongPoint}
                  onChange={({ target: { value } }) => onChangeData({ strongPoint: value })}
                />
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Weak Point</th>
              <td>
                <input
                  type="text"
                  className="input-init full"
                  value={data?.weakPoint}
                  onChange={({ target: { value } }) => onChangeData({ weakPoint: value })}
                />
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                Comprehension <br />
                How much does learner understand
              </th>
              <td>
                <div className="ui-radio-group size-small">
                  {comprehensions.map((el, i) => {
                    return (
                      <div key={`Comprehension-${i}`}>
                        <input
                          type="radio"
                          id={`${el.value}-${i}`}
                          value={el.value}
                          name="Comprehension"
                          checked={data?.comprehension === el.value}
                          onChange={({ target: { checked } }) =>
                            checked
                              ? onChangeData({ comprehension: el.value })
                              : onChangeData({ comprehension: "" })
                          }
                        />
                        <label htmlFor={`Comprehension-${el.value}-${i}`}>{el.label}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Confidence</th>
              <td>
                <div className="ui-radio-group size-small">
                  {confidences.map((el, i) => {
                    return (
                      <div key={`Confidence-${i}`}>
                        <input
                          type="radio"
                          id={`${el.value}-${i}`}
                          value={el.value}
                          name="Confidence"
                          checked={data?.confidence === el.value}
                          onClick={({ target: { checked } }) =>
                            checked
                              ? onChangeData({ confidence: el.value })
                              : onChangeData({ confidence: "" })
                          }
                        />
                        <label htmlFor={`Confidence-${el.value}-${i}`}>{el.label}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Additional Comments</th>
              <td>
                <textarea
                  className="input-init full"
                  rows="4"
                  value={data?.comments}
                  onChange={({ target: { value } }) => onChangeData({ comments: value })}
                />
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
                <div className="ui-check full gap-10">
                  {levels.map((el, i) => {
                    return (
                      <div className="check" key={i}>
                        <input
                          type="checkbox"
                          className="input-init"
                          checked={recommendedLevel?.includes(el.key)}
                          onChange={(event) => handleCheckboxChange(event, el.key, "recommendedLevel")}
                        />
                        <label>{el.title}</label>
                      </div>
                    );
                  })}
                  <div className="check flex1">
                    <label htmlFor="ETC">ETC.</label>
                    <input
                      type="text"
                      className="input-init flex1"
                      value={data?.spareTime}
                      onChange={({ target: { value } }) =>
                        onChangeData({
                          recommendedLevel: "ETC",
                          recommendedLevelEtc: value,
                        })
                      }
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-10">
        <div className="ml-auto gap-s">
          {/* <Buttons type="button" className="outlined small">
            <div className="flex gap">
              EXCEL
              <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
            </div>
          </Buttons> */}
          <ExcelDownload member={member} excelData={excelData} />
          <Buttons type="button" className="outlined small" onClick={onPrintClick}>
            <div className="flex gap">
              PRINT
              <i className="fa-solid fa-print txt-primary-deep"></i>
            </div>
          </Buttons>

          <Buttons type="button" className="grey-light small" onClick={goBack}>
            목록
          </Buttons>

          <Buttons type="button" className="grey small" onClick={onDeleteClick}>
            삭제
          </Buttons>
          <Buttons
            type="button"
            className={`${data?.id ? "grey-light" : "primary"} small`}
            onClick={data?.id ? onModifyClick : onCreateClick}
          >
            {data?.id ? "수정" : "등록"}
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailTest;
