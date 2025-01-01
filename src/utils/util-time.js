import dayjs from "dayjs";

const UtilTime = {
  dateToString: (date) => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  },
  stringToDate: (dateStr) => {
    // "2024-03-02T12:11:03"
    return dayjs(dateStr).toDate();
  },
};

export default UtilTime;
