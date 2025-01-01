import { getSchedules } from "../remote/api-schedule";

const ServiceSchedules = {
  getSchedules: async (params) => {
    return await getSchedules(params);
  },
};

export default ServiceSchedules;
