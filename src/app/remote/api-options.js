import { api } from "./api";

const TAG = "[api-options]";

const getOptions = async (fields) => {
  console.log(TAG, `getOptions([GET]/options)`, "fields", fields);
  const res = await api.get(`/options`, { params: fields });
  return res.data;
};

export { getOptions };
