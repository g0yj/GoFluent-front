import usePreviewWindow from "@/app/helper/windows-hooks/use-preview-window";
import React from "react";

const SendPreviewModal = () => {

  const { previewInfo } = usePreviewWindow();

  return (
    <div>
      <table
        style={{
          width: 800,
          margin: "0 auto",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "30px 0" }}>
              <table
                style={{
                  width: "100%",
                  border: "2px solid #ddd",
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  boxShadow: "10px 10px 30px rgba(170, 170, 170, 0.2)",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "20px 20px 0" }}>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "right" }}>
                              <a href="#" target="_blank">
                                <img src="/logo.png" style={{ width: 120 }} alt="" />
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: "30px 0 20px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                }}
                              >
                                <img src="/attach_email.png" alt="" style={{ marginTop: 2 }} />
                                <strong
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 32,
                                    letterSpacing: "-1px",
                                    wordSpacing: "-1px",
                                  }}
                                >
                                  {previewInfo?.title}
                                </strong>
                              </div>
                            </td>
                          </tr>
                          <tr></tr>
                        </tbody>
                      </table>
                      <table style={{ marginLeft: 20 }}>
                        <colgroup>
                          <col style={{ width: 90 }} />
                        </colgroup>
                        <tbody>
                          <tr>
                            <th style={{ fontWeight: 700, textAlign: "left" }}>보내는 사람</th>
                            <td>{previewInfo?.sender}</td>
                          </tr>
                          <tr>
                            <th style={{ fontWeight: 700, textAlign: "left" }}>받는 사람</th>
                            {Array.isArray(previewInfo?.member) &&
                            previewInfo.member.reduce((rows, item, index) => {
                              if (index % 3 === 0) rows.push([]);
                              rows[rows.length - 1].push(item);
                              return rows;
                            }, []).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((m) => (
                                  <td key={m.name} style={{ padding: "5px 10px 0 0" }}>{m.email}</td>
                                ))}
                              </tr>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "30px 30px" }}>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                backgroundColor: "#f6f6f6",
                                padding: 30,
                                borderRadius: 10,
                              }}
                              dangerouslySetInnerHTML={{ __html: previewInfo?.content }}
                            >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SendPreviewModal;
