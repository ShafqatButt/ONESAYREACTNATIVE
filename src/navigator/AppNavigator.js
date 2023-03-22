// noinspection ES6CheckImport

import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef, DeviceEventEmitter} from 'react';
import {Platform, StatusBar, Linking, Alert} from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getData, saveData} from '../res/asyncStorageHelper';
import {ContextProvider} from '../context/Auth.context';
import {ReelProvider} from '../context/ReelContext';
import {TripsProvider} from '../context/TripsContext';
import {AppHeaderContextProvider} from '../components/AppHeaderContext';
import Video from 'react-native-video';
import SplashScreen from 'react-native-splash-screen';
import {QueryClient, QueryClientProvider} from 'react-query';
import Clipboard from '@react-native-community/clipboard';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import * as CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import {
  createNativeClipboardService,
  createNativeFileService,
  createNativeMediaService,
  createNativeNotificationService,
  useConnection,
} from '@sendbird/uikit-react-native/src';
import RNFBMessaging from '@react-native-firebase/messaging';
import Notifee, {
  IntervalTrigger,
  TriggerType,
  TimeUnit,
} from '@notifee/react-native';
import {SendbirdCalls, SoundType} from '@sendbird/calls-react-native';
import {setupCallKit, startRingingWithCallKit} from '../callHandler/ios';
import CallHistoryManager from '../libs/CallHistoryManager';
import AuthManager from '../libs/AuthManager';
import {
  setFirebaseMessageHandlers,
  setNotificationForegroundService,
  startRingingWithNotification,
} from '../callHandler/android';

import {SendbirdUIKitContainer} from '@sendbird/uikit-react-native/src';
import AsyncStorage from '@react-native-community/async-storage';
import {API_SERVER_KEY, APP_ID} from '../container/env';

import {navigationRef as stackNavigationRef} from '../libs/StaticNavigation';
import {navigationRef} from '../libs/navigation';
import {Network} from '../NetworkProvider';
import RecordingContainer from '../container/App/ReelCotainer/RecordingContainer';
import {
  onForegroundAndroid,
  onForegroundIOS,
  onBackgroundAndroid,
  onInitalNotificationAndroid,
} from '../libs/notification';
import {SetSendbirdSDK} from '../factory';
import {AppLogger} from '../utils/logger';
import {CALL_PERMISSIONS, usePermissions} from '../hooks/usePermissions';
import {useAuthContext, AuthProvider} from '../context/AuthContext';
import OryAuthContext from '../context/OryAuthContext';
import ChatNavigator from './navigators/ChatNavigator';
import {options, options_modal} from './navigators/utils';
import TabNavigator from './navigators/TabNavigator';
import AuthStackNavigator from './navigators/AuthStackNavigator';
import RNVoipPushNotification from 'react-native-voip-push-notification';
import TokenManager from '../libs/TokenManager';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {getSearchParamsFromURL} from '../uikit-app';
import {EventRegister} from 'react-native-event-listeners';
import {getrelamContactName} from '../commonAction';
import IncomingCall from 'react-native-incoming-call';
import ProfileNavigator from './navigators/ProfileNavigator';
import HubstackNavigator from './navigators/HubstackNavigator';
import {FCM_SEND} from '../api_helper/Api';
import AlertModalComponent from './Components/AlertModalComponent';
import DirectCallVideoCallingScreen from '../container/App/CallContainer/DirectCallVideoCallingScreen';
import DirectCallVoiceCallingScreen from '../container/App/CallContainer/DirectCallVideoCallingScreen';
import { DirectRoutes } from '../navigations/routes';
import Report from '../container/Report';
import Strings from '../string_key/Strings';


//import PushNotification from "react-native-push-notification";
// constants
const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

export const GetTranslucent = (state = true) => {
  Platform.OS === 'android' && StatusBar.setTranslucent(state);
  return Platform.select({ios: state, android: state});
};

export const FileService = createNativeFileService({
  imagePickerModule: ImagePicker,
  documentPickerModule: DocumentPicker,
  permissionModule: Permissions,
  fsModule: FileAccess,
  mediaLibraryModule: CameraRoll,
});
export const MediaService = createNativeMediaService({
  VideoComponent: Video,
  thumbnailModule: CreateThumbnail,
});
export const ClipboardService = createNativeClipboardService(Clipboard);
export const NotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
});
// Initialize of calls
SendbirdCalls.initialize(APP_ID);

