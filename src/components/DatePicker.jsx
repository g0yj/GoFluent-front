import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import DatePickerReact from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = (props) => {
  const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  return (
    <DatePickerReact
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flexCenter gap-10" style={{ margin: "0 10px" }}>
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            <i className="fa-solid fa-chevron-left txt-grey600"></i>
          </button>

          <div className="flexCenter gap">
            <button className="ui-select">
              <select
                className="input-init"
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(value)}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}년
                  </option>
                ))}
              </select>
            </button>
            <button className="ui-select">
              <select
                className="input-init"
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </button>
          </div>

          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            <i className="fa-solid fa-chevron-right txt-grey600"></i>
          </button>
        </div>
      )}
      {...props}
      dateFormat="yyyy-MM-dd"
    />
  );
};

export default DatePicker;
