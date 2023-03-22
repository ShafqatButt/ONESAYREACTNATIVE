// noinspection ES6CheckImport

import {Alert} from 'react-native';
import {removeData} from '../res/asyncStorageHelper';
import enJson from '../string_key/en.json';
import realm from '../realmStore';
import TokenManager from '../libs/TokenManager';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import Strings from '../string_key/Strings';
import cheerio from 'react-native-cheerio';
export const unregisterToken = async () => {
  const token = await TokenManager.get();
  console.log(token);
  if (token) {
    switch (token.type) {
      case 'apns':
      case 'fcm': {
        await SendbirdCalls.unregisterPushToken(token.value);
        break;
      }
      case 'voip': {
        await SendbirdCalls.ios_unregisterVoIPPushToken(token.value);
        break;
      }
    }
    await TokenManager.set(null);
  }
};

// Common Logout button
export const Logout = (props, logout, actionClearData) => {
  Alert.alert(
    'Buzzmi',
    Strings.are_you_sure_logout,
    [
      {
        text: Strings.no,
        style: 'cancel',
      },
      {
        text: Strings.yes,
        onPress: () => {
          if (actionClearData) {
            actionClearData();
          }
          removeData('userDetails');
          removeData('company_id');
          logout();

          setTimeout(() => {
            props.navigation.replace('Auth', {wasLoggedIN: true});
          }, 150);
        },
      },
    ],
    {cancelable: false},
  );
};

export const ConfirmationDialog = (props, operation) => {
  Alert.alert(
    props.title,
    props.subtitle,
    [
      {
        text: Strings.Cancel,
        style: 'cancel',
      },
      {
        text: props.yesText,
        onPress: () => {
          operation();
        },
      },
    ],
    {cancelable: false},
  );
};

export const getLanguageValueFromKey = key => {
  let index = enJson.findIndex(l => l.key === key);
  if (index > -1) {
    return enJson[index].value;
  } else {
    return key;
  }
};

export const getrelamContactName = number => {
  if (number === 'Group' || number === 'Channel') {
    return number === 'Group' ? 'Group' : 'Channel';
  }

  const _contacts = JSON.parse(
    JSON.stringify(
      realm.objects('Contact').filtered('phoneNumber == $0', number),
    ),
  );

  return _contacts?.length > 0 ? _contacts[0].value : number;
};

export const readHtml = d => {
  const $ = cheerio.load(`<html><body>${d}</body></html>`);
  return $('body').text();
};
