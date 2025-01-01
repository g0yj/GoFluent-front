import ServiceMember from "@/app/service/service-members";
import Buttons from "@/components/Buttons";
import PageNations from "@/components/PageNations";
import usePagination from "@/hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// 홈페이지관리(1depth) > 직원관리(2depth)
const EmployeeManagementContents = () => {
  const [isDetail, setIsDetail] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState();

  const onClick = () => {
    setData(null);
    setIsDetail(true);
  };

  const onModifyClick = async (item) => {
    const res = await ServiceMember.get(item.id)

    setData(res);
    setIsDetail(true);
  }

  // 검색 조건 (form)
  const paginationData = usePagination();

  const getList = useCallback(async () => {
    try {
      const saveData = {
        type: "A",
        page: paginationData.page,
      };

      const data = await ServiceMember.getList(saveData);

      setTotal(data.totalCount);
      setDataList(data.list);
      paginationData.setTotalPage(data.totalPage);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationData.page]);

  const goBack = async () => {
    setIsDetail(false);

    await getList();
  };

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <section className="ui-contents-wrap mid-width flex1">
      <div className="ui-contents-inner">
        {isDetail ? (
          <EmployeeManagementContentsDetail admin={data} goBack={goBack}/>
        ) : (
          <div>
            <div className="ui-location-wrap">
              <div className="ui-location-title">직원관리</div>
              <div className="ui-location">
                <NavLink>
                  <i className="fa-solid fa-house"></i>
                </NavLink>
                <NavLink>
                  <i className="fa-solid fa-caret-right"></i>
                  <strong>홈페이지관리</strong>
                </NavLink>
                <i className="fa-solid fa-caret-right"></i>
                <strong>직원관리</strong>
              </div>
            </div>

            <div className="layout-between sp-mt-10">
              <div>
                <div className="size-bodyXS">
                  <strong className="m">총 :</strong>{" "}
                  <strong className="b txt-secondary">{total}</strong>{" "}
                  <span className="txt-grey600">명</span>
                </div>
              </div>

              <div className="gap-s">
                <Buttons className="outlined small" onClick={onClick}>
                  직원 등록
                </Buttons>
              </div>
            </div>

            <div className="ui-list-table sp-mt-10">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>강사명</th>
                    {/* <th>Profile</th> */}
                    <th>이메일</th>
                    <th>재직</th>
                    <th>수정</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList?.map((item) => (
                    <tr key={item.listNumber}>
                      <td>{item.listNumber}</td>
                      <td>{item.name}</td>
                      {/* <td>University of Toronto</td> */}
                      <td>{item.email}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={item?.active}
                          readOnly
                        >
                        </input>
                      </td>
                      <td>
                        <Buttons className="outlined xsmall" onClick={() => onModifyClick(item)}>수정</Buttons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <PageNations key={paginationData.startPage} data={paginationData} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const EmployeeManagementContentsDetail = ({admin, goBack}) => {
  const [submitData, setSubmitData] = useState({
    name: admin?.name || "", 
    loginId: admin?.loginId || "", 
    email: admin?.email ||"", 
    gender: admin?.gender || "", 
    cellPhone: admin?.cellPhone || "", 
    active: admin?.active || false,
  });

  const onSubmitPress = async () => {
    if(admin) {
      await ServiceMember.update(admin.id, submitData);
    } else {
      const regSubmitData = {
        ...submitData,
        type: "A"
      }
      await ServiceMember.register(regSubmitData);
    }
    
    goBack();
  }

  const onDeletePress = async () => {
    if (window.confirm("삭제 하시겠습니까??")) {
      await ServiceMember.delete(admin.id)
    }

    goBack();
  }

  const onChangeSubmitData = (item) => {
    setSubmitData((prev) => ({...prev, ...item}));
  }

  return (
    <div>
      <div className="ui-location-wrap">
        <div className="ui-location-title">직원등록</div>
      </div>

      <div className="flex sp-mt-10">
        <div className="ml-auto size-small txt-grey700">
          (<i className="require">*</i> 표시필수)
        </div>
      </div>

      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>
                성명 <i className="require">*</i>
              </th> 
              <td>
                <input 
                  type="text" 
                  className="input-init" 
                  value = {submitData?.name}
                  onChange={(e) => onChangeSubmitData({name: e.target.value})}
                />
              </td>
            </tr>
            <tr>
              <th>아이디<i className="require">*</i></th>
              <td>
                <input 
                  type="text" 
                  className="input-init" 
                  value={submitData?.loginId}  
                  onChange={(e) => onChangeSubmitData({loginId: e.target.value})}
                />
              </td>
            </tr>
            <tr>
              <th>이메일<i className="require">*</i></th>
              <td>
                <input
                  type="text"
                  className="input-init" 
                  value={submitData?.email}
                  onChange={(e) => onChangeSubmitData({email: e.target.value})}
                />
              </td>
            </tr>
            <tr>
              <th>비밀번호<i className="require">*</i></th>
              <td>
                <input 
                  type="text" 
                  className="input-init" 
                  onChange={(e) => onChangeSubmitData({password: e.target.value})}
                />
                {admin && (
                  <span className="txt-error-deep size-xsmall">(변경시만 입력)</span>
                )}
              </td>
            </tr>
            <tr>
              <th>휴대전화<i className="require">*</i></th>
              <td>
                <input
                  type="text"
                  className="input-init" 
                  value={submitData?.cellPhone}
                  onChange={(e) => onChangeSubmitData({cellPhone: e.target.value})}
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
                      checked={submitData?.gender === "M" }
                      onChange={(e) => onChangeSubmitData({gender: e.target.value})}
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
                      checked={submitData?.gender === "F"}
                      onChange={(e) => onChangeSubmitData({gender: e.target.value})}
                    />
                    <label htmlFor="female">여</label>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>재직</th>
              <td>
                <input
                  type="checkbox"
                  checked={submitData?.active}
                  onChange={(e) => onChangeSubmitData({isActive: e.target.checked})}
                >
                </input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-10">
        <Buttons className="grey-light small text-center" style={{ width: 80 }} onClick={goBack}>
          목록
        </Buttons>
        {admin?.id? 
        (
          <div className="gap">
            <Buttons className="primary small text-center" style={{ width: 80 }} onClick={onSubmitPress}>
              수정
            </Buttons>
            <Buttons className="primary small text-center" style={{ width: 80 }} onClick={onDeletePress}>
              삭제
            </Buttons>
          </div>
        ):(
          <Buttons className="primary small text-center" style={{ width: 80 }} onClick={onSubmitPress}>
            등록
          </Buttons>
      )}
      </div>
    </div>
  );
};

export default EmployeeManagementContents;
