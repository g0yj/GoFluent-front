import { useCallback, useEffect, useState } from "react";
import { TeacherType } from "@/app/api/common";
import ServiceTeacher from "@/app/service/service-teacher";
import Buttons from "@/components/Buttons";
import usePaymentUpdateWindow from "@/app/helper/windows-hooks/use-payment-update-window";
import ServiceOrder from "@/app/service/service-order";

const PaymentUpdateModal = () => {
    const {paymentInfo, updateOpen, setNewState} = usePaymentUpdateWindow();
    const [consultants, setConsultants] = useState([]);
    const [consultant, setConsultant] = useState();
    const [month, setMonth] = useState();
    const [cardNumber, setCardNumber] = useState();
    const [approval, setApproval] = useState();
    const [company, setCompany] = useState();
    const [cardLists, setCardList] = useState();

    console.log(paymentInfo)

    const getConsultants = useCallback( async () => {
        const res = await ServiceTeacher.getTeacherOptionsList({
            fields: TeacherType[1].id,
        })

        setConsultants(res.consultants);
    })

    const onClose = () => {
        window.close();
    }

    const onModifyPayments = async () => {
        const saveData = {
            modifiedBy: consultant,
            cardCompany: company,
            cardNumber: cardNumber,
            installmentMonths: month,
            approvalNumber: approval
        }

        console.log(paymentInfo.id)

        await ServiceOrder.modifyPayment(paymentInfo.memberId, paymentInfo.orderId, paymentInfo.id, saveData)
        setNewState(true);
        window.close();
    }
    
    useEffect(() => {
        if (paymentInfo) {
            setConsultant(paymentInfo.modifiedBy);
            setCompany(paymentInfo.cardCompany);
            setCardNumber(paymentInfo.cardNumber);
            setApproval(paymentInfo.approvalNumber);
            setMonth(paymentInfo.installmentMonths);
            setCardList(paymentInfo.cards)
        }
        getConsultants();
    }, [paymentInfo])

    return (
        <div style={{ padding: 10 }}>
            <div className="ui-sub-title sticky-tabs">
                <div className="title">
                <div className="tit-wrap">
                    <div className="tit">결제수정</div>
                </div>
                </div>
            </div>

            <div className="sp-mt-20">
                <div className="ui-sub-title small has-bg sp-mt-20">
                    <div className="title">
                        <div className="tit-wrap">
                            <div className="tit">결제수정</div>
                        </div>
                    </div>
                </div>
                <div className="ui-info-table th-left sp-mt-5">
                    <table className="fixed">
                        <colgroup>
                            <col style={{ width: 100 }} />
                        </colgroup>
                        {paymentInfo?.paymentMethod === "카드" ? (
                            <tbody>
                                <tr>
                                    <th>처리자</th>
                                    <td>
                                        <select className="input-init" value={consultant} onChange={(e) => setConsultant(e.target.value)}>
                                            <option value="">-선택-</option>
                                            {consultants.map((consultant) => (
                                                <option key={consultant.value} value={consultant.value}>{consultant.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>카드종류</th>
                                    <td>
                                        <button className="ui-select">
                                            <select className="input-init" value={company} onChange={(e) => setCompany(e.target.value)}>
                                                <option value="">-선택-</option>
                                                {cardLists?.map((card) => (
                                                    <option key={card.code} value={card.code}>{card.name}</option>
                                                ))}
                                            </select>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <th>카드번호</th>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="input-init text-left" 
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>할부개월</th>
                                    <td>
                                        <button className="ui-select">
                                            <select className="input-init" value={month} onChange={(e) => setMonth(e.target.value)}>
                                                <option value>-선택-</option>
                                                <option key={0} value={0}>일시불</option>
                                                <option key={2} value={2}>2개월</option>
                                                <option key={3} value={3}>3개월</option>
                                                <option key={4} value={4}>4개월</option>
                                                <option key={5} value={5}>5개월</option>
                                                <option key={6} value={6}>6개월</option>
                                                <option key={10} value={10}>10개월</option>
                                                <option key={12} value={12}>12개월</option>
                                            </select>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <th>승인번호</th>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="input-init text-left" 
                                            value={approval}
                                            onChange={(e) => setApproval(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <th>처리자</th>
                                    <td>
                                        <select className="input-init" value={consultant} onChange={(e) => setConsultant(e.target.value)}>
                                            <option value="">-선택-</option>
                                            {consultants.map((consultant) => (
                                                <option key={consultant.value} value={consultant.value}>{consultant.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
                <div className="layout-between sp-mt-5">
                    <Buttons className="outlined mid" onClick={onClose}>취소</Buttons>
                    <Buttons className="primary mid" onClick={onModifyPayments}>수정</Buttons>
                </div>
            </div>
        </div>
    )
};

export default PaymentUpdateModal;