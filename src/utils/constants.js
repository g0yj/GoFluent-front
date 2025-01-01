// const isDev = process.env.NODE_ENV === "development";
const isDev = import.meta.env.MODE === "development";

const languageList = ["영어", "중국어", "일본어", "한국어"];

const courseList = ["PT", "TT", "GT"];

export { courseList, isDev, languageList };