// For iOS, use ringtoneSound of callkit
// if (Platform.OS === 'android') {
//   SendbirdCalls.addDirectCallSound(SoundType.RINGING, 'ringing.mp3');
// }
if (Platform.OS === 'ios') {
  SendbirdCalls.addDirectCallSound(SoundType.RINGING, 'ringing.mp3');
}
SendbirdCalls.addDirectCallSound(SoundType.DIALING, 'dialing.mp3');
SendbirdCalls.addDirectCallSound(SoundType.RECONNECTED, 'reconnected.mp3');
SendbirdCalls.addDirectCallSound(SoundType.RECONNECTING, 'reconnecting.mp3');
// SendbirdCalls.setDirectCallDialingSoundOnWhenSilentOrVibrateMode(true);

if (Platform.OS === 'android') {
  setFirebaseMessageHandlers();
  setNotificationForegroundService();
}
// Setup ios callkit
if (Platform.OS === 'ios') {
  console.log('setup call ==');
  setupCallKit();
}

const channelId = 'onesay';
Notifee.createChannel({id: channelId, name: 'onesay', importance: 4});

const trigger: IntervalTrigger = {
  type: TriggerType.INTERVAL,
  interval: 1000,
  timeUnit: TimeUnit.MINUTES,
};

// Setup onRinging
SendbirdCalls.setListener({
  onRinging: async call => {
    console.log('test');
    const directCall = await SendbirdCalls.getDirectCall(call.callId);
    if (!SendbirdCalls.currentUser) {
      const credential = await AuthManager.getSavedCredential();
      if (credential) {
        // Authenticate before accept
        console.log('Authenticate before accept');
        await SendbirdCalls.authenticate(credential);
      } else {
        // Invalid user call
        return directCall.end();
      }
    }

    const unsubscribe = directCall.addListener({
      async onEnded({callId, callLog}) {
        AppLogger.info('[onRinging/onEnded] add to call history manager');
        if (callLog?.endResult == 'CANCELED') {
          let call_history = [];
          getData(
            'call_history',
            success => {
              if (
                success == null ||
                success == 'null' ||
                success == undefined
              ) {
                call_history.push(callLog);
                saveData(call_history);
                saveData('call_history', call_history);
              } else {
                call_history = success;
                call_history.push(callLog);
                saveData('call_history', call_history);
              }
            },
            failure => {},
          );

          Notifee.setBadgeCount(call_history?.length).then(() =>
            console.log('Badge count set!'),
          );

          if (Platform.OS == 'android') {
            await Notifee.displayNotification({
              id: Math.random() + '',
              title: Strings.missed_call,
              body: `${getrelamContactName(callLog.caller?.metaData.phone)}`,
              data: {
                title: 'Missed Call',
                body: `${getrelamContactName(callLog.caller?.metaData.phone)}`,
              },
              android: {
                channelId,
                importance: 4,
                circularLargeIcon: true,
                pressAction: {id: 'default'},
                showTimestamp: true,
              },
            });
          }

          // RNFBMessaging()
          //   .getToken()
          //   .then(async val => {
          //     const messageNotification = {
          //       registration_ids: [val],
          //       notification: {
          //         title: 'Missed Call',
          //         body: `${getrelamContactName(
          //           callLog.caller?.metaData.phone,
          //         )}`,
          //       },
          //       data: {
          //         title: 'Missed Call',
          //         body: `${getrelamContactName(
          //           callLog.caller?.metaData.phone,
          //         )}`,
          //       },
          //     };

          //     let headers = new Headers({
          //       'Content-Type': 'application/json',
          //       Authorization: 'key=' + API_SERVER_KEY,
          //     });

          //     let response = await fetch(FCM_SEND, {
          //       method: 'POST',
          //       headers,
          //       body: JSON.stringify(messageNotification),
          //     });
          //     response = await response.json();
          //   });
        }

        callLog && CallHistoryManager.add(callId, callLog);
        unsubscribe();
      },
    });

    // Show interaction UI (Accept/Decline)
    if (Platform.OS === 'android') {
      await startRingingWithNotification(call);
    }
    if (Platform.OS === 'ios') {
      await startRingingWithCallKit(call);
    }
  },
});

