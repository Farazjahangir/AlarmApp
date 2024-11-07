import axios from 'axios';

import {BASE_URL} from '../Constants/index';

const reqConfig = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosReq = axios.create(reqConfig);

export const processAxiosResponse = async (func: any) => {
  try {
    const response = await func;
    return response.data;
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      throw new Error('It seems your device is not connected to the internet');
    }

    const message = e?.response?.data?.message || 'Something went wrong';

    throw new Error(message);
  }
};

export default axiosReq;
