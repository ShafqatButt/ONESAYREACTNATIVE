// A small which adds retries to axios

import {AxiosInstance} from 'axios';
import * as Sentry from '@sentry/react-native';
import {handleLink} from '../api_helper/Api';

export const resilience = (axios: AxiosInstance) => {
  axios.interceptors.response.use(
    v => Promise.resolve(v),
    error => {
      if (!error.config) {
        console.error('Received network error without axios details', error);
        Sentry.captureException(error);
        return Promise.reject(error);
      }

      if (
        error.response &&
        (error.response.status == 400 ||
          error.response.status == 401 ||
          error.response.status == 403)
      ) {
        console.debug(
          'Network request failed but this is ok',
          error.response.status,
          {
            config: error.config,
            error,
          },
        );
        Sentry.captureException(error);
        return Promise.reject(error);
      }

      if (
        error.response &&
        (error.response.status >= 400 || error.response.status < 500)
      ) {
        // 4xx status means we should not retry.
        Sentry.captureException(error);

        if (
          error.response?.data?.error?.code === 422 &&
          error.response?.data?.error?.id === 'browser_location_change_required'
        ) {
          const {id} = error.response?.data?.error;
          const {redirect_browser_to} = error.response?.data;
          console.log('error.config => ', error.response?.data);
          console.log('error => ', error);
          console.log('error.response?.data?.id => ', redirect_browser_to);
          // handleLink(redirect_browser_to, response => {
          //   console.log('Social login (response) => ', response);
          // });
          return Promise.resolve(redirect_browser_to);
        }

        console.error('Network request failed', {config: error.config, error});
        return Promise.reject(error);
      }
    },
  );
};