export default AppNavigator = () => {
  usePermissions(CALL_PERMISSIONS);

  /**
   * The flow initiated after clicking on the deep link (invite link)
   * @param url
   * @returns {Promise<void>}
   */
  const handleChannelInvite = async url => {
    console.log('the url', url);
    if (typeof url !== 'string') {
      return;
    }

    const resolvedLink: string = await dynamicLinks()
      .resolveLink(url)
      .then(resolved => resolved);
    console.log('the resolvedLink', resolvedLink.url);

    if (
      typeof resolvedLink?.url !== 'string' &&
      !resolvedLink?.url.includes('http')
    ) {
      return;
    }
    console.log('the resolvedLink pass', resolvedLink.url);

    let _params = getSearchParamsFromURL(resolvedLink?.url);
    _params = {
      ..._params,
      channelName: _params?.channelName?.replace('+', ' '),
    };

    setTimeout(() => EventRegister.emit('dl_channel_invite', _params), 1500);
  };

  const onIncoming = async () => {
    if (Platform.OS === 'android') {
      /**
       * App open from killed state (headless mode)
       */
      const payload = await IncomingCall.getExtrasFromHeadlessMode();
      console.log('launchParameters', payload);
      if (payload) {
        // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
      }

      /**
       * App in foreground / background: listen to call events and determine what to do next
       */
      DeviceEventEmitter.addListener('endCall', payload => {
        // End call action here
      });
      DeviceEventEmitter.addListener('answerCall', payload => {
        // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
      });
    }
  };

  // Listen to cancel and answer call events
  useEffect(() => {
    onIncoming();
  }, []);

  useEffect(() => {
    const handleUrl = ({url}) => {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          console.log('Hello deep link 123=> ', url);
          // DeepLinking.evaluateUrl(url);
          handleChannelInvite(url).then();
        }
      });
    };
    // if (Platform.OS !== 'android') {
    addRoutesToDeepLinking();
    // Linking.getInitialURL(url => {
    //   console.log('Hello deep link (getInitialURL) => ', url);
    // });
    Linking.addEventListener('url', handleUrl);
    // }
    return () => {
      // if (Platform.OS !== 'android') {
      Linking.removeEventListener('url', handleUrl);
      // }
    };
  }, []);

  function addRoutesToDeepLinking() {
    DeepLinking.addScheme('https://');
    // https://trivacall.page.link/referral/DD3zJ1nLZc2sSPU17
    DeepLinking.addRoute('/buzzmi.page.link/referral', response => {
      console.log('Hello deep link 321 => ', response);
      // navigate('upcoming');
    });

    // DeepLinking.addRoute('/testurl.com/#/main/upcoming', response => {
    //   navigate('upcoming');
    // });
  }

  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
      chatOptions={{
        localCacheStorage: AsyncStorage,
        onInitialized: SetSendbirdSDK,
        enableAutoPushTokenRegistration: true,
        enableChannelListTypingIndicator: true,
        enableChannelListMessageReceiptStatus: true,
      }}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
        media: MediaService,
      }}
      styles={{
        defaultHeaderTitleAlign: 'left', //'center',
      }}>
      <Navigations />
    </SendbirdUIKitContainer>
  );
};

const registerToken = async () => {
  if (Platform.OS === 'ios') {
    RNVoipPushNotification.addEventListener('register', async voipToken => {
      await Promise.all([
        SendbirdCalls.ios_registerVoIPPushToken(voipToken, true),
        TokenManager.set({
          value: voipToken,
          type: 'voip',
        }),
      ]);
      RNVoipPushNotification.removeEventListener('register');
      console.log('Ios registered token:', TokenManager.token);
      AppLogger.info('Ios registered token:', TokenManager.token);
    });
    RNVoipPushNotification.registerVoipToken();
  }
};

const authenticate = async value => {
  const user = await SendbirdCalls.authenticate(value);
  await AuthManager.authenticate(value);
  return user;
};

