import useEmailWindow from "@/app/helper/windows-hooks/use-email-window";
import useNoticeTeacherWindow from "@/app/helper/windows-hooks/use-notice-teacher-window";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";
import ServiceCommon from "@/app/service/service-common";
import ServiceMember from "@/app/service/service-members";
import Buttons from "@/components/Buttons";
import { useCallback, useContext, useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { MemberManagementContext } from "../context/MemberManagementProvider";

const CoursePurposesList = [
  { key: "STUDY_ABROAD", title: "유학" },
  { key: "TEST", title: "시험" },
  { key: "WORK", title: "취업" },
  { key: "EMPLOYMENT", title: "현재업무상 필요" },
  { key: "DEVELOPMENT", title: "중장기 자기개발" },
];

const MemberForm = ({ data }) => {
  const forRegister = !data;

  const { refreshMemberList, onDeletedMember } = useContext(MemberManagementContext);
  const [isExpanded, setExpanded] = useState(false);

  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const [name, setName] = useState(data?.name ?? "");
  const [firstNameEn, setFirstNameEn] = useState(data?.firstNameEn ?? "");
  const [lastNameEn, setLastNameEn] = useState(data?.lastNameEn ?? "");
  const [nickname, setNickname] = useState(data?.nickname ?? "");
  const [textbook, setTextbook] = useState(data?.textbook ?? "");
  const [loginId, setLoginId] = useState(data?.loginId ?? "");
  const [email, setEmail] = useState(data?.email ?? "");
  const [isReceiveEmail, setIsReceiveEmail] = useState(data?.isReceiveEmail ?? true);
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(data?.gender ?? "");
  const [phone, setPhone] = useState(data?.phone ?? "");
  const [phoneType, setPhoneType] = useState(data?.phoneType ?? "H");
  const [cellPhone, setCellPhone] = useState(data?.cellPhone ?? "");
  const [isReceiveSms, setIsReceiveSms] = useState(data?.isReceiveSms ?? true);
  const [isOfficeWorker, setIsOfficeWorker] = useState(data?.isOfficeWorker ?? true);
  const [company, setCompany] = useState(data?.company ?? "");
  const [position, setPosition] = useState(data?.position ?? "");
  const [note, setNote] = useState(data?.note ?? "");
  const [lessonInfo, setLessonInfo] = useState(data?.lessonInfo ?? "");
  const [isActive, setIsActive] = useState(data?.active ?? true);
  const [zipcode, setZipcode] = useState(data?.zipcode ?? "");
  const [address, setAddress] = useState(data?.address ?? "");
  const [detailedAddress, setDetailedAddress] = useState(data?.detailedAddress ?? "");
  const [addressType, setAddressType] = useState(data?.addressType ?? "H");
  const [joinPath, setJoinPath] = useState(data?.joinPath ?? "ALL");
  const [languages, setLanguages] = useState(data?.languages ?? []);
  const [etcLanguage, setEtcLanguage] = useState(data?.etcLanguage ?? "");
  const [languageSkills, setLanguageSkills] = useState(data?.languageSkills ?? []);
  const [foreignCountry, setForeignCountry] = useState(data?.foreignCountry ?? "");
  const [foreignPeriod, setForeignPeriod] = useState(data?.foreignPeriod ?? "");
  const [foreignPurpose, setForeignPurpose] = useState(data?.foreignPurpose ?? "");
  const [coursePurposes, setCoursePurposes] = useState(data?.coursePurposes || []);

  const reset = () => {
    setName(data?.name ?? "");
    setFirstNameEn(data?.firstNameEn ?? "");
    setLastNameEn(data?.lastNameEn ?? "");
    setNickname(data?.nickname ?? "");
    setTextbook(data?.textbook ?? "");
    setLoginId(data?.loginId ?? "");
    setEmail(data?.email ?? "");
    setIsReceiveEmail(data?.isReceiveEmail ?? true);
    setPassword("");
    setGender(data?.gender ?? "");
    setPhone(data?.phone ?? "");
    setPhoneType(data?.phoneType ?? "H");
    setCellPhone(data?.cellPhone ?? "");
    setIsReceiveSms(data?.isReceiveSms ?? true);
    setIsOfficeWorker(data?.isOfficeWorker ?? "Y");
    setCompany(data?.company ?? "");
    setPosition(data?.position ?? "");
    setNote(data?.note ?? "");
    setLessonInfo(data?.lessonInfo ?? "");
    setIsActive(data?.active ?? true);
    setZipcode(data?.zipcode ?? "");
    setAddress(data?.address ?? "");
    setDetailedAddress(data?.detailedAddress ?? "");
    setAddressType(data.addressType ?? "");
    setJoinPath(data.joinPath ?? "ALL");
    setLanguages(data.languages ?? []);
    setEtcLanguage(data.etcLanguage ?? "");
    setLanguageSkills(data.languageSkills ?? []);
    setForeignCountry(data.foreignCountry ?? "");
    setForeignPeriod(data.foreignPeriod ?? "");
    setForeignPurpose(data.foreignPurpose ?? "");
    setCoursePurposes(data.coursePurposes ?? []);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !loginId ||
      !email ||
      !gender ||
      !cellPhone
    ) {
      alert("필수값을 입력해 주세요.");
      return;
    }

    const saveLanguageSkill = languageSkills.filter(
      (item) => item.languageTest !== null && item.score !== 'null'
    );

    let saveLanguages = languages;
    if (etcLanguage) {
      saveLanguages.push("ETC");
    }

    const saveData = {
      name,
      firstNameEn,
      lastNameEn,
      nickname,
      textbook,
      loginId,
      email,
      isReceiveEmail,
      password,
      gender,
      phone,
      phoneType,
      cellPhone,
      isReceiveSms,
      isOfficeWorker,
      company,
      position,
      note,
      lessonInfo,
      isActive,
      zipcode,
      address,
      detailedAddress,
      addressType,
      joinPath,
      languages: saveLanguages,
      etcLanguage,
      languageSkills: saveLanguageSkill,
      foreignCountry,
      foreignPeriod,
      foreignPurpose,
      coursePurposes,
      type: "S",
    };

    if (forRegister) {
      try {
        await ServiceMember.register(saveData);
        alert("신규 회원이 등록되었습니다.");
        if (refreshMemberList) refreshMemberList();
        reset();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await ServiceMember.update(data.id, saveData);
        if (refreshMemberList) refreshMemberList();
        alert("회원정보가 수정되었습니다.");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onClickDelete = () => {
    if (window.confirm("정말 회원을 삭제하시겠습니까?")) {
      deleted(data.id);
    }
  };

  const deleted = async (id) => {
    try {
      await ServiceMember.delete(id);
      alert("회원이 삭제되었습니다.");
      refreshMemberList();
      onDeletedMember();
    } catch (e) {
      alert(e.message);
    }
  };

  // 주소 검색 및 등록
  const open = useDaumPostcodePopup();

  const onSearchAddressComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setZipcode(data.zonecode);
    setAddress(fullAddress);
  };

  const searchAddress = () => {
    open({ onComplete: onSearchAddressComplete });
  };

  const { openEmailWindow } = useEmailWindow();
  const onClickSendEmail = () => {
    openEmailWindow([
      {
        name: data?.name,
        email: data?.email,
      },
    ]);
  };
  const { openSmsWindow } = useSmsWindow();
  const onClickSendSms = () => {
    openSmsWindow([
      {
        name: data?.name,
        phone: data?.cellPhone,
      },
    ]);
  };
  const { openNoticeTeacherWindow } = useNoticeTeacherWindow();

  const onClickNoticeTeacher = () => {
    openNoticeTeacherWindow({
      name: data?.name,
      phone: data?.cellPhone,
    });
  };

  const onClickLanguage = (text) => {
    if (languages.includes(text)) {
      const saveData = languages;
      const removedData = saveData.filter((item) => item !== text);
      setLanguages(removedData);
    } else {
      setLanguages((prev) => [...prev, text]);
    }
  };

  const onCheckLanguage = useCallback(
    (text) => {
      return languages.includes(text);
    },
    [languages]
  );

  const onChangeLanguageSkills = (languageTest, score) => {
    if (languageSkills.find((item) => item.languageTest === languageTest)) {
      if (score) {
        const saveData = languageSkills.map((item) => {
          if (item.languageTest === languageTest) {
            return {
              languageTest,
              score,
            };
          } else {
            return item;
          }
        });
        setLanguageSkills(saveData);
      } else {
        setLanguageSkills((prev) => prev.filter((item) => item.languageTest !== languageTest));
      }
    } else {
      setLanguageSkills((prev) => [...prev, { languageTest, score }]);
    }
  };

  const getLanguageSkillScore = (languageTest) => {
    const findItem = languageSkills?.find((item) => item.languageTest === languageTest);

    if (findItem) return findItem?.score ?? "";
  };

  const onChangeCoursePurposes = (checked, key) => {
    if (checked) {
      if (coursePurposes.length < 3) {
        setCoursePurposes((prev) => [...prev, key]);
      }
    } else {
      setCoursePurposes((prev) => prev.filter((item) => item !== key));
    }
  };

  // const makePhoneNumber = (value, callback) => {
  //   const rawPhone = value.replace(/-/g, "");
  //   let formattedPhone = "";

  //   if (rawPhone.length < 4) {
  //     formattedPhone = rawPhone;
  //   } else if (rawPhone.length < 8) {
  //     formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(3)}`;
  //   } else if (rawPhone.length < 11) {
  //     formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(3, 7)}-${rawPhone.slice(7)}`;
  //   } else {
  //     formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(3, 7)}-${rawPhone.slice(7, 11)}`;
  //   }

  //   const displayPhone = formattedPhone.length > 0 ? formattedPhone : "";
  //   callback(displayPhone);
  // };
  
  const formatHP = (value) => {
    const cleaned = value.replace(/\D/g, '');

    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);

    if (match) {
      const groups = match.slice(1);
      return `${groups[0]}${groups[1] ? '-' + groups[1] : ''}${groups[2] ? '-' + groups[2] : ''}`;
    }

    return value;
  }

  const handleChangeHP = (e) => {
    const value = e.target.value;
    const formattedValue = formatHP(value);
    setCellPhone(formattedValue);
  }

  const getTemplates = useCallback(async () => {
    if (forRegister) {
      const res = await ServiceCommon.getTemplates();
      setNote(res.text);
    }
  }, [forRegister]);

  useEffect(() => {
    getTemplates();
  }, [getTemplates]);

  return (
    <div>
      <div className="ui-sub-title sticky-tabs">
        <div className="title">
          <div className="tit-wrap">
            {forRegister ? (
              <div className="tit">회원등록</div>
            ) : (
              <>
                <div className="tit">{data.name}</div>
                <small>({data.email})</small>
              </>
            )}
          </div>
        </div>

        <div className="control">
          {forRegister ? (
            <div className="flex gap" style={{ marginLeft: 10 }}>
              <Buttons type="submit" className="primary small" onClick={onSubmit}>
                등록
              </Buttons>
            </div>
          ) : (
            <>
              <Buttons type="button" className="outlined xsmall" onClick={onClickSendEmail}>
                메일발송
              </Buttons>
              <Buttons type="button" className="outlined xsmall" onClick={onClickSendSms}>
                SMS발송
              </Buttons>
              <Buttons type="button" className="outlined xsmall" onClick={onClickNoticeTeacher}>
                강사공지
              </Buttons>

              <div className="flex gap" style={{ marginLeft: 10 }}>
                <Buttons type="submit" className="grey-light small" onClick={onSubmit}>
                  수정
                </Buttons>
                <Buttons type="button" className="grey small" onClick={onClickDelete}>
                  삭제
                </Buttons>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex sp-mt-10">
        <div className="ml-auto size-small txt-grey700">
          (<i className="require">*</i> 표시필수)
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
              <th>
                이름 <i className="require">*</i>
              </th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  placeholder="이름"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />{" "}
                {!forRegister && <span>{data?.id}</span>}
              </td>
            </tr>
            <tr>
              <th>
                영문이름 <small>(이름+성)</small>
              </th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  placeholder="First Name"
                  value={firstNameEn}
                  onChange={(e) => setFirstNameEn(e.target.value)}
                />{" "}
                <input
                  type="text"
                  className="input-init"
                  placeholder="Last Name"
                  value={lastNameEn}
                  onChange={(e) => setLastNameEn(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>닉네임</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>교재</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  placeholder="교재"
                  value={textbook}
                  onChange={(e) => setTextbook(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>
                아이디 <i className="require">*</i>
              </th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  placeholder="아이디"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                />{" "}
                <span className="txt-error-deep size-xsmall">
                  (* 아이디는 이메일을 입력해주시기 바랍니다.)
                </span>
              </td>
            </tr>
            <tr>
              <th>
                이메일 <i className="require">*</i>
              </th>
              <td>
                <div className="flexYCenter-inline">
                  <input
                    type="text"
                    className="input-init"
                    placeholder="이메일"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <span className="flexYCenter sp-mt-1">
                    <input
                      type="checkbox"
                      id="email"
                      checked={!!isReceiveEmail}
                      onChange={(e) => setIsReceiveEmail(e.target.checked)}
                    />
                    <label htmlFor="email">이메일 수신</label>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                비밀번호 <i className="require">*</i>
              </th>
              <td>
                <input
                  type="password"
                  className="input-init"
                  placeholder="비밀번호"
                  autoComplete="none"
                  required={password}
                  onChange={(e) => setPassword(e.target.value)}
                />{" "}
                {!forRegister && (
                  <span className="txt-error-deep size-xsmall">(변경시만 입력)</span>
                )}
              </td>
            </tr>
            <tr>
              <th>
                성별 <i className="require">*</i>
              </th>
              <td>
                <div className="ui-radio-group small">
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="M"
                      required
                      checked={gender === "M"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <label htmlFor="male">남</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="F"
                      required
                      checked={gender === "F"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <label htmlFor="female">여</label>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>유선전화</th>
              <td>
                <div className="flexYCenter-inline gap-10">
                  <input
                    type="tel"
                    className="input-init"
                    placeholder="숫자입력"
                    style={{ width: 124 }}
                    value={phone}
                    // onChange={(e) => makePhoneNumber(e.target.value, setPhone)}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <div className="ui-radio-group small">
                    <div>
                      <input
                        type="radio"
                        name="phone"
                        id="home"
                        value="H"
                        checked={phoneType === "H"}
                        onChange={(e) => setPhoneType(e.target.value)}
                      />
                      <label htmlFor="home">자택</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="phone"
                        id="company"
                        value="C"
                        checked={phoneType === "C"}
                        onChange={(e) => setPhoneType(e.target.value)}
                      />
                      <label htmlFor="company">직장</label>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                HP <i className="require">*</i>
              </th>
              <td>
                <div className="flexYCenter-inline">
                  <input
                    type="tel"
                    className="input-init"
                    style={{ width: 124 }}
                    required
                    value={formatHP(cellPhone)}
                    // onChange={(e) => makePhoneNumber(e.target.value, setCellPhone)}
                    onChange={handleChangeHP}
                    maxLength="13"
                  />

                  <span className="flexYCenter sp-mt-1">
                    <input
                      type="checkbox"
                      id="SMS"
                      checked={!!isReceiveSms}
                      onChange={(e) => setIsReceiveSms(e.target.checked)}
                    />
                    <label htmlFor="SMS">SMS수신</label>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <th>직장인여부</th>
              <td>
                <div className="ui-radio-group small">
                  <div>
                    <input
                      type="radio"
                      name="worker"
                      id="Y"
                      value="Y"
                      checked={isOfficeWorker === true}
                      onChange={(e) => setIsOfficeWorker(true)}
                    />
                    <label htmlFor="Y">Y</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="worker"
                      id="N"
                      value="N"
                      checked={isOfficeWorker === false}
                      onChange={(e) => setIsOfficeWorker(false)}
                    />
                    <label htmlFor="N">N</label>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>직장/학교</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  placeholder="직장/학교"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>직책/학과</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  placeholder="직책/학과"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>특이사항</th>
              <td>
                <textarea
                  style={{ whiteSpace: "pre-wrap" }}
                  className="input-init full"
                  rows="7"
                  value={note}
                  defaultValue={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </td>
            </tr>
            <tr>
              <th>학습정보</th>
              <td>
                <textarea
                  style={{ whiteSpace: "pre-wrap" }}
                  className="input-init full"
                  rows="7"
                  value={lessonInfo}
                  defaultValue={lessonInfo}
                  onChange={(e) => setLessonInfo(e.target.value)}
                ></textarea>
              </td>
            </tr>

            {forRegister ? (
              <></>
            ) : (
              <tr>
                <th>등록일</th>
                <td>{data.createDateTime}</td>
              </tr>
            )}
            <tr>
              <th>상태</th>
              <td>
                <div className="ui-radio-group small">
                  <div>
                    <input
                      type="radio"
                      name="active"
                      id="activeY"
                      value="true"
                      checked={isActive === true}
                      onChange={(e) => setIsActive(e.target.value === "true")}
                    />
                    <label htmlFor="activeY">활동</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="active"
                      id="activeN"
                      value="false"
                      checked={isActive === false}
                      onChange={(e) => setIsActive(e.target.value === "true")}
                    />
                    <label htmlFor="activeN">비활동</label>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title sp-mt-14">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">부가정보</div>
          </div>
        </div>

        <div className="control">
          <Buttons
            className="xsmall"
            {...getToggleProps({
              onClick: () => setExpanded((prevExpanded) => !prevExpanded),
            })}
          >
            <span className="flexYCenter gap">
              <span className={`${isExpanded ? "tf-rotate" : ""}`}>
                <i className="fa-solid fa-circle-chevron-down txt-secondary"></i>
              </span>
              <span className="size-bodyS">상세검색</span>
            </span>
          </Buttons>
        </div>
      </div>

      <section className="ui-info-table sp-mt-10" {...getCollapseProps()}>
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>주소</th>
              <td>
                <div className="flexColumn gap">
                  <div className="flexYCenter gap">
                    <input
                      type="text"
                      readOnly
                      className="input-init"
                      value={zipcode}
                      onClick={searchAddress}
                    />
                    <Buttons type="button" className="outlined xsmall" onClick={searchAddress}>
                      우편번호
                    </Buttons>
                  </div>
                  <input
                    type="text"
                    readOnly
                    className="input-init"
                    value={address}
                    onClick={searchAddress}
                  />
                  <input
                    type="text"
                    className="input-init"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>가입경로</th>
              <td>
                <select
                  className="input-init"
                  value={joinPath || "ALL"}
                  onChange={({ target: { value } }) => setJoinPath(value)}
                >
                  <option value="ALL">-선택-</option>
                  <option value="SIGN">간판</option>
                  <option value="ONLINE">온라인검색</option>
                  <option value="RECOMMEND">지인추천</option>
                  <option value="FAN">부채</option>
                  <option value="LEAFLET">3단리플릿</option>
                  <option value="SUBWAY">지하철광고</option>
                  <option value="ALLIANCE">기업제휴</option>
                  <option value="ETC">기타</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>학습희망언어</th>
              <td>
                <div className="ui-check full">
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="EN"
                      onChange={() => onClickLanguage("EN")}
                      checked={onCheckLanguage("EN")}
                    />
                    <label htmlFor="EN">영어</label>
                  </div>
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="CN"
                      onChange={() => onClickLanguage("CN")}
                      checked={onCheckLanguage("CN")}
                    />
                    <label htmlFor="CN">중국어</label>
                  </div>
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="JP"
                      onChange={() => onClickLanguage("JP")}
                      checked={onCheckLanguage("JP")}
                    />
                    <label htmlFor="JP">일본어</label>
                  </div>
                  <div className="check">
                    <input
                      type="checkbox"
                      className="input-init"
                      id="KR"
                      onChange={() => onClickLanguage("KR")}
                      checked={onCheckLanguage("KR")}
                    />
                    <label htmlFor="KR">한국어</label>
                  </div>
                  <div className="check flex1">
                    <label htmlFor="etcLanguage">기타 : </label>

                    <input
                      type="text"
                      id="etcLanguage"
                      className="input-init full"
                      value={etcLanguage}
                      onChange={({ target: { value } }) => setEtcLanguage(value)}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>외국어실력</th>
              <td>
                <div className="ui-detail-list">
                  <div className="label">TOEIC</div>
                  <div className="cont">
                    <select
                      className="input-init"
                      value={getLanguageSkillScore("TOEIC")}
                      onChange={({ target: { value } }) => onChangeLanguageSkills("TOEIC", value)}
                    >
                      <option value="">-선택-</option>
                      <option value="900점이상">900점이상</option>
                      <option value="800-900점">800-900점</option>
                      <option value="600-800점">600-800점</option>
                      <option value="500-600점">500-600점</option>
                      <option value="490점이하">490점이하</option>
                    </select>
                  </div>
                  <div className="label">TOEIC-S</div>
                  <div className="cont">
                    <select
                      className="input-init"
                      value={getLanguageSkillScore("TOEIC_S")}
                      onChange={({ target: { value } }) => onChangeLanguageSkills("TOEIC_S", value)}
                    >
                      <option value="">-선택-</option>
                      <option value="8(190-200)">8(190-200)</option>
                      <option value="7(160-180)">7(160-180)</option>
                      <option value="6(130-150)">6(130-150)</option>
                      <option value="5(110-120)">5(110-120)</option>
                      <option value="4(80-100)">4(80-100)</option>
                      <option value="3(60-70)">3(60-70)</option>
                      <option value="1,2(0-50)">1,2(0-50)</option>
                    </select>
                  </div>
                  <div className="label">OPIc</div>
                  <div className="cont">
                    <select
                      className="input-init"
                      value={getLanguageSkillScore("OPIC")}
                      onChange={({ target: { value } }) => onChangeLanguageSkills("OPIC", value)}
                    >
                      <option value="">-선택-</option>
                      <option value="AD">AD</option>
                      <option value="IH">IH</option>
                      <option value="IM">IM</option>
                      <option value="IL">IL</option>
                      <option value="NH">NH</option>
                      <option value="NM">NM</option>
                      <option value="NL">NL</option>
                    </select>
                  </div>
                  <div className="label">TSC</div>
                  <div className="cont">
                    <input
                      type="text"
                      className="input-init full"
                      value={getLanguageSkillScore("TSC")}
                      onChange={({ target: { value } }) => onChangeLanguageSkills("TSC", value)}
                    />
                  </div>
                  <div className="label">HKC</div>
                  <div className="cont">
                    <input
                      type="text"
                      className="input-init full"
                      value={getLanguageSkillScore("HKC")}
                      onChange={({ target: { value } }) => onChangeLanguageSkills("HKC", value)}
                    />
                  </div>
                  <div className="label">SJPT</div>
                  <div className="cont">
                    <input
                      type="text"
                      className="input-init full"
                      value={getLanguageSkillScore("SJPT")}
                      onChange={({ target: { value } }) => onChangeLanguageSkills("SJPT", value)}
                    />
                  </div>
                  <div className="label">기타</div>

                  <div className="cont span">
                    <input
                      type="text"
                      className="input-init full"
                      value={getLanguageSkillScore("ETC")}
                      onChange={({ target: { value } }) => onChangeLanguageSkills("ETC", value)}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>외국거주경험</th>
              <td>
                <div className="ui-detail-list">
                  <div className="label">국가명</div>
                  <div className="cont">
                    <input
                      type="text"
                      className="input-init full"
                      value={foreignCountry}
                      onChange={({ target: { value } }) => setForeignCountry(value)}
                    />
                  </div>
                  <div className="label">기간</div>
                  <div className="cont">
                    <input
                      type="text"
                      className="input-init full"
                      value={foreignPeriod}
                      onChange={({ target: { value } }) => setForeignPeriod(value)}
                    />
                  </div>
                  <div className="label">목적</div>
                  <div className="cont span">
                    <input
                      type="text"
                      className="input-init full"
                      value={foreignPurpose}
                      onChange={({ target: { value } }) => setForeignPurpose(value)}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>수강의 목적</th>
              <td>
                <div className="ui-check full">
                  {CoursePurposesList.map((item) => (
                    <div className="check" key={item.key}>
                      <input
                        type="checkbox"
                        className="input-init"
                        id={item.key}
                        checked={coursePurposes?.includes(item.key)}
                        onChange={({ target: { checked } }) =>
                          onChangeCoursePurposes(checked, item.key)
                        }
                      />
                      <label htmlFor={item.key}>{item.title}</label>
                    </div>
                  ))}
                </div>
                <div className="sp-mt-5 size-small txt-primary">우선순위 3가지만 선택하세요</div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="layout-between sp-mt-10">
        <div className="ml-auto gap-s">
          {forRegister ? (
            <Buttons type="submit" className="primary small" onClick={onSubmit}>
              등록
            </Buttons>
          ) : (
            <Buttons type="submit" className="grey-light small" onClick={onSubmit}>
              수정
            </Buttons>
          )}

          {!forRegister && (
            <Buttons type="button" className="grey small" onClick={onClickDelete}>
              삭제
            </Buttons>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
