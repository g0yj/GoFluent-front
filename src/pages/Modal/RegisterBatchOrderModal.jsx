import useRegisterBatchOrderWindow from "@/app/helper/windows-hooks/use-register-batch-order-window";

import ServiceOrder from "@/app/service/service-order";
import { useEffect, useState } from "react";

import { TeacherType } from "@/app/api/common";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";

/**
 * 일괄주문등록 모달
 */
const RegisterBatchOrderModal = () => {
  const { memberList } = useRegisterBatchOrderWindow();

  // 언어
  const [language, setLanguage] = useState("영어");
  // 과정
  const [course, setCourse] = useState("PT");

  // 상품 목록
  const [productList, setProductList] = useState([]);
  // 기기 목록
  const [deviceList, setDeviceList] = useState([]);
  // 교재 목록
  const [textbookList, setTextBookList] = useState([]);
  // 강사 목록
  const [teacherList, setTeacherList] = useState([]);

  // 상품 목록 갱신
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const res = await ServiceCode.getProductList({ language, course });
  //       setProductList(res);
  //     } catch (e) {
  //       alert(e.message);
  //     }
  //   };

  //   fetch();
  // }, [language, course]);

  // // 기기 목록 가져오기
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const res = await ServiceCode.getDeviceList();
  //       setDeviceList(res);
  //     } catch (e) {
  //       alert(e.message);
  //     }
  //   };

  //   fetch();
  // }, []);

  // // 교재 목록 갱신
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const res = await ServiceCode.getTextBookList({ language });
  //       setTextBookList(res);
  //     } catch (e) {
  //       alert(e.message);
  //     }
  //   };

  //   fetch();
  // }, [language]);

  // 강사 목록 가져오기
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await ServiceTeacher.getTeacherOptionsList({ fields: TeacherType[0].id });
        setTeacherList(res);
      } catch (e) {
        alert(e.message);
      }
    };

    fetch();
  }, []);

  // 일괄 주문 등록
  const register = async () => {
    await ServiceOrder.registerBatch({
      // TODO: API 호출에 필요한 데이터 구성 필요
    });

    // TODO: 완료 후 처리
    alert("등록 완료");
    window.close();
  };

  return (
    <div style={{ padding: 10 }}>
      <div className="ui-sub-title sticky-tabs">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">일괄주문등록</div>
          </div>
        </div>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">언어선택</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>언어</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select className="input-init">
                      <option>영어</option>
                      <option>중국어</option>
                      <option>일본어</option>
                      <option>한국어</option>
                    </select>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">과정주문 등록</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>과정</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select className="input-init">
                      <option>PT</option>
                      <option>TT</option>
                      <option>GT</option>
                    </select>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>과정</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select className="input-init">
                      &nbsp;<option value="">-선택하세요-</option>
                      <option value="P1425279988311032" _price="65000">
                        NEW PT 24회 3개월 (65,000원)
                      </option>
                      <option value="P1364375717944669" _price="58000">
                        PTM (주2회 6개월) (58,000원)
                      </option>
                      <option value="P1364295608035901" _price="55000">
                        PTG (주2회 3개월) (55,000원)
                      </option>
                      <option value="P1361514930881960" _price="60000">
                        PTM (주2회 3개월) (60,000원)
                      </option>
                      <option value="P1357195231862759" _price="0">
                        MISEC/미수금정보 (0원)
                      </option>
                      <option value="P1350566735444807" _price="30000">
                        Plug-in 30분 (30,000원)
                      </option>
                      <option value="P1350556747894625" _price="53000">
                        PTG (주2회 6개월) (53,000원)
                      </option>
                      <option value="P1350556710397836" _price="55000">
                        PTG (주1회 1개월) (55,000원)
                      </option>
                    </select>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">기기주문 등록</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>기기</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select className="input-init">
                      <option value="">-선택하세요-</option>

                      <option value="P1350566928359647" _price="1390000">
                        맥북에어 - 11.6(128 Flash) (1,390,000원)
                      </option>

                      <option value="P1350566944054121" _price="1790000">
                        맥북에어 - 13.3(256 Flash) (1,790,000원)
                      </option>

                      <option value="P1350566971628944" _price="748000">
                        갤럭시 노트 10.1 - 16G (748,000원)
                      </option>

                      <option value="P1352098696544281" _price="420000">
                        아이패드 미니 - 16G (420,000원)
                      </option>

                      <option value="P1352098762823637" _price="540000">
                        아이패드 미니 - 32G (540,000원)
                      </option>

                      <option value="P1352098835580142" _price="660000">
                        아이패드 미니 - 64G (660,000원)
                      </option>

                      <option value="P1352098882909296" _price="620000">
                        아이패드4 - 16G (620,000원)
                      </option>

                      <option value="P1352098897939225" _price="740000">
                        아이패드4 - 32G (740,000원)
                      </option>

                      <option value="P1352098914145634" _price="860000">
                        아이패드4 - 64G (860,000원)
                      </option>

                      <option value="P1363942256811053" _price="1290000">
                        맥북에어 - 11.6(64 Flash) (1,290,000원)
                      </option>

                      <option value="P1363942314289985" _price="1490000">
                        맥북에어 - 13.3(128 Flash) (1,490,000원)
                      </option>
                    </select>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">교재주문 등록</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>교재</th>
              <td>
                <div className="flexYCenter gap">
                  <button className="ui-select">
                    <select className="input-init">
                      &nbsp;<option value="">-선택하세요-</option>
                      <option value="P1575887230426294" _price="0">
                        Business Essentials Book 2(mp3) (0원)
                      </option>
                      <option value="P1575887209875705" _price="0">
                        Business Essentials Book 1(mp3) (0원)
                      </option>
                      <option value="P1550827747588318" _price="0">
                        Communicating in Business English(mp3) (0원)
                      </option>
                      <option value="P1550827558702657" _price="0">
                        2nd BR Intermediate(mp3) (0원)
                      </option>
                      <option value="P1550827545093023" _price="0">
                        2nd BR Upper-intermediate(mp3) (0원)
                      </option>
                      <option value="P1550827522833369" _price="0">
                        2nd BR Elementary(mp3) (0원)
                      </option>
                      <option value="P1545895678477639" _price="0">
                        Business Result Elementary(mp3) (0원)
                      </option>
                      <option value="P1545895667807809" _price="0">
                        Business Result Upper-intermediate(mp3) (0원)
                      </option>
                      <option value="P1545895635956364" _price="0">
                        Business Result Intermediate(mp3) (0원)
                      </option>
                      <option value="P1502855358260400" _price="0">
                        Smart Choice 2(mp3) (0원)
                      </option>
                      <option value="P1502855341952212" _price="0">
                        Smart Choice 1(mp3) (0원)
                      </option>
                      <option value="P1502855319872286" _price="0">
                        Smart Choice Starter(mp3) (0원)
                      </option>
                      <option value="P1370406769937315" _price="29000">
                        Market Leader-pre intermediate (29,000원)
                      </option>
                      <option value="P1370404771897634" _price="29000">
                        Market Leader-Intermediate (29,000원)
                      </option>
                      <option value="P1366362304202222" _price="10000">
                        Beanstalk 1 (10,000원)
                      </option>
                      <option value="P1361958707921831" _price="22000">
                        Voca in Use (22,000원)
                      </option>
                      <option value="P1361958587296434" _price="23000">
                        one:one (23,000원)
                      </option>
                      <option value="P1361958543920047" _price="18000">
                        First Choice (18,000원)
                      </option>
                      <option value="P1361352132392303" _price="10000">
                        Next Step - Hospital (10,000원)
                      </option>
                      <option value="P1350566637163627" _price="10000">
                        Next Step - in Flight (10,000원)
                      </option>
                      <option value="P1350566615655511" _price="10000">
                        Next Step - Golf (10,000원)
                      </option>
                      <option value="P1350566595661747" _price="10000">
                        Next Step - Banking2 (10,000원)
                      </option>
                      <option value="P1350566585140918" _price="10000">
                        Next Step - Banking1 (10,000원)
                      </option>
                      <option value="P1350566566057604" _price="10000">
                        Next Step - Airport (10,000원)
                      </option>
                      <option value="P1350566540151135" _price="10000">
                        Next Step - Hotel (10,000원)
                      </option>
                      <option value="P1350566520132509" _price="10000">
                        Next Step - Interview (10,000원)
                      </option>
                      <option value="P1350566488827595" _price="10000">
                        Next Step - Customer Service (10,000원)
                      </option>
                      <option value="P1350566465417574" _price="10000">
                        Next Step - Negotiations (10,000원)
                      </option>
                      <option value="P1350566453785520" _price="10000">
                        Next Step - Meeting (10,000원)
                      </option>
                      <option value="P1350566326017717" _price="15000">
                        CUBE 900 (15,000원)
                      </option>
                      <option value="P1350566314462525" _price="15000">
                        CUBE 800 (15,000원)
                      </option>
                      <option value="P1350566301004245" _price="15000">
                        CUBE 700 (15,000원)
                      </option>
                      <option value="P1350566292292050" _price="15000">
                        CUBE 600 (15,000원)
                      </option>
                      <option value="P1350564956765554" _price="15000">
                        CUBE 500 (15,000원)
                      </option>
                      <option value="P1350564945662343" _price="15000">
                        CUBE 400 (15,000원)
                      </option>
                      <option value="P1350564934045170" _price="15000">
                        CUBE 300 (15,000원)
                      </option>
                    </select>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-20">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">총 실청구금액</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>
                <span className="txt-green-light">총 실청구금액</span>
              </th>
              <td>
                <div className="flexYCenter gap">
                  <input type="number" className="input-init text-right" />
                  <div>원</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-20">
        <div className="ml-auto">
          <Buttons className="primary mid">주문등록</Buttons>
          <Buttons className="grey-light mid">취소</Buttons>
        </div>
      </div>
    </div>

    // <div>
    //   일괄주문등록 모달
    //   <br />
    //   <br />
    //   {languageList.map((language, idx) => {
    //     return <div key={language + idx}> {language}</div>;
    //   })}
    //   <br />
    //   <br />
    //   {courseList.map((course, idx) => {
    //     return <div key={course + idx}>{course}</div>;
    //   })}
    //   <br />
    //   <br />
    //   {memberList.map((member, idx) => (
    //     <div key={member.name + idx}>
    //       <div>{member.name}</div>
    //       <div>{member.email}</div>
    //     </div>
    //   ))}
    //   <br />
    //   <br />
    //   {productList.map((product) => {
    //     return (
    //       <div key={product.code}>
    //         {product.label} / {product.price}원
    //       </div>
    //     );
    //   })}
    //   <br />
    //   <br />
    //   {teacherList.map((teacher) => {
    //     return <div key={teacher.value}>/ {teacher.label} /</div>;
    //   })}
    //   <br />
    //   <br />
    //   {deviceList.map((device) => {
    //     return (
    //       <div key={device.code}>
    //         {device.label} / {device.price}원 / {device.colorOptions}
    //       </div>
    //     );
    //   })}
    //   <br />
    //   <br />
    //   {textbookList.map((textbook) => {
    //     return (
    //       <div key={textbook.code}>
    //         {textbook.label} / {textbook.price}원
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

export default RegisterBatchOrderModal;
