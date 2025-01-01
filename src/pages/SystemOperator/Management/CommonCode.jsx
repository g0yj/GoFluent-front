import ServiceCommon from "@/app/service/service-common";
import Buttons from "@/components/Buttons";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const CommonCode = () => {
  const [dataList, setDataList] = useState([]);
  const [isModify, setIsModify] = useState(false);
  const [modifyItem, setModifyItem] = useState();
  const [codeGroupList, setCodeGroupList] = useState();
  const [code, setCode] = useState('100');

  const createCommonCode = async () => {
    setModifyItem(null)
    setIsModify(true);
  };

  const getData = async () => {
    try {
      const res = await ServiceCommon.getCommonCode({codeGroup: code});

      setDataList(res.commonCode);
    } catch (error) {
      console.error(error);
    }
  };

  const clickModify = (item) => {
    setModifyItem(item);
    setIsModify(true);
  }

  const getCodeGroupList = async () => {
    const res = await ServiceCommon.getAllCodeGroup();
    setCodeGroupList(res.commonCodeGroup)
    console.log(res)
  }

  const goBack = () => {
    setIsModify(false);
    getData();
  }

  const onCreateCode = async (data) => {
    await ServiceCommon.createCommonCode(data);
    goBack();
  }

  const onModifyCode = async (data) => {
    console.log("modify Data: ", data)
    await ServiceCommon.modifyCommonCode(data.code, data);
    goBack();
  }

  useEffect(() => {
    getData();
    getCodeGroupList();
  }, [code]);

  return (
    <section className="ui-contents-wrap mid-width flex1">
      <div className="ui-contents-inner">
        <div>
          <div className="ui-location-wrap">
            <div className="ui-location-title">공통코드 관리</div>
            <div className="ui-location">
              <NavLink>
                <i className="fa-solid fa-house"></i>
              </NavLink>
              <NavLink>
                <i className="fa-solid fa-caret-right"></i>
                <strong>홈페이지관리</strong>
              </NavLink>
              <i className="fa-solid fa-caret-right"></i>
              <strong>공통코드 관리</strong>
            </div>
          </div>

          {
            isModify ? (
            <ModifyCommonCode
              modifyItem={modifyItem}
              codeGroupList={codeGroupList}
              onModifyCode={onModifyCode}
              onCreateCode={onCreateCode}
              goBack={goBack}
            />
          ):(
            <div>
                <div className="sp-mt-10">
                  <div className="layout-between gap">
                    <select onChange={(e) => setCode(e.target.value)}>
                      {Array.isArray(codeGroupList) ? (
                        codeGroupList.map((group) => {
                          return (
                            <option key={group.codeGroup} value={group.codeGroup}>
                              {group.codeGroupName}
                            </option>
                          )
                        })
                      ) : (
                        <option disabled>코드 그룹이 없습니다.</option>
                      )}                  
                    </select>
                    <Buttons className="outlined small" onClick={createCommonCode}>
                      등록
                    </Buttons>
                  </div>
                </div>

              <div className="ui-list-table sp-mt-10">
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>코드 그룹명</th>
                      <th>코드</th>
                      <th>코드명</th>
                      <th>순서</th>
                      <th>활성화</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataList.map((item, index) => (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item.codeGroupName}</td>
                        <td>{item.code}</td>
                        <td>
                          <Buttons className="ui-link secondary-high small" onClick={() => clickModify(item)}>
                            {item.name}
                          </Buttons>
                        </td>
                        <td>{item.sort}</td>
                        <td><input type="checkbox" checked={item.useYn === 'Y'}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ModifyCommonCode = ({ modifyItem, codeGroupList, onModifyCode, onCreateCode, goBack }) => {
  const [codeGroup, setCodeGroup] = useState(modifyItem?.codeGroup || '');
  const [code, setCode] = useState(modifyItem?.code || '');
  const [name, setName] = useState(modifyItem?.name || '');
  const [sort, setSort] = useState(modifyItem?.sort || 0);
  const [useYn, setUseYn] = useState(modifyItem?.useYn || '');
  const [saveData, setSaveData] = useState({
    codeGroup: codeGroup,
    code: code,
    name: name,
    sort: sort,
    useYn: useYn,
  });

  const handleChange = (data) => {
    setSaveData({
      ...saveData,
      ...data
    })
  }
  
  return (
    <div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 150 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>
                코드그룹명 <i className="require">*</i>
              </th> 
              <td>
                <select 
                  className="input-init" 
                  value={codeGroup}
                  onChange={(e) => {handleChange({codeGroup: e.target.value}); setCodeGroup(e.target.value)}}
                  disabled={!!modifyItem}
                >
                  <option value>-선택-</option>
                  {codeGroupList?.map((group) => (
                    <option key={group.codeGroupName} value={group.codeGroup}>
                      {group.codeGroupName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th>코드<i className="require">*</i></th>
              <td>
                <input 
                  type="text" 
                  className="input-init" 
                  value={code}
                  onChange={(e) => {handleChange({code: e.target.value}); setCode(e.target.value)}}
                  readOnly={!!modifyItem}
                  placeholder="서버에서 사용하는 코드"
                />
              </td>
            </tr>
            <tr>
              <th>코드명<i className="require">*</i></th>
              <td>
                <input
                  type="text"
                  className="input-init" 
                  value={name}
                  onChange={(e) => {handleChange({name: e.target.value}); setName(e.target.value)}}
                  placeholder="화면에서 사용하는 코드명"
                />
              </td>
            </tr>
            <tr>
              <th>순서<i className="require">*</i></th>
              <td>
                <input 
                  type="number" 
                  className="input-init" 
                  value={sort}
                  onChange={(e) => {handleChange({sort: e.target.value}); setSort(e.target.value)}}
                />
              </td>
            </tr>
            <tr>
              <th>활성화<i className="require">*</i></th>
              <td>
                <input
                  type="checkbox"
                  className="input-init" 
                  checked={useYn === 'Y'}
                  onChange={(e) => {handleChange({useYn: e.target.checked ? 'Y' : 'N'}); setUseYn(e.target.checked ? 'Y' : 'N')}}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="layout-between sp-mt-10">
          <Buttons className="grey-light small text-center" style={{ width: 80 }} onClick={goBack}>
            목록
          </Buttons>
          {modifyItem ? (
            <Buttons className="grey-light small text-center" style={{ width: 80 }} onClick={() => onModifyCode(saveData)}>
              수정
            </Buttons>
          ):(
            <Buttons className="grey-light small text-center" style={{ width: 80 }} onClick={() => onCreateCode(saveData)}>
              등록
            </Buttons>
          )}
      </div>
    </div>
  );
}

export default CommonCode;
