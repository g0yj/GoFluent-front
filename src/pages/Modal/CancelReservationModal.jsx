import Buttons from "@/components/Buttons";
import storage from "@/app/local/local-storage";
import { useState } from "react";
import useCancelReservationWindow from "@/app/helper/windows-hooks/use-cancel-reservation-window"; 
import ServiceResv from "@/app/service/service-resv";


const CancelReservationModal = () => {
  const canceler = storage.loginedName.get();
  const { cancelData, member, course, cancelResv, CancelResvOpen } = useCancelReservationWindow();
  const [ cancelReason, setCancelReason ]= useState("");

  console.log(course)

  const clickCancel = async() => {
    const updateData = cancelData.map(data => ({
      ...data,
      cancelReason: cancelReason
    }));

    if(confirm("취소하시겠습니까?")) {
      const saveData = {
        "reservations": [
          ...updateData
        ]
      }
        
      await ServiceResv.cancelReservations(member.id, saveData);
      CancelResvOpen(true);
    } 
      window.close();
  }

  const onClose = () => {
    window.close();
  }
  return (
    <div className="layout-popup-wrap">
      <div className="ui-location-wrap">
        <div className="ui-location-title">예약취소</div>
      </div>

      <div className="ui-sub-title small has-bg sp-mt-10">
        <div className="title">
          <div className="tit-wrap">
            <div className="tit">예약취소사유</div>
          </div>
        </div>
      </div>
      <div className="ui-info-table th-left sp-mt-10">
        <table>
          <colgroup>
            <col style={{ width: 120 }} />
          </colgroup>
          <tbody>
            <tr>
              <th>과정 / 강사</th>
              <td>{course.name} / {course.teacherName}</td>
            </tr>
            <tr>
              <th>취소처리자</th>
              <td>{canceler}</td>
            </tr>
            <tr>
              <th>취소사유</th>
              <td>
                <input
                  type="text" 
                  className="input-init full"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="layout-between sp-mt-10">
        <div className="ml-auto">
          <Buttons className="grey-light mid" onClick={onClose}>닫기</Buttons>
          <Buttons className="primary mid" onClick={clickCancel}>저장</Buttons>
        </div>
      </div>
    </div>
  );
};

export default CancelReservationModal;
