import axios from 'axios';
import { APP_CONFIG } from '@/configs';

const instance = axios.create();

instance.defaults.baseURL = APP_CONFIG.apiUrl;
instance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      const { status } = error.response;

      /**
       * The request was made and the server responded with a status code
       * that falls out of the range of 2xx
       *
       * Do something with response error
       * 401 mean not authorized or token expired, should login again
       */
      if (status === 401) {
        // TODO: handle this case
      }

      if (error.config.errorHandling) {
        const { message } = error.response.data;

        if (message && error.config.errorMessageHandling) {
          console.log(message);
        }
      }

      const response = {
        ...error.response.data,
        status_code: error.response.status,
      };

      return Promise.reject(response);
    }

    if (error.request) {
      /**
       * The request was made but no response was received
       * `error.request` is an instance of XMLHttpRequest in the browser and an instance of
       * http.ClientRequest in node.js
       */
      console.log(error.request);
    }

    // Something happened in setting up the request that triggered an Error
    console.log(error.message);

    return Promise.reject(error);
  },
);

export default instance;

