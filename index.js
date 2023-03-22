// noinspection ES6CheckImport

import React from 'react';

/**
 * https://github.com/facebook/react-native/issues/23922
 */
import 'react-native-url-polyfill/auto';

import {Text, View, LogBox, TextInput, AppRegistry} from 'react-native';
// import App from './app/navigator/AppNavigator';
import App from './src/navigator/AppNavigator';
import {name as appName} from './app.json';
import Config from 'react-native-config';
// import './app/callHandler/android';
// import './app/libs/notification';

import './src/callHandler/android';
import './src/libs/notification';

import * as Sentry from '@sentry/react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import AddOperatorsButton from './app/uikit-app/components/AddOperatorsButton';
import EmojiBoard from 'react-native-emoji-board';

import AddOperatorsButton from './src/uikit-app/components/AddOperatorsButton';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

GoogleSignin.configure({
  scopes: ['email'],
  offlineAccess: true,
  webClientId: Config.WEB_CLIENT_ID,
});

Sentry.init({
  dsn: Config.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

function HeadlessCheck({isHeadless}) {
  console.log('before headless');
  if (isHeadless) {
    return null;
  }
  console.log('after headless');

  return <App />;
}

const _App = () => {
  const [show, setShow] = React.useState(false);
  const onClick = emoji => {
    console.log(emoji);
  };
  return (
    <View
      style={{
        flex: 1,
        borderTopWidth: 50,
      }}>
      <TextInput value={'Hi!'} />
      <AddOperatorsButton onPress={() => setShow(prevState => !prevState)} />
      <EmojiBoard showBoard={show} onClick={onClick} />
    </View>
  );
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
