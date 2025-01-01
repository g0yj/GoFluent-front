import Buttons from "@/components/Buttons";
import usePagination from "@/hooks/usePagination";
import PageNations from "@/components/PageNations";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ServiceOrder from "@/app/service/service-order";

// 홈페이지관리(1depth) > 상품관리(2depth)
const Product = () => {
  const [isDetail, setIsDetail] = useState(true);
  const [products, setProducts] = useState();
  const [product, setProduct] = useState();
  const paginationData = usePagination();

  const getProductList = useCallback(async() => {
    const res = await ServiceOrder.getProductsList();
    setProducts(res);

    console.log(res);
  }, [paginationData.page]);

  const onClick = () => {
    setIsDetail(false);
  };

  const onModifyClick = (item) => {
    setIsDetail(false);
    setProduct(item);
  }

  const goBack = () => {
    setProduct(null);
    setIsDetail(true);
    getProductList();
  }

  useEffect(() => {
    getProductList();
  }, [])

  return (
    <section className="ui-contents-wrap mid-width flex1">
      <div className="ui-contents-inner">
        {!isDetail ? (
          <ProductDetail product={product} goBack={goBack}/>
        ) : (
          <div>
            <div className="ui-location-wrap">
              <div className="ui-location-title">상품 관리</div>
              <div className="ui-location">
                <NavLink>
                  <i className="fa-solid fa-house"></i>
                </NavLink>
                <NavLink>
                  <i className="fa-solid fa-caret-right"></i>
                  <strong>홈페이지관리</strong>
                </NavLink>
                <i className="fa-solid fa-caret-right"></i>
                <strong>상품 관리</strong>
              </div>
            </div>

            <div className="layout-between sp-mt-10">
              <div className="ml-auto gap">
                <Buttons className="outlined small" onClick={onClick}>
                  등록
                </Buttons>
              </div>
            </div>

            <div className="ui-list-table sp-mt-10">
              <table>
                <colgroup>
                  <col style={{ width: 600 }} />
                  <col style={{ width: 150 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>과정여부</th>
                    <th>30분과정여부</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((item) => (
                    <tr>
                      <td>
                        <Buttons className="ui-link secondary-high small" onClick={() => onModifyClick(item)}>
                          {item.name}
                        </Buttons>
                      </td>
                      <td>{item.price.toLocaleString()} 원</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={item?.curriculumYN === 'Y'
                          }
                          readOnly
                        >
                        </input>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={item?.shortCourseYN === 'Y'
                          }
                          readOnly
                        >
                        </input>
                      </td>
                    </tr>
                  ))

                  }
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

const ProductDetail = ({product, goBack}) => {
  const [modifyProduct, setModifyProduct] = useState({curriculumYN: product?.curriculumYN || 'N', name: product?.name || "", price: product?.price || null, shortCourseYN: product?.shortCourseYN || 'N'});

  const onChangeData = (data) => {
    setModifyProduct((prev) => ({...prev, ...data}));
  }

  const onModifyBtn = async () => {
    console.log("수정 데이터" ,modifyProduct, product?.id)
    await ServiceOrder.updateProduct(product?.id, modifyProduct)
    goBack();
  }

  const onDeleteBtn = async () => {
    await ServiceOrder.deleteProduct(product?.id)
    goBack();
  }

  const onRegBtn = async () => {
    console.log("등록 데이터" ,modifyProduct)
    await ServiceOrder.createProduct(modifyProduct);
    goBack();
  }

  useEffect(() => {
    console.log("수정 데이터:", modifyProduct)
  }, [modifyProduct])

  return (
    <div>
      <div className="ui-location-wrap">
        <div className="ui-location-title">상품관리 등록</div>
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
                과정여부 <i className="require">*</i>
              </th>
              <td>
                <input 
                  type="checkbox" 
                  checked={modifyProduct?.curriculumYN === 'Y'}
                  onChange={(e) => onChangeData({ curriculumYN: e.target.checked ? 'Y' : 'N'})}
                />
              </td>
            </tr>
            <tr>
              <th>
                30분 과정여부
              </th>
              <td>
                <input 
                  type="checkbox" 
                  checked={modifyProduct?.shortCourseYN === 'Y'}
                  onChange={(e) => onChangeData({ shortCourseYN: e.target.checked ? 'Y' : 'N'})}
                />
              </td>
            </tr>
            <tr>
              <th>
                상품명 <i className="require">*</i>
              </th>
              <td>
                <input 
                  type="text" 
                  className="input-init" 
                  value={modifyProduct?.name}
                  onChange={({ target: { value} }) => onChangeData({ name: value })}
                />
              </td>
            </tr>
            <tr>
              <th>
                가격 <i className="require">*</i>
              </th>
              <td>
                <div className="flexYCenter gap">
                  <input 
                    type="text" 
                    className="input-init" 
                    value={Number(modifyProduct?.price).toLocaleString()}
                    onChange={({ target: { value } }) => {
                      const numericValue = value.replace(/[^0-9]/g, '');
                      onChangeData({ price: numericValue });
                    }}
                  />
                  <div>원</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="layout-between sp-mt-10">
        <Buttons className="grey-light small text-center" style={{ width: 80 }} onClick={goBack}>
          목록
        </Buttons>
        {
          product? (
            <div>
              <Buttons className="primary small text-center" style={{ width: 80 }} onClick={onDeleteBtn}>
                삭제
              </Buttons>
              <Buttons className="primary small text-center" style={{ width: 80 }} onClick={onModifyBtn}>
                수정
              </Buttons>
            </div>
          ): (
            <Buttons className="primary small text-center" style={{ width: 80 }} onClick={onRegBtn}>
              등록
            </Buttons>
          )
        }
      </div>
    </div>
  );
};

export default Product;