const Navigations = () => {
  const {connect} = useConnection();
  const {setCurrentUser} = useAuthContext();
  const multipleNavigationRef = useRef(null);
  const [initialPageName, setInitialPageName] = useState('');

  useEffect(
    function () {
      stackNavigationRef.current = multipleNavigationRef.current;
      navigationRef.current = multipleNavigationRef.current;
    },
    [multipleNavigationRef.current],
  );

  useEffect(() => {
    Notifee.setBadgeCount(0);
    const unsubscribes = [
      onInitalNotificationAndroid(),
      onForegroundAndroid(),
      onForegroundIOS(),
      onBackgroundAndroid(),
    ];
    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    getData(
      'fontSize',
      async success => {
        if (success != null) {
          global.fontSize = success;
        } else {
          global.fontSize = 'm';
        }
      },
      failure => {
        global.fontSize = 'm';
      },
    );

    AsyncStorage.getItem('selected-language').then(value => {
      if (value) {
        Strings.setLanguage("en");
        AsyncStorage.setItem('selected-language', "en");
      } else {
        Strings.setLanguage('en');
        AsyncStorage.setItem('selected-language', "en");
      }
    });

    getData(
      'userDetails',
      async success => {
        if (success != null) {
          const user = await authenticate({userId: success?.userId});
          setCurrentUser(user);
          registerToken();
        }
        success != null &&
          connect(success.userId)
            .then(user => {})
            .catch(err => {});
        setInitialPageName(success == null ? 'Auth' : 'Tab');
      },
      failure => {
        setInitialPageName('Auth');
      },
    );
  }, []);

  return initialPageName === '' ? null : (
    <>
      <Network />
      <OryAuthContext>
        <ContextProvider>
          <TripsProvider>
            <ReelProvider>
              <AppHeaderContextProvider>
                <AuthProvider>
                  <QueryClientProvider client={queryClient}>
                    <NavigationContainer ref={multipleNavigationRef}>
                      <Stack.Navigator initialRouteName={initialPageName}>
                        <Stack.Screen
                          name={'Auth'}
                          component={AuthStackNavigator}
                          options={options}
                        />
                        <Stack.Screen
                          name={'Tab'}
                          component={TabNavigator}
                          options={options}
                        />

                        <Stack.Screen
                          name={'Recording'}
                          options={options}
                          component={RecordingContainer}
                        />

                        <Stack.Screen
                          name={'CreatePost'}
                          options={options}
                          component={CreatePost}
                        />
                        <Stack.Screen name={'EditPost'} options={options} component={EditPost} />

<Stack.Group screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen
          name={DirectRoutes.VIDEO_CALLING}
          component={DirectCallVideoCallingScreen}
        />
        <Stack.Screen
          name={DirectRoutes.VOICE_CALLING}
          component={DirectCallVoiceCallingScreen}
        />
      </Stack.Group>

                        {/* <Stack.Screen
                        name={'CreatePost'}
                        options={options}
                        // component={CreatePost}
                        component={() => null}
                      /> */}

                        {/* <Stack.Screen
                      name={'ProfileNav'}
                      component={ProfileNavigator}
                      options={options}
                    /> */}
                        {/* <Stack.Screen
                      name={'MarketPlaceNav'}
                      component={HubstackNavigator}
                      options={options}
                    /> */}

                        <Stack.Screen
                          name={'chat'}
                          component={ChatNavigator}
                          options={options}
                        />
                        <Stack.Screen
                          name={'Report'}
                          component={Report}
                          options={options}
                        />

                        {/* <Stack.Screen
                          name={'PostViewer'}
                          options={options}
                          component={PostFileViewer}
                        /> */}

                        <Stack.Screen
                          name={'alert_modal'}
                          component={AlertModalComponent}
                          options={{
                            animation: 'fade',
                            headerShown: false,
                            cardOverlayEnabled: true,
                            animationTypeForReplace: 'pop',
                            presentation: 'transparentModal',
                          }}
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </QueryClientProvider>
                </AuthProvider>
              </AppHeaderContextProvider>
            </ReelProvider>
          </TripsProvider>
        </ContextProvider>
      </OryAuthContext>
    </>
  );
};
