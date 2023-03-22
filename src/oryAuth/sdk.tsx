import { Configuration, V0alpha2Api } from '@ory/kratos-client';
import { resilience } from './resilience';
import Config from 'react-native-config';
import axiosFactory from 'axios';

const axios = axiosFactory.create();
resilience(axios); // Adds retry mechanism to axios

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = '') => url.replace(/\/+$/, '');

export const kratosUrl = (project: string = 'playground') => {
  const url =
    canonicalize('https://playground.projects.oryapis.com/api/kratos/public') ||
    '';

  if (url.indexOf('https://playground.projects.oryapis.com/') == -1) {
    // The URL is not from Ory, so let's just return it.
    return url;
  }

  // We handle a special case where we allow the project to be changed
  // if you use an ory project.
  return url.replace('playground.', `${project}.`);
};

export const newKratosSdk = () =>
  new V0alpha2Api(
    new Configuration({
      basePath: kratosUrl(Config.ORY_KRATOS_SLUG),
      accessToken: 'ory_pat_QCJR8k2udqG2ka7oAPurOwGp5qNwHMqy',
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
        withCredentials: true,
        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    kratosUrl(Config.ORY_KRATOS_SLUG),
    // Ensure that we are using the axios client with retry.
    // @ts-ignore
    axios,
  );
