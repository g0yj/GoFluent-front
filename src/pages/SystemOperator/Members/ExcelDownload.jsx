import React from 'react';
import Buttons from "@/components/Buttons";
import ExcelJS from 'exceljs';

const TEMPLATE_URL = '/excelFileForm.xlsx';

const downloadExcel = async ({member, excelData}) => {
    console.log("member",member, "excelData", excelData)

    // 템플릿 파일 불러오기
    const response = await fetch(TEMPLATE_URL);
    const arrayBuffer = await response.arrayBuffer();

    // 첫 번째 시트 선택
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];

    // 해당 시트에 데이터 세팅
    worksheet.getCell('C3').value = member.name || '';                                  // STUDENT NAME
    worksheet.getCell('G3').value = '구로';                                             // BRANCH
    worksheet.getCell('C4').value = excelData.interviewer || '';                        // TEACHER
    worksheet.getCell('G4').value = member.createDate || '';                            // DATE
    worksheet.getCell('C7').value = excelData.purpose || '';                            // Purpose of Study
    worksheet.getCell('A9').value = excelData.studyType.join(', ') || '';               // What kind of English do you want to study and learn?
    worksheet.getCell('C12').value = excelData.familyBackground || '';                  // Family Background
    worksheet.getCell('C13').value = excelData.usageType || '';                         // Company or School
    worksheet.getCell('C14').value = excelData.occupation || '';                        // Occupation
    worksheet.getCell('C15').value = excelData.spareTime || '';                         // Spare Time
    worksheet.getCell('C16').value = excelData.Travel || '';                            // Travel Abroad
    worksheet.getCell('C17').value = excelData.futurePlans || '';                       // Future Plans
    worksheet.getCell('C20').value = excelData.consonants.join(', ') || '';             // Consonants
    worksheet.getCell('C21').value = excelData.vowels.join(', ') || '';                 // Vowels
    worksheet.getCell('C22').value = excelData.clarity || '';                           // Clarity
    worksheet.getCell('C23').value = excelData.intonation || '';                        // Intonation
    worksheet.getCell('B24').value = excelData.vocabulary || '';                        // Vocabulary
    worksheet.getCell('C25').value = excelData.verbsTense || '';                        // Verbs tense
    worksheet.getCell('C26').value = excelData.agreement || '';                         // Agreement
    worksheet.getCell('C27').value = excelData.prepositions || '';                      // Prepositions
    worksheet.getCell('C28').value = excelData.articles || '';                          // Articles
    worksheet.getCell('C29').value = excelData.plurals || '';                           // Plurals
    worksheet.getCell('C30').value = excelData.others || '';                            // Others
    worksheet.getCell('B31').value = excelData.strongPoint || '';                       // Strong Point
    worksheet.getCell('B32').value = excelData.weakPoint || '';                         // Weak Point
    worksheet.getCell('C33').value = excelData.comprehension || '';                     // Comprehension How much does learner understand
    worksheet.getCell('B34').value = excelData.confidence || '';                        // Confidence
    worksheet.getCell('B35').value = excelData.comments || '';                          // Additional Comments
    worksheet.getCell('A38').value = excelData.recommendedLevels.join(', ') || '';      // Recommended Level

    // 엑셀 파일 생성 및 다운로드
    const excelBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = URL.createObjectURL(blob);

    // 링크 생성 후 다운로드 트리거
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'LevelTestResult.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
  
// React 컴포넌트에서 버튼 클릭으로 CSV 다운로드
const DownloadButton = ({member, excelData}) => {
    const handleClick = () => {
        downloadExcel({member, excelData });
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