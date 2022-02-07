import axios, { Method } from 'axios';

const api = async (
  // authToken: string,
  method: Method,
  url: string,
  data?: any,
  params?: any,
) => {
  try {
    const result = await axios({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Authorization: `Bearer ${authToken}`,
      },
      params,
      data,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export default {
  get: (
    // authToken: string,
    url: string,
    data?: any,
    params?: any,
  ) => api(/* authToken, */ 'GET', url, data, params),
  post: (
    // authToken: string,
    url: string,
    data?: any,
    params?: any,
  ) => api(/* authToken, */ 'POST', url, data, params),
  put: (
    // authToken: string,
    url: string,
    data?: any,
    params?: any,
  ) => api(/* authToken, */ 'PUT', url, data, params),
  delete: (
    // authToken: string,
    url: string,
    data?: any,
    params?: any,
  ) => api(/* authToken, */ 'DELETE', url, data, params),
};
