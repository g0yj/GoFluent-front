import React from 'react';
import Buttons from "@/components/Buttons";
import ExcelJS from 'exceljs';

// 해당 엑셀 다운로드 기능은 추후 다른 곳에서 사용할 수 있게 수정 필요

const getColumnLetter = (index) => {
    let letter = '';
    while (index >= 0) {
        letter = String.fromCharCode((index % 26) + 'A'.charCodeAt(0)) + letter;
        index = Math.floor(index / 26) - 1;
    }
    return letter;
};


const downloadExcel = async ({page, header, excelData}) => {
    console.log("page:", page, "header", header, "excelData", excelData)

    const getExcelData = excelData;

    console.log("dfsdf",getExcelData)

    // 새로운 Excel 워크북과 시트 생성
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1'); // 새로운 시트 추가

    const headerRow = worksheet.addRow(header)

    // 해당 시트에 데이터 세팅
    for (let i=0; i<getExcelData.length; i++) {
        const row = getExcelData[i];

        if (page === "학사보고서") {
            console.log(getExcelData[i].attendanceStatus)
            worksheet.getCell(`B${i+2}`).value = getExcelData[i].date + getExcelData[i].startTime + getExcelData[i].endTime;
            worksheet.getCell(`C${i+2}`).value = getExcelData[i].userName;
            worksheet.getCell(`D${i+2}`).value = getExcelData[i].cellPhone;
            worksheet.getCell(`E${i+2}`).value = getExcelData[i].assignedLessonCount + "/" + getExcelData[i].lessoncount;
            worksheet.getCell(`F${i+2}`).value = getExcelData[i].remainingLessonCount;
            worksheet.getCell(`G${i+2}`).value = getExcelData[i].attendanceStatus;
            worksheet.getCell(`H${i+2}`).value = getExcelData[i].report;
        } else if (page === "회원") {
            worksheet.getCell(`B${i+2}`).value = getExcelData[i].id;
            worksheet.getCell(`C${i+2}`).value = getExcelData[i].email;
            worksheet.getCell(`D${i+2}`).value = getExcelData[i].name;
            worksheet.getCell(`E${i+2}`).value = getExcelData[i].nameEn;
            worksheet.getCell(`F${i+2}`).value = '';
            worksheet.getCell(`G${i+2}`).value = '구로';
            worksheet.getCell(`H${i+2}`).value = '';
            worksheet.getCell(`I${i+2}`).value = getExcelData[i].gender;
            worksheet.getCell(`J${i+2}`).value = '';
            worksheet.getCell(`K${i+2}`).value = '';
            worksheet.getCell(`L${i+2}`).value = getExcelData[i].phone;
            worksheet.getCell(`M${i+2}`).value = getExcelData[i].cellPhone;
            worksheet.getCell(`N${i+2}`).value = getExcelData[i].isReceiveSms ? 'Y' : 'N';
            worksheet.getCell(`O${i+2}`).value = getExcelData[i].isReceiveEmail ? 'Y' : 'N';
            worksheet.getCell(`P${i+2}`).value = getExcelData[i].zipcode;
            worksheet.getCell(`Q${i+2}`).value = getExcelData[i].address;
            worksheet.getCell(`R${i+2}`).value = getExcelData[i].detailedAddress;
            worksheet.getCell(`S${i+2}`).value = getExcelData[i].isOfficeWorker ? 'Y' : 'N';
            worksheet.getCell(`T${i+2}`).value = getExcelData[i].company;
            worksheet.getCell(`U${i+2}`).value = getExcelData[i].position;
            worksheet.getCell(`V${i+2}`).value = getExcelData[i].joinPath;
            worksheet.getCell(`W${i+2}`).value = getExcelData[i].language;
            worksheet.getCell(`X${i+2}`).value = getExcelData[i].etcLanguage;
            worksheet.getCell(`Y${i+2}`).value = getExcelData[i].languageSkill;
            worksheet.getCell(`Z${i+2}`).value = '';
            worksheet.getCell(`AA${i+2}`).value = ''
            worksheet.getCell(`AB${i+2}`).value = ''
            worksheet.getCell(`AC${i+2}`).value = getExcelData[i].active ? '활동' : '비활동';
        } else if (page === "SMS발송관리") {
            worksheet.getCell(`B${i+2}`).value = getExcelData[i].id;
            worksheet.getCell(`C${i+2}`).value = getExcelData[i].createdBy;
            worksheet.getCell(`D${i+2}`).value = getExcelData[i].senderName;
            worksheet.getCell(`E${i+2}`).value = getExcelData[i].senderPhone;
            worksheet.getCell(`F${i+2}`).value = getExcelData[i].content;
            worksheet.getCell(`G${i+2}`).value = getExcelData[i].total;
            worksheet.getCell(`H${i+2}`).value = getExcelData[i].date + " " + getExcelData[i].time;
        }
        for (let j=0; j < Object.keys(getExcelData[i]).length; j++) {
            const col = getColumnLetter(j + 1);
            
            // worksheet.getCell(`${col}${i + 2}`).value = row[Object.keys(row)[j]];
        }
        
        worksheet.getCell(`A${i + 2}`).value = (getExcelData.length-i);
    }

    // 엑셀 파일 생성 및 다운로드
    const excelBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = URL.createObjectURL(blob);

    // 링크 생성 후 다운로드 트리거
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${page}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
  
// React 컴포넌트에서 버튼 클릭으로 CSV 다운로드
const DownloadButton = ({page, header, excelData}) => {
    const handleClick = () => {
        downloadExcel({page, header, excelData });
    };

    return (
        <Buttons type="button" className="outlined small" onClick={handleClick}>
            <div className="flex gap">
                EXCEL
            <i className="fa-solid fa-cloud-arrow-down txt-primary-deep"></i>
            </div>
        </Buttons>
    );
};
  
  export default DownloadButton;