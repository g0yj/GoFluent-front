import usePrintMemberTestWindow from "@/app/helper/windows-hooks/use-print-member-test-window";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

/**
 * 회원 테스트 결과 프린트 모달
 */
const PrintMemberTestModal = () => {
  const { memberTest } = usePrintMemberTestWindow();
  const [ testData, setTestData ] = useState();
  const [ member, setMember ]  = useState();

  console.log(testData)

  const content = [
    'English Conversation',
    'Business English',
    'Toeic Speaking',
    'Interview',
    'ETC.'
  ];

  const usage = [
    '① Never',
    '② Seldom',
    '③ Sometimes',
    '④ Usually',
    '⑤ Always'
  ]

  const printRef = useRef(null);
  const print = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "LanguageCube LMS",
  });

  useEffect(() => {
    if (_.isEmpty(memberTest)) return;
    setTestData(memberTest?.excelData);
    setMember(memberTest?.member);
    print();
  }, [memberTest, print]);

  return (
    <div ref={printRef}>
      <div className="layout-popup-wrap">
        <div className="ui-test-header">
          <div className="logo">
            <img src="/logo.png" alt="" />
          </div>
          <div className="title">
            <div className="inner">
              <strong className="b size-h3">LEARNER DATA FILE</strong>
              <div className="name">
                <span>Name</span>
                <span>:</span>
                <strong className="b size-subtitleL">{member?.name}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="flexColumn gap-10 sp-mt-20">
          <div className="ui-sub-title small has-bg">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">Basic Information</div>
              </div>
            </div>
          </div>

          <div className="ui-info-table th-left">
            <table>
              <colgroup>
                <col style={{ width: 150 }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>Purpose of Study</th>
                  <td>{testData?.purpose}</td>
                </tr>
                <tr>
                  <th colSpan={2}>What kind of English do you want to study and learn?</th>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div className="ui-test-line">
                      {content.map((item) => (
                        <div
                          key={item}
                          className={testData?.studyType.includes(item) ? 'active' : ''}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ui-sub-title small has-bg sp-mt-10">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">Background Information</div>
              </div>
            </div>
          </div>

          <div className="ui-info-table th-left">
            <table>
              <colgroup>
                <col style={{ width: 150 }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>Family Background</th>
                  <td>{testData?.familyBackground}</td>
                </tr>
                <tr>
                  <th>Company or School </th>
                  <td>{testData?.usageType}</td>
                </tr>
                <tr>
                  <th>Occupation</th>
                  <td>{testData?.occupation}</td>
                </tr>
                <tr>
                  <th>Spare Time</th>
                  <td>{testData?.spareTime}</td>
                </tr>
                <tr>
                  <th>Travel Abroad</th>
                  <td>{testData?.travelAbroad}</td>
                </tr>
                <tr>
                  <th>Future Plans</th>
                  <td>{testData?.futurePlans}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ui-sub-title small has-bg sp-mt-10">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">Ability in Spoken English</div>
              </div>
            </div>
          </div>

          <div className="ui-info-table th-left sp-mt-5">
            <table>
              <colgroup>
                <col style={{ width: 150 }} />
                <col style={{ width: 90 }} />
              </colgroup>
              <tbody>
                <tr>
                  <th rowSpan={5}>Pronunciation</th>
                  <th className="n">Consonants</th>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.consonants.includes('r') ? 'active' : ''}>r</div>
                      <div className={testData?.consonants.includes('l') ? 'active' : ''}>l</div>
                      <div className={testData?.consonants.includes('p') ? 'active' : ''}>p</div>
                      <div className={testData?.consonants.includes('f') ? 'active' : ''}>f</div>
                      <div className={testData?.consonants.includes('b') ? 'active' : ''}>b</div>
                      <div className={testData?.consonants.includes('v') ? 'active' : ''}>v</div>
                      <div className={testData?.consonants.includes('s') ? 'active' : ''}>s</div>
                      <div className={testData?.consonants.includes('z') ? 'active' : ''}>z</div>
                      <div className={testData?.consonants.includes('ʃ') ? 'active' : ''}>ʃ</div>
                      <div className={testData?.consonants.includes('ʒ') ? 'active' : ''}>ʒ</div>
                      <div className={testData?.consonants.includes('ʧ') ? 'active' : ''}>ʧ</div>
                      <div className={testData?.consonants.includes('ʤ') ? 'active' : ''}>ʤ</div>
                      <div className={testData?.consonants.includes('ɵ') ? 'active' : ''}>ɵ</div>
                      <div className={testData?.consonants.includes('ð') ? 'active' : ''}>ð</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Vowels</th>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.vowels.includes('iː') ? 'active' : ''}>iː</div>
                      <div className={testData?.vowels.includes('ɪ') ? 'active' : ''}>ɪ</div>
                      <div className={testData?.vowels.includes('ɛ') ? 'active' : ''}>ɛ</div>
                      <div className={testData?.vowels.includes('æ') ? 'active' : ''}>æ</div>
                      <div className={testData?.vowels.includes('ɔː') ? 'active' : ''}>ɔː</div>
                      <div className={testData?.vowels.includes('ʋ') ? 'active' : ''}>ʋ</div>
                      <div className={testData?.vowels.includes('uː') ? 'active' : ''}>uː</div>
                      <div className={testData?.vowels.includes('ʌ') ? 'active' : ''}>ʌ</div>
                      <div className={testData?.vowels.includes('ə') ? 'active' : ''}>ə</div>
                      <div className={testData?.vowels.includes('eɪ') ? 'active' : ''}>eɪ</div>
                      <div className={testData?.vowels.includes('oʋ') ? 'active' : ''}>oʋ</div>
                      <div className={testData?.vowels.includes('aɪ') ? 'active' : ''}>aɪ</div>
                      <div className={testData?.vowels.includes('aʋ') ? 'active' : ''}>aʋ</div>
                      <div className={testData?.vowels.includes('ɔɪ') ? 'active' : ''}>ɔɪ</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Clarity</th>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.clarity.includes('hard to understand') ? 'active' : ''}>hard to understand</div>
                      <div className={testData?.clarity.includes('average') ? 'active' : ''}>average</div>
                      <div className={testData?.clarity.includes('easy to understand') ? 'active' : ''}>easy to understand</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Intonation</th>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.intonation.includes('very Korean') ? 'active' : ''}>very Korean</div>
                      <div className={testData?.intonation.includes('a bit Korean') ? 'active' : ''}>a bit Korean</div>
                      <div className={testData?.intonation.includes('acceptable') ? 'active' : ''}>acceptable</div>
                      <div className={testData?.intonation.includes('near native') ? 'active' : ''}>near native</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Vocabulary</th>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.vocabulary.includes('very limited') ? 'active' : ''}>very limited</div>
                      <div className={
                        testData?.vocabulary.includes('limited') &&
                        !testData?.vocabulary.includes('very limited') ? 'active' : ''}
                      >
                        limited
                      </div>
                      <div className={
                        testData?.vocabulary.includes('average') &&
                        !testData?.vocabulary.includes('above average') ? 'active' : ''}
                      >
                        average
                      </div>
                      <div className={testData?.vocabulary.includes('above average') ? 'active' : ''}>above average</div>
                      <div className={testData?.vocabulary.includes('extensive') ? 'active' : ''}>extensive</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th rowSpan={6}>
                    Gramer <br />
                    Correct Usage:
                    <div className="n sp-mt-5">
                      ① Never <br />
                      ② Seldom <br />
                      ③ Sometimes <br />
                      ④ Usually <br />⑤ Always
                    </div>
                  </th>
                  <th className="n">Verbs tense</th>
                  <td>
                    <div className="ui-test-line">
                      {usage.map((item) => (
                        <div
                          key={item}
                          className={testData?.verbsTense.includes(item) ? 'active' : ''}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Agreement</th>
                  <td>
                    <div className="ui-test-line">
                      {usage.map((item) => (
                        <div
                          key={item}
                          className={testData?.agreement.includes(item) ? 'active' : ''}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Prepositions</th>
                  <td>
                    <div className="ui-test-line">
                      {usage.map((item) => (
                        <div
                          key={item}
                          className={testData?.prepositions.includes(item) ? 'active' : ''}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Articles</th>
                  <td>
                    <div className="ui-test-line">
                      {usage.map((item) => (
                        <div
                          key={item}
                          className={testData?.articles.includes(item) ? 'active' : ''}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Plurals</th>
                  <td>
                    <div className="ui-test-line">
                      {usage.map((item) => (
                        <div
                          key={item}
                          className={testData?.plurals.includes(item) ? 'active' : ''}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="n">Others</th>
                  <td>
                    <div className="ui-test-line">
                      {usage.map((item) => (
                        <div
                          key={item}
                          className={testData?.others.includes(item) ? 'active' : ''}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th colSpan={2}>Strong Point</th>
                  <td>{testData?.strongPoint}</td>
                </tr>
                <tr>
                  <th colSpan={2}>Weak Point</th>
                  <td>{testData?.weakPoint}</td>
                </tr>
                <tr>
                  <th colSpan={2}>
                    Comprehension <br />
                    How much does learner understand
                  </th>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.comprehension.includes('nothing') ? 'active' : ''}>almost nothing</div>
                      <div className={testData?.comprehension.includes('some') ? 'active' : ''}>some parts</div>
                      <div className={testData?.comprehension.includes('most') ? 'active' : ''}>most parts</div>
                      <div className={testData?.comprehension.includes('almost') ? 'active' : ''}>
                        almost <br /> everything
                      </div>
                      <div className={testData?.comprehension.includes('everything') ? 'active' : ''}>everything</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th colSpan={2}>Confidence</th>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.confidence.includes('completely') ? 'active' : ''}>
                        completely <br /> lacking
                      </div>
                      <div className={
                        testData?.confidence.includes('lacking') &&
                        !testData?.confidence.includes('completely lacking') ? 'active' : ''}
                      >
                        lacking
                      </div>
                      <div className={testData?.confidence.includes('average') ? 'active' : ''}>average</div>
                      <div className={testData?.confidence.includes('above') ? 'active' : ''}>above average</div>
                      <div className={testData?.confidence.includes('very') ? 'active' : ''}>very confident</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th colSpan={2}>Additional Comments</th>
                  <td>{testData?.comments}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ui-sub-title small has-bg sp-mt-10">
            <div className="title">
              <div className="tit-wrap">
                <div className="tit">Recommended Level</div>
              </div>
            </div>
          </div>

          <div className="ui-info-table th-left">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="ui-test-line">
                      <div className={testData?.recommendedLevels.includes('Pre') ? 'active' : ''}>Pre</div>
                      <div className={testData?.recommendedLevels.includes('300') ? 'active' : ''}>300</div>
                      <div className={testData?.recommendedLevels.includes('400') ? 'active' : ''}>400</div>
                      <div className={testData?.recommendedLevels.includes('500') ? 'active' : ''}>500</div>
                      <div className={testData?.recommendedLevels.includes('600') ? 'active' : ''}>600</div>
                      <div className={testData?.recommendedLevels.includes('700') ? 'active' : ''}>700</div>
                      <div className={testData?.recommendedLevels.includes('800') ? 'active' : ''}>800</div>
                      <div className={testData?.recommendedLevels.includes('900') ? 'active' : ''}>900</div>
                      <div>ETC.[{testData?.recommendedLevelEtc}]</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div>{JSON.stringify(memberTest)}</div> */}
    </div>
  );
};

export default PrintMemberTestModal;
