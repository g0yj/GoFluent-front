import useEvaluationStatusWindow from "@/app/helper/windows-hooks/use-evaluation-status-window";
import ServiceSms from "@/app/service/service-sms";
import Buttons from "@/components/Buttons";
import { useCallback, useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";
import { NavLink } from "react-router-dom";
import ServiceTeacher from "@/app/service/service-teacher";
import dayjs from "dayjs";
import _ from "lodash";
import ServiceLDF from "@/app/service/service-ldf";

// 통계보고서 > 평가현황
const EvaluationStatus = () => {
  const { openEvaluationStatusWindow } = useEvaluationStatusWindow();

  const [isExpanded, setExpanded] = useState(true);
  const { getCollapseProps } = useCollapse({ isExpanded });
  const [searchData, setSearchData] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
  });
  const [listData, setListData] = useState([]);
  const [teacherCount, setTeacherCount] = useState(0)
  const [totalGradeCount, setTotalGradeCount] = useState(0);
  const [member, setMember] = useState(0);

  const onChangeSearchData = (data) => {
    setSearchData((prev) => ({ ...prev, ...data }));
  };

  const onSelect = async (data) => {
    const getData = {
      date: dayjs(data?.date).format('YYYY-MM'),
      teacherId: data?.teacherId
    }

    const res = await ServiceLDF.getLdfLists(getData);

    openEvaluationStatusWindow({ ...data, year: searchData.year, month: searchData.month, ldfList: res });
  };

  const getTeacherCount = async () => {
    const dateFrom = new Date(searchData?.year, searchData?.month - 1, 1);
    const dateTo = new Date(searchData?.year, searchData?.month, 0);

    const teacherData = {
      dateFrom: dayjs(dateFrom).format("YYYY-MM-DD"),
      dateTo: dayjs(dateTo).format("YYYY-MM-DD")
    }

    const res = await ServiceTeacher.getWorked(teacherData);

    console.log("worked", res)
    setTeacherCount(res.length);
  }

  const getMember = async () => {
    const dateFrom = new Date(searchData?.year, searchData?.month - 1, 1);
    const dateTo = new Date(searchData?.year, searchData?.month, 0);

    const saveData = {
      dateFrom: dayjs(dateFrom).format("YYYY-MM-DD"),
      dateTo: dayjs(dateTo).format("YYYY-MM-DD")
    }

    const res = await ServiceSms.getGradeMember(saveData);

    console.log("memberCount", res)
    setMember(res.length);
  }

  const onClickSearch = async () => {
    const saveData = {
      date: `${searchData?.year}-${searchData?.month}-01`,
      search: searchData?.search,
      keyword: "name"
    };

    const res = await ServiceSms.getEvaluationList(saveData);
    setListData(res);
  }

  const getData = useCallback(async () => {
    const saveData = {
      date: `${searchData?.year}-${searchData?.month}-01`,
      search: searchData?.search || "",
      keyword: "name"
    };

    console.log("saveData:::", saveData);

    const res = await ServiceSms.getEvaluationList(saveData);
    console.log(res);
    setListData(res);
    setTotalGradeCount(_.sumBy(res, 'gradeCount'));

    await getTeacherCount();
    await getMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData?.month, searchData?.year]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="ui-contents-wrap mid-width flex1">
      <div className="ui-contents-inner">
        <div className="ui-location-wrap">
          <div className="ui-location-title">평가현황</div>

          <div className="ui-location">
            <NavLink>
              <i className="fa-solid fa-house"></i>
            </NavLink>
            <i className="fa-solid fa-caret-right"></i>
            <strong>평가현황</strong>
          </div>
        </div>

        <div className="flex">
          <div className="ml-auto">
            <Buttons onClick={() => setExpanded((prevExpanded) => !prevExpanded)}>
              <span className="flexYCenter gap">
                <span className={`${isExpanded ? "tf-rotate" : ""}`}>
                  <i className="fa-solid fa-circle-chevron-down txt-secondary"></i>
                </span>
                <span className="size-bodyS">상세검색</span>
              </span>
            </Buttons>
          </div>
        </div>
        <div className="ui-info-table" {...getCollapseProps()}>
          <table>
            <colgroup>
              <col style={{ width: 120 }} />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>수업일</th>
                <td>
                  <div className="flexYCenter gap">
                    <button className="ui-select">
                      <select
                        name="yy"
                        className="input-init"
                        value={searchData.year}
                        onChange={({ target: { value } }) => onChangeSearchData({ year: value })}
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
                        name="mm"
                        className="input-init"
                        value={searchData.month}
                        onChange={({ target: { value } }) => onChangeSearchData({ month: value })}
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
                  </div>
                </td>
              </tr>
              <tr>
                <th>강사명</th>
                <td>
                  <div className="flexYCenter gap">
                    <input
                      type="text"
                      className="input-init"
                      placeholder="검색"
                      onChange={({ target: { value } }) => onChangeSearchData({ search: value })}
                    />
                    <Buttons className="outlined xsmall" onClick={onClickSearch}>
                      <span className="flexYCenter gap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        검색
                      </span>
                    </Buttons>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flexBetween sp-mt-10">
          <div>
            <div className="txt-secondary">* 평가는 익명으로 진행됩니다.</div>
            <div>* 별점: 0.5 ~ 5.0</div>
            <div>* 이달 근무한 강사는 {teacherCount}명이며, 평가데이터가 있는 강사는 {listData? listData.length : 0}명입니다.</div>
            <div>* 평가에 참여한 학습자는 {member}명입니다.</div>
          </div>

          {/* <div style={{ alignSelf: "flex-end" }}>
            <Buttons className="outlined small">
              <div className="flex gap">
                EXCEL
                <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
              </div>
            </Buttons>
          </div> */}
        </div>

        <div className="ui-info-table txt-mid another sp-mt-10">
          <table>
            <colgroup>
              <col style={{ width: 70 }} />
              <col style={{ width: 180 }} />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>강사명</th>
                <th>평가인원수</th>
                <th>평점</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {listData && listData?.length > 0 ? (
                listData?.map((item, index) => {
                  return (
                    <tr key={item.teacherId}>
                      <td>{index+1}</td>
                      <td>{item.teacherName}</td>
                      <td>{item.gradeCount}</td>
                      <td>{item.gradeAvg}</td>
                      <td>
                        <Buttons className="outlined xsmall" onClick={() => onSelect(item)}>
                          보기
                        </Buttons>
                      </td>
                    </tr>
                  )
                })
              ):(
                <tr>
                  <td colSpan="5">해당 자료가 없습니다.</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bgc-grey300">
                <td colSpan={2}>
                  <strong className="b">총계</strong>
                </td>
                <td>{totalGradeCount}</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvaluationStatus;
