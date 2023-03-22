import md5 from 'crypto-js/md5';
import {APP_ID} from '../container/env';
import {serviceID, apiVersion, BASE_URL, hash_key, ACCESS_TOKEN} from './Api';
import {resilience} from './resilience';
import axiosFactory from 'axios';
import {Alert} from 'react-native';
const axios = axiosFactory.create();
resilience(axios); // Adds retry mechanism to axios

export const getHeader = deviceID => {
  let objHeader = {
    accept: 'application/json',
    // 'service-id': serviceID,
    // apiVersion: apiVersion,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  // deviceID != null && (objHeader['d-id'] = deviceID);
  return objHeader;
};

export const getAuthHeader = token => {
  
  let objHeader = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    // hash: md5(deviceID + hash_key).toString(),
  };

  if (token.includes('social-')) {
    objHeader = {
      ...objHeader,
      Authorization: `Bearer ${token.split('social-')[1]}`,
    };
  } else if (token.includes('Bearer')){
    objHeader = {
      ...objHeader,
      Authorization: `${token}`,
    };
  } else {
    objHeader = {
      ...objHeader,
      'X-Session-Token': token,
    };
  }

  return objHeader;
};

export const getMultipartAuthHeader = token => {
  let objHeader = {
    accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  };

  if (token.includes('social-')) {
    objHeader = {
      ...objHeader,
      Authorization: `Bearer ${token.split('social-')[1]}`,
    };
  } else {
    objHeader = {
      ...objHeader,
      'X-Session-Token': token,
    };
  }
  return objHeader;
};

export const POST = async (
  url,
  is_auth,
  token,
  device_id,
  postData,
  callBack,
) => {
  axios
    .post(url.includes('http') ? url : `${BASE_URL}` + url, postData, {
      headers: is_auth ? getAuthHeader(token) : getHeader(device_id),
    })
    .then(response => {
      if (url.includes('http')) {
        callBack(response, false);
      } else {
        callBack(response.data, false);
      }
    })
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message, true);
      } else {
        // callBack(new Error(err?.message), true);
        callBack(err?.message, true);
      }
    });
};

export const PATCH = async (url, token, device_id, postData, callBack) => {
  axios
    .patch(`${BASE_URL}` + url, postData, {
      headers: getAuthHeader(token),
    })
    .then(response => callBack(response.data, false))
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message, true);
      } else {
        callBack(err?.message, true);
      }
    });
};

export const GET = async (url, token, device_id) => {
  return await axios.get(url.includes('http') ? url : `${BASE_URL}` + url, {
    headers: url.includes('http') ? getHeader(device_id) : getAuthHeader(token),
  });
};

export const DELETE = async (url, token, device_id) => {
  return await axios.delete(url.includes('http') ? url : `${BASE_URL}` + url, {
    headers: url.includes('http') ? getHeader(device_id) : getAuthHeader(token),
  });
};

export const AxiosGET = async (url, configs) => await axios.get(url, configs);

export const GET_DATA = async (url, is_auth, token, device_id, callBack) => {
  axios
    .get(`${BASE_URL}` + url, {
      headers: is_auth ? getAuthHeader(token) : getHeader(device_id),
    })
    .then(response => {
      let responseData = response.data;
      callBack(responseData);
    })
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(
          Object.assign(
            {message: err?.response?.data.message},
            {status: err?.response?.status},
          ),
        );
      } else {
        callBack(new Error(err?.message));
      }
    });
};

export const PUT_SENDBIRD = async (channel_url, userid, callBack) => {
  axios
    .put(
      `https://api-${APP_ID}.sendbird.com/v3/group_channels/${channel_url}/join`,
      {
        user_id: userid,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          'Api-Token': ACCESS_TOKEN,
        },
      },
    )
    .then(response => {
      let responseData = response.data;
      callBack(responseData);
    })
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message);
      } else {
        callBack(new Error(err?.message));
      }
    });
};

export const GET_SENDBIRD = async (get_url, callBack) => {
  axios
    .get(get_url, {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        'Api-Token': ACCESS_TOKEN,
      },
    })
    .then(response => {
      let responseData = response.data;
      callBack(responseData);
    })
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message);
      } else {
        callBack(new Error(err?.message));
      }
    });
};

export const POST_SENDBIRD = async (get_url, body_json, callBack) => {
  axios
    .post(get_url, body_json, {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        'Api-Token': ACCESS_TOKEN,
      },
    })
    .then(response => {
      let responseData = response.data;
      callBack(responseData);
    })
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message);
      } else {
        callBack(new Error(err?.message));
      }
    });
};

export const DELETE_SENDBIRD = async (get_url, callBack) => {
  axios
    .delete(get_url, {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        'Api-Token': ACCESS_TOKEN,
      },
    })
    .then(response => {
      let responseData = response.data;
      callBack(responseData);
    })
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message);
      } else {
        callBack(new Error(err?.message));
      }
    });
};

export const POST_MULTIPART = async (url, token, postData, callBack) => {
  axios
    .post(`${BASE_URL}` + url, postData, {
      headers: getMultipartAuthHeader(token),
    })
    .then(response => callBack(response.data, false))
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message, true);
      } else {
        callBack(err?.message, true);
      }
    });
};

export const PUT_MULTIPART = async (url, token, postData, callBack) => {
  axios
    .put(`${BASE_URL}` + url, postData, {
      headers: getAuthHeader(token),
    })
    .then(response => callBack(response.data, false))
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message, true);
      } else {
        callBack(err?.message, true);
      }
    });
};

export const POST_DATA = async (url, token, postData, callBack) => {
  // console.log(getAuthHeader(token))
  axios
    .post(`${BASE_URL}` + url, postData, {
      headers: getAuthHeader(token),
    })
    .then(response => callBack(response.data, false))
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message, true);
        Alert.alert(err?.response?.data.message);
      } else {
        callBack(err?.message, true);
        Alert.alert(err?.message);
      }
    });
};

export const DELETE_DATA = async (url, token, callBack) => {
  //console.log(getAuthHeader(token))
  axios
    .delete(`${BASE_URL}` + url, {
      headers: getAuthHeader(token),
    })
    .then(response => callBack(response.data, false))
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message, true);
        Alert.alert(err?.response?.data.message);
      } else {
        callBack(err?.message, true);
        Alert.alert(err?.message);
      }
    });
};

export const DELETE_USER_ACCOUNT = async (url, user_body, token, callBack) => {
  console.log(getAuthHeader(token));

  console.log(user_body);
  axios
    .delete(`${BASE_URL}` + url, {
      headers: getAuthHeader(token),
      data: user_body,
    })
    .then(response => callBack(response.data, false))
    .catch(err => {
      if (err?.response?.status == 401 || err?.response?.status == 400) {
        callBack(err?.response?.data.message, true);
      } else {
        callBack(err?.message, true);
      }
    });
};
