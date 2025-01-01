import axios from "axios";

const TAG = "[api-auth]";

// [POST]/login
const postLogin = async (data) => {
  console.log(TAG, `postLogin([POST]/login)`, "data", data);
  const res = await axios.post(`http://localhost:8080/api/admin/v1/login`, data, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
  });

  return res.data;
};

export { postLogin };
