import useMemberRegistWindow from "@/app/helper/windows-hooks/use-member-regist-window";
import Buttons from "@/components/Buttons";
import { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import ServiceMember from "@/app/service/service-members";
import { useNavigate } from "react-router-dom";
import ServiceResv from "@/app/service/service-resv";

const MemberRegistModal = () => {

    const navigate = useNavigate();
    const { member } = useMemberRegistWindow();
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [foundPath, setFoundPath] = useState('');
    const [zipcode, setZipcode] = useState("");
    const [address, setAddress] = useState("");
    const [saveData, setSaveData] = useState({});
    const [languages, setLanguages] = useState([]);
    const [languageSkills, setLanguageSkills] = useState([]);

    const handleChange = (data) => {
        setSaveData((prev) => ({ ...prev, ...data }));
    }

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

    const onClickLanguage = (text) => {
        if (languages.includes(text)) {
          const saveData = languages;
          const removedData = saveData.filter((item) => item !== text);
          setLanguages(removedData);
        } else {
          setLanguages((prev) => [...prev, text]);
        }
    };

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

    const clickRegistMember = async () => {
        const data = {
            ...saveData,
            name: name,
            loginId: id,
            email: email,
            gender: gender,
            cellPhone: cellPhone,
            foundPath: foundPath,
            zipcode: zipcode,
            address: address,
            languages: languages,
            languageSkills: languageSkills,
            type: 'S',
        }
        
        await ServiceMember.register(data);
        alert("신규 회원이 등록되었습니다.");
        window.close();
        // navigate("/operator/members/member", { replace: true });
    }

    useEffect(() => {
        setName(member.name);
        setId(member.email);
        setEmail(member.email);
        setGender(member.gender);
        setCellPhone(member.cellPhone);
        setFoundPath(member.foundPath);
    }, [member])
    
    return (
        <div>
            <div className="ui-sub-title sticky-tabs">
                <div className="title">
                    <div className="tit-wrap">
                        <div className="tit">회원관리</div>
                    </div>
                </div>

            </div>
            
            <div className="ui-sub-title small has-bg sp-mt-10">
                <div className="title">
                    <div className="tit-wrap">
                        <div className="tit">회원등록</div>
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
                            <th>
                                이름 <i className="require">*</i>
                            </th>
                            <td>
                                <input 
                                    className="input-init"
                                    placeholder="이름"
                                    required
                                    value={name}
                                    onChange={(e) => {setName(e.target.value), handleChange({name: e.target.value})}}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>영문이름<small>(이름+성)</small></th>
                            <td>
                                <input 
                                    type="text"
                                    className="input-init"
                                    placeholder="First Name"
                                    onChange={(e) => handleChange({firstNameEn: e.target.value})}
                                />
                                {" "}
                                <input 
                                    type="text"
                                    className="input-init"
                                    placeholder="Last Name"
                                    onChange={(e) => handleChange({lastNameEn: e.target.value})}
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
                                    value={id}
                                    onChange={(e) => {setId(e.target.value), handleChange({loginId: e.target.value})}}
                                />
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
                                        onChange={(e) => {setEmail(e.target.value), handleChange({email: e.target.value})}}
                                    />
                                    <span className="flexYCenter sp-mt-1">
                                        <input type="checkbox" onChange={(e) => handleChange({isReceiveEmail: e.target.checked})}/>
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
                                    onChange={(e) => handleChange({password: e.target.value})}
                                />
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
                                            onChange={(e) => {setGender(e.target.value), handleChange({gender: e.target.value})}}
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
                                            onChange={(e) => {setGender(e.target.value), handleChange({gender: e.target.value})}}
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
                                        onChange={(e) => handleChange({phone: e.target.value})}
                                    />
                                    <div className="ui-radio-group small">
                                        <div>
                                            <input
                                                type="radio"
                                                name="phone"
                                                id="home"
                                                value="H"
                                                onChange={(e) => handleChange({phoneType: e.target.value})}
                                            />
                                            <label htmlFor="home">자택</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="phone"
                                                id="company"
                                                value="C"
                                                onChange={(e) => handleChange({phoneType: e.target.value})}
                                            />
                                            <label htmlFor="company">직장</label>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                휴대전화번호 <i className="require">*</i>
                            </th>
                            <td>
                                <div className="flexYCenter-inline">
                                    <input
                                        type="tel"
                                        className="input-init"
                                        style={{ width: 124 }}
                                        required
                                        value={cellPhone}
                                        onChange={(e) => {setCellPhone(e.target.value), handleChange({cellPhone: e.target.value})}}
                                        maxLength="13"
                                    />
                                    <span className="flexYCenter sp-mt-1">
                                        <input
                                            type="checkbox"
                                            id="SMS"
                                        />
                                        <label htmlFor="SMS">SMS수신</label>
                                    </span>
                                </div>
                            </td>
                        </tr>
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
                                />
                                <input
                                    type="text"
                                    className="input-init"
                                    onChange={(e) => {handleChange({detailedAddress: e.target.value})}}
                                />
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
                                            onChange={(e) => handleChange({isOfficeWorker: e.target.value})}
                                        />
                                        <label htmlFor="Y">Y</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="worker"
                                            id="N"
                                            value="N"
                                            onChange={(e) => handleChange({isOfficeWorker: e.target.value})}
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
                                    onChange={(e) => handleChange({company: e.target.value})}
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
                                    onChange={(e) => handleChange({position: e.target.value})}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                가입경로<i className="require">*</i>
                            </th>
                            <td>
                                <select
                                    className="input-init"
                                    value={foundPath}
                                    onChange={(e) => {setFoundPath(e.target.value), handleChange({joinPath: e.target.value})}}
                                >
                                <option value="">-선택-</option>
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
                                            onChange={() => onClickLanguage('EN')}
                                        />
                                        <label htmlFor="EN">영어</label>
                                    </div>
                                    <div className="check">
                                        <input
                                            type="checkbox"
                                            className="input-init"
                                            id="CN"
                                            onChange={() => onClickLanguage('CN')}
                                        />
                                        <label htmlFor="CN">중국어</label>
                                    </div>
                                    <div className="check">
                                        <input
                                            type="checkbox"
                                            className="input-init"
                                            id="JP"
                                            onChange={() => onClickLanguage('JP')}
                                        />
                                        <label htmlFor="JP">일본어</label>
                                    </div>
                                    <div className="check">
                                        <input
                                            type="checkbox"
                                            className="input-init"
                                            id="KR"
                                            onChange={() => onClickLanguage('KR')}
                                        />
                                        <label htmlFor="KR">한국어</label>
                                    </div>
                                    <div className="check flex1">
                                        <label htmlFor="etcLanguage">기타 : </label>
                                        <input
                                            type="text"
                                            id="etcLanguage"
                                            className="input-init full"
                                            onChange={({ target: { value } }) => {onClickLanguage('ETC'), handleChange({etcLanguage: value})}}
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
                                            onChange={({ target: { value } }) => onChangeLanguageSkills("TSC", value)}
                                        />
                                    </div>
                                    <div className="label">HKC</div>
                                    <div className="cont">
                                        <input
                                            type="text"
                                            className="input-init full"
                                            onChange={({ target: { value } }) => onChangeLanguageSkills("HKC", value)}
                                        />
                                    </div>
                                    <div className="label">SJPT</div>
                                    <div className="cont">
                                        <input
                                            type="text"
                                            className="input-init full"
                                            onChange={({ target: { value } }) => onChangeLanguageSkills("SJPT", value)}
                                        />
                                    </div>
                                    <div className="label">기타</div>

                                    <div className="cont span">
                                        <input
                                            type="text"
                                            className="input-init full"
                                            onChange={({ target: { value } }) => onChangeLanguageSkills("ETC", value)}
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>상태</th>
                            <td>
                                <div className="ui-radio-group small">
                                    <div>
                                        <input
                                            type="radio"
                                            name="active"
                                            id="activeY"
                                            value="Y"
                                            onChange={() => handleChange({isActive: true})}
                                        />
                                        <label htmlFor="activeY">활동</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="active"
                                            id="activeN"
                                            value="N"
                                            onChange={() => handleChange({isActive: false})}
                                        />
                                        <label htmlFor="activeN">비활동</label>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-right sp-mt-10">
                    <div className="gap">
                        <Buttons 
                            type="submit" 
                            className="primary small text-center" 
                            style={{ width: 80 }}
                            onClick={clickRegistMember}
                        >
                            등록
                        </Buttons>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberRegistModal;