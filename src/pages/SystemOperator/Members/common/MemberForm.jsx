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
  const [loginId, setLoginId] = useState(data?.loginId ?? "");
  const [email, setEmail] = useState(data?.email ?? "");
  const [isReceiveEmail, setIsReceiveEmail] = useState(data?.isReceiveEmail ?? true);
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(data?.gender ?? "");
  const [cellPhone, setCellPhone] = useState(data?.cellPhone ?? "");
  const [isReceiveSms, setIsReceiveSms] = useState(data?.isReceiveSms ?? true);
  const [isOfficeWorker, setIsOfficeWorker] = useState(data?.isOfficeWorker ?? true);
  const [note, setNote] = useState(data?.note ?? "");
  const [isActive, setIsActive] = useState(data?.active ?? true);
  const [zipcode, setZipcode] = useState(data?.zipcode ?? "");
  const [address, setAddress] = useState(data?.address ?? "");
  const [detailedAddress, setDetailedAddress] = useState(data?.detailedAddress ?? "");
  const [languages, setLanguages] = useState(data?.languages ?? []);
  const [etcLanguage, setEtcLanguage] = useState(data?.etcLanguage ?? "");
  const [languageSkills, setLanguageSkills] = useState(data?.languageSkills ?? []);
  const [coursePurposes, setCoursePurposes] = useState(data?.coursePurposes || []);

  const reset = () => {
    setName(data?.name ?? "");
    setLoginId(data?.loginId ?? "");
    setEmail(data?.email ?? "");
    setIsReceiveEmail(data?.isReceiveEmail ?? true);
    setPassword("");
    setGender(data?.gender ?? "");
    setCellPhone(data?.cellPhone ?? "");
    setIsReceiveSms(data?.isReceiveSms ?? true);
    setIsOfficeWorker(data?.isOfficeWorker ?? "Y");
    setNote(data?.note ?? "");
    setIsActive(data?.active ?? true);
    setZipcode(data?.zipcode ?? "");
    setAddress(data?.address ?? "");
    setDetailedAddress(data?.detailedAddress ?? "");
    setLanguages(data.languages ?? []);
    setEtcLanguage(data.etcLanguage ?? "");
    setLanguageSkills(data.languageSkills ?? []);
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



    let saveLanguages = languages;
    if (etcLanguage) {
      saveLanguages.push("ETC");
    }

    const saveData = {
      name,
      loginId,
      email,
      isReceiveEmail,
      password,
      gender,
      cellPhone,
      isReceiveSms,
      isOfficeWorker,
      note,
      isActive,
      address,
      detailedAddress,
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
              <span className="size-bodyS">상세보기</span>
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
