import { TeacherType } from "@/app/api/common";
import useEmailWindow from "@/app/helper/windows-hooks/use-email-window";
import useSmsWindow from "@/app/helper/windows-hooks/use-sms-window";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import DatePicker from "@/components/DatePicker";
import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { render } from "@testing-library/react";
import ServiceCommon from "@/app/service/service-common";

/**
 * 강사관리 상세 > 기본 탭
 */
const TeacherDetailBasic = ({ selectedData, getTeachers }) => {
  const forRegister = !selectedData;

  const [data, setData] = useState({
    active: true,
    language: "ENGLISH",
  });
  const [teacherList, setTeacherList] = useState(null);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [workTime, setWorkTime] = useState();

  const fileRef = useRef();

  const onChangeData = (item) => {
    if (item.hasOwnProperty('workStartDate')) {
      const dateFormat = {workStartDate: dayjs(item.workStartDate).format("YYYY-MM-DD")};
      setData((prev) => ({ ...prev, ...dateFormat }));
    }  else if (item.files) {
      for (let index = 0; index < item?.files?.length; index++) {
        if (item?.files[index]?.size > 2000000) {
          alert("파일 용량이 2MB를 초과할 수 없습니다.");
          return;
        }
      }
      console.log("change:", item.files)
      setData((prev) => ({ ...prev, files: item.files }));
    } else {
      setData((prev) => ({ ...prev, ...item }));
    }
  };

  const onSubmit = async () => {
    try {
      if (
        !data?.name ||
        !data?.loginId ||
        !data?.email ||
        !data?.password ||
        !data?.teacherType ||
        !data?.workTime
      ) {
        alert("필수 입력 항목을 확인해주세요.");
        return;
      }
      
      const formData = new FormData();

      for (let key in data) {
        if (key !== "files") {
          formData.append(key, data[key]);
        }
      }

      if (data?.files) {
        for (let index = 0; index < data?.files?.length; index++) {
          formData.append("files", data?.files[index]);
        }
      }
      formData.append("deleteFiles", deleteFiles);

      await ServiceTeacher.createTeacher(formData);
      getTeachers();
    } catch (error) {
      console.error(error.message);
    }
  };
  const onModify = async () => {
    try {
      let formData = new FormData();

      for (let key in data) {
        if (key !== "files" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }

      if (data?.files) {
        for (let index = 0; index < data?.files?.length; index++) {
          formData.append("files", data?.files[index]);
        }
      }
      formData.append("deleteFiles", deleteFiles);

      for (let key of formData.keys()) {
        console.log(key);
        console.log(formData.get(key));
      }

      await ServiceTeacher.modifyTeacher(selectedData?.userId, formData);

      alert("수정되었습니다.");
      getTeachers();
    } catch (error) {
      console.error(error.message);
    }
  };
  const onDelete = async () => {
    try {
      console.log("강사 삭제")
      // let formData = new FormData();

      for (let key in data) {
        if (key !== "files") {
          formData.append(key, data[key]);
        }
      }

      if (data?.files) {
        for (let index = 0; index < data?.files?.length; index++) {
          formData.append("files", data?.files[index]);
        }
      }
      formData.append("deleteFiles", deleteFiles);

      for (let key of formData.keys()) {
        console.log(key);
        console.log(formData.get(key));
      }

      // await ServiceTeacher.modifyTeacher(selectedData?.userId, data);
    } catch (error) {
      console.error(error.message);
    }
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

  const onDeleteFilePress = (fileName) => {
    // setDeleteFiles((prev) => [...prev, id]);
    console.log("fileName ==>", fileName);

    let saveData = {};
    let changedDeleteFiles = [...deleteFiles];
    for (let key in data?.files) {
      // if (data.files[key]?.size && data.files[key]?.name !== fileName) {
      //   saveData[key] = data?.files[key];
      // }
      if (data.files[key] && data.files[key].id) {
        if (data.files[key].id !== fileName.id) {
          saveData[key] = data.files[key];
        } else {
          if (!changedDeleteFiles.push(fileName.id)) {
            changedDeleteFiles.push(fileName.id);
          }
        }
      }
    }

    setDeleteFiles(changedDeleteFiles)

    onChangeData({ 
      files: saveData,
      deleteFiles: changedDeleteFiles
    });
  };

  const renderFiles = () => {
    let filesName = [];
    for (let key in data?.files) {
      if (data.files[key]?.name && data.files[key]?.type) {
        filesName.push(data.files[key]);
      } else if (data.files[key]?.originalFile) {
        filesName.push(data.files[key]);
      }
    }

    

    return filesName.map((item) => (
      <div key={item.id || item.name} className="cont">
        {/* <Buttons type="button" className="xsmall txt-secondary-high">
          {item.name}
        </Buttons> */}
        <a
          href={item?.url}
          download={item?.originalFile}
          className="xsmall txt-secondary-high"
        >
          {item?.originalFile || item?.name}
        </a>
        <Buttons type="button" className="xsmall" onClick={() => onDeleteFilePress(item)}>
          <i className="fa-solid fa-xmark"></i>
        </Buttons>
      </div>
    ));
  };

  const init = useCallback(async () => {
    try {
      setData({});
      const teacherWorkTime = await ServiceCommon.getCommonCode({codeGroup: '400'});
      setWorkTime(teacherWorkTime);
      
      if (selectedData?.userId) {
        const res = await ServiceTeacher.getTeacher(selectedData?.userId);
        const TeacherListRes = await ServiceTeacher.getTeacherOptionsList({
          fields: TeacherType[0].id,
        });
        
        console.log(res);
        setTeacherList(TeacherListRes.teachers);
        setData({ ...res});
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [selectedData?.userId]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="sp-mt-10">
      <div className="ui-sub-title">
        <div className="title">
          <div className="tit-wrap">
            {data?.teacherName ? (
              <div className="tit">
                {data?.teacherName} : <span className="txt-primary-deep">수정</span>{" "}
              </div>
            ) : (
              <div className="tit">
                <span className="txt-primary-deep">등록</span>{" "}
              </div>
            )}
            <small>(Basic Information)</small>
          </div>
        </div>

        {!forRegister && (
          <div className="control">
            <Buttons type="button" className="outlined xsmall bgc-white" onClick={onClickSendEmail}>
              메일발송
            </Buttons>
            <Buttons type="button" className="outlined xsmall bgc-white" onClick={onClickSendSms}>
              SMS발송
            </Buttons>
          </div>
        )}
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
                  value={data?.name}
                  onChange={({ target: { value } }) => onChangeData({ name: value })}
                />
              </td>
            </tr>
            <tr>
              <th>영문이름(이름+성)</th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  value={data?.nameEn}
                  onChange={({ target: { value } }) => onChangeData({ nameEn: value })}
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
                  value={data?.loginId}
                  onChange={({ target: { value } }) => onChangeData({ loginId: value })}
                />{" "}
                <span className="txt-red">(* 아이디는 이메일을 입력해주시기 바랍니다.)</span>
              </td>
            </tr>
            <tr>
              <th>
                이메일 <i className="require">*</i>
              </th>
              <td>
                <input
                  type="text"
                  className="input-init"
                  value={data?.email}
                  onChange={({ target: { value } }) => onChangeData({ email: value })}
                />
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
                  value={data?.password}
                  onChange={({ target: { value } }) => onChangeData({ password: value })}
                />{" "}
                <span className="txt-red">(변경시만 입력)</span>
              </td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>
                <div className="flexYCenter-inline gap-10">
                  <input
                    type="tel"
                    className="input-init"
                    style={{ width: 124 }}
                    value={data?.cellPhone}
                    onChange={({ target: { value } }) => onChangeData({ cellPhone: value })}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>성별</th>
              <td>
                <div className="ui-radio-group size-small">
                  {[
                    { key: "M", title: "남" },
                    { key: "F", title: "여" },
                  ].map((el, i) => {
                    return (
                      <div key={i}>
                        <input
                          type="radio"
                          id={`${el.key}-${i}`}
                          checked={el.key === data?.gender}
                          name="sex"
                          onChange={() => onChangeData({ gender: el.key })}
                        />
                        <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>

            <tr>
              <th>근무시작일</th>
              <td>
                <div className="ui-datepicker-wrap">
                  <div>
                    <DatePicker
                      selected={data?.workStartDate}
                      onChange={(date) => onChangeData({ workStartDate: date })}
                      selectStart
                      startDate={data?.workStartDate}
                      endDate={data?.workStartDate}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>구분 <i className="require">*</i></th>
              <td>
                <div className="ui-radio-group small">
                  {[
                    { key: "HT", title: "HT(한국인강사)" },
                    { key: "LT", title: "LT(외국인강사)" },
                  ].map((el, i) => {
                    return (
                      <div key={i}>
                        <input
                          type="radio"
                          id={`${el.key}-${i}`}
                          checked={el.key === data?.teacherType}
                          name="HTLT"
                          onChange={() => onChangeData({ teacherType: el.key })}
                        />
                        <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th>언어</th>
              <td>
                <div className="ui-radio-group small">
                  {[
                    { key: "ENGLISH", title: "영어" },
                    { key: "CHINESE", title: "중국어" },
                    { key: "JAPANESE", title: "일본어" },
                  ].map((el, i) => {
                    return (
                      <div key={i}>
                        <input
                          type="radio"
                          id={`${el.key}-${i}`}
                          name="lang"
                          checked={el.key === data?.language}
                          onChange={() => onChangeData({ language: el.key })}
                        />
                        <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th>근무시간 <i className="require">*</i></th>
              <td>
                <button className="ui-select">
                  <select
                    className="input-init"
                    value={data?.workTime}
                    onChange={({ target: { value } }) => onChangeData({ workTime: value })}
                  >
                    <option value="">-선택-</option>
                    {workTime?.commonCode?.map ((time) => (
                      <option value={time.code}>{time.name}</option>
                    ))}

                    {/* <option value="AM_16">AM(16)</option>

                    <option value="PM_16">PM(16)</option>

                    <option value="SP_16">Split(16)</option>

                    <option value="AM_8">AM(8)</option>

                    <option value="PM_8">PM(8)</option>

                    <option value="SP_10">Split(10)</option>

                    <option value="SP_4">Split(4)</option> */}
                  </select>
                </button>
              </td>
            </tr>
            <tr>
              <th>근무타입</th>
              <td>
                <div className="ui-radio-group small">
                  {["A", "C"].map((el, i) => {
                    return (
                      <div key={i}>
                        <input
                          type="radio"
                          id={`${el}-${i}`}
                          name="type"
                          checked={el === data?.workType}
                          onChange={() => onChangeData({ workType: el })}
                        />
                        <label htmlFor={`${el}-${i}`}>{el}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>

            <tr>
              <th>파트너강사</th>
              <td>
                <button className="ui-select">
                  <select className="input-init">
                    <option value="">-선택-</option>
                    {teacherList?.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </button>
              </td>
            </tr>

            <tr>
              <th>관련파일</th>
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
                    multiple
                    // onChange={({ target: { files } }) => onChangeData({ files: Array.from(files) })}
                    onChange={({ target: {files}}) => {
                      console.log(files)
                      onChangeData({files}
                      //   (prevData) => {
                      //   const newFiles = Array.from(files);
                      //   const updateFiles = prevData.files ? { ...prevData.files } : {};

                      //   newFiles.forEach((file, index) => {
                      //     const newKey = `file${Object.keys(updateFiles).length + index + 1}`;
                      //     updateFiles[newKey] = file;
                      //   });

                      //   return {
                      //     ...prevData,
                      //     files: updateFiles
                      //   }
                      // }
                    );
                    }}
                  />
                </Buttons>
                <div className="ui-detail-list col-2 space-none sp-mt-5">
                  <div className="label">첨부</div>
                  {renderFiles()}
                </div>
              </td>
            </tr>
            <tr>
              <th>상태</th>
              <td>
                <div className="ui-radio-group small">
                  {[
                    { key: true, title: "활동" },
                    { key: false, title: "비활동" },
                  ].map((el, i) => {
                    return (
                      <div key={i}>
                        <input
                          type="radio"
                          id={`${el.key}-${i}`}
                          name="active"
                          checked={el.key === data?.active}
                          onChange={() => onChangeData({ active: el.key })}
                        />
                        <label htmlFor={`${el.key}-${i}`}>{el.title}</label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th>메모</th>
              <td>
                <textarea 
                  className="input-init full" 
                  rows="20" 
                  value={data?.memo || ""} 
                  onChange={(e) => onChangeData({ memo: e.target.value})}
                >
                </textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-10">
        <div className="ml-auto gap-s">
          {forRegister ? (
            <Buttons type="submit" className="primary small" onClick={onSubmit}>
              등록
            </Buttons>
          ) : (
            <Buttons type="submit" className="grey-light small" onClick={onModify}>
              수정
            </Buttons>
          )}
          {!forRegister && (
            <Buttons type="button" className="grey small" onClick={onDelete}>
              삭제
            </Buttons>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailBasic;
