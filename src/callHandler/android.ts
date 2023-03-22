import Notifee, {AndroidImportance} from '@notifee/react-native';
import {Event, EventType} from '@notifee/react-native/src/types/Notification';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import {
  DirectCallProperties,
  SendbirdCalls,
} from '@sendbird/calls-react-native';
import {getrelamContactName} from '../commonAction';

import {RunAfterAppReady} from '../libs/StaticNavigation';
import {DirectRouteWithParams, DirectRoutes} from '../navigations/routes';
import {AppLogger} from '../utils/logger';
import {
  DeviceEventEmitter,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import IncomingCall from 'react-native-incoming-call';
import {CALL_PERMISSIONS, usePermissions} from '../hooks/usePermissions';
import nativePermissionGranted from '@sendbird/uikit-react-native/src/utils/nativePermissionGranted';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import AuthManager from '../libs/AuthManager';
import {Routes, navigationRef, runAfterAppReady} from '../libs/navigation';
import {removeData} from '../res/asyncStorageHelper';
import {
  isSendbirdNotification,
  parseSendbirdNotification,
  getFileExtension,
  getFileType,
} from '@sendbird/uikit-utils';
import Strings from '../string_key/Strings';

/** Firebase RemoteMessage handler **/
export function setFirebaseMessageHandlers() {
  const firebaseListener = async (
    message: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    SendbirdCalls.android_handleFirebaseMessageData(message.data);
  };
  messaging().setBackgroundMessageHandler(firebaseListener);
  messaging().onMessage(firebaseListener);
}

/** Notifee ForegroundService with Notification */
export const NOTIFICATION_CHANNEL_ID = 'sendbird.calls.rn.ringing';
export async function setNotificationForegroundService() {
  console.log("it's coming Here");
  // Create channel
  await Notifee.createChannel({
    name: 'Ringing',
    id: NOTIFICATION_CHANNEL_ID,
    importance: AndroidImportance.HIGH,
  });

  // Register foreground service, NOOP
  Notifee.registerForegroundService(
    async notification => new Promise(() => notification),
  );

  // Register notification listeners
  const onNotificationAction = async ({type, detail}: Event) => {
    console.log('detail called');
    console.log(detail);

    if (
      type === EventType.PRESS &&
      detail.notification &&
      detail.notification.title == 'Missed Call'
    ) {
      removeData('call_history');
      navigationRef.navigate('CallHistory');
    } else if (
      type === EventType.PRESS &&
      detail.notification &&
      isSendbirdNotification(detail.notification.data)
    ) {
      const sendbird = parseSendbirdNotification(detail.notification.data);
      console.log('nots data', detail.notification.data, navigationRef);

      runAfterAppReady(async (sdk, actions) => {
        console.log('running after app ready');

        if (Routes.Home === navigationRef.getCurrentRoute()?.name) {
          actions.push(Routes.GroupChannelTabs, undefined);
        }
        const channel = await sdk.GroupChannel.getChannel(
          sendbird.channel.channel_url,
        );
        if (channel)
          actions.navigate(Routes.GroupChannel, {
            serializedChannel: channel.serialize(),
          });
      });
    }

    // if (type !== EventType.ACTION_PRESS || !detail.notification?.data?.call) {
    //   return;
    // }
    // const callString = detail.notification.data.call;
    // const callProps: DirectCallProperties = JSON.parse(callString);
    // const directCall = await SendbirdCalls.getDirectCall(callProps.callId);
    // if (directCall.isEnded) {
    //   AppLogger.warn('Call is already ended:', directCall.callId);
    //   IncomingCall.dismiss()
    //   return Notifee.stopForegroundService();
    // }
    // if (detail.pressAction?.id === 'accept') {
    //   AppLogger.info('[CALL START]', directCall.callId);
    //   RunAfterAppReady<DirectRoutes, DirectRouteWithParams>((navigation) => {
    //     if (directCall.isVideoCall) {
    //       navigation.navigate(DirectRoutes.VIDEO_CALLING, { callId: directCall.callId });
    //     } else {
    //       navigation.navigate(DirectRoutes.VOICE_CALLING, { callId: directCall.callId });
    //     }
    //     directCall.accept();
    //   });
    // } else if (detail.pressAction?.id === 'decline') {
    //   AppLogger.warn('[CALL END]', directCall.callId);
    //   await directCall.end();
    // }
  };

  Notifee.onBackgroundEvent(onNotificationAction);
  Notifee.onForegroundEvent(onNotificationAction);
}

// const checkAndRequest = async () => {
// };

export async function startRingingWithNotification(call: DirectCallProperties) {
  console.log(call);
  const directCall = await SendbirdCalls.getDirectCall(call.callId);
  const callType = call.isVideoCall ? 'Video' : 'Voice';

  // Accept only one ongoing call
  const onGoingCalls = await SendbirdCalls.getOngoingCalls();
  if (onGoingCalls.length > 1) {
    AppLogger.warn('Ongoing calls:', onGoingCalls.length);
    return directCall.end();
  }

  // Display incoming call activity.
  IncomingCall.display(
    call.callId, // Call UUID v4
    `${getrelamContactName(call.remoteUser?.metaData.phone) ?? 'Unknown'}`,
    call?.caller?.profileUrl || null, // Avatar URL
    'Incomming Call', // Info text
    30000,
    'ringing.mp3',
  );

  // Listen to headless action events
  DeviceEventEmitter.addListener('endCall', async payload => {
    const directCall = await SendbirdCalls.getDirectCall(payload.uuid);
    AppLogger.warn('[CALL END]', directCall.callId);
    await directCall.end();
    // End call action here
  });
  DeviceEventEmitter.addListener('answerCall', async payload => {
    console.log('answerCall', payload);

    if (payload.isHeadless) {
      // Called from killed state
      IncomingCall.openAppFromHeadlessMode(payload.uuid);

      setTimeout(async () => {
        const directCall = await SendbirdCalls.getDirectCall(payload.uuid);

        const requestResult = await Permissions.requestMultiple(
          CALL_PERMISSIONS,
        );
        const isGranted = nativePermissionGranted(requestResult);
        if (isGranted) {
          AppLogger.info('[CALL START]', payload.uuid);
          RunAfterAppReady<DirectRoutes, DirectRouteWithParams>(navigation => {
            if (directCall.isVideoCall) {
              navigation.navigate(DirectRoutes.VIDEO_CALLING, {
                callId: directCall.callId,
              });
            } else {
              navigation.navigate(DirectRoutes.VOICE_CALLING, {
                callId: directCall.callId,
              });
            }
            directCall.accept();
          });
        } else {
          Alert.alert(
            Strings.Insufficient_permissions,
            Strings.to_answer_allow_buzzmi_access,
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: async () => {
                  await directCall.end();
                },
              },
              {
                text: 'Okay',
                onPress: async () => {
                  await directCall.end();
                  Linking.openSettings();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }, 1500);
    } else {
      // Called from background state
      IncomingCall.backToForeground();
      const directCall = await SendbirdCalls.getDirectCall(payload.uuid);

      const requestResult = await Permissions.requestMultiple(CALL_PERMISSIONS);
      const isGranted = nativePermissionGranted(requestResult);
      if (isGranted) {
        AppLogger.info('[CALL START]', payload.uuid);
        RunAfterAppReady<DirectRoutes, DirectRouteWithParams>(navigation => {
          if (directCall.isVideoCall) {
            navigation.navigate(DirectRoutes.VIDEO_CALLING, {
              callId: directCall.callId,
            });
          } else {
            navigation.navigate(DirectRoutes.VOICE_CALLING, {
              callId: directCall.callId,
            });
          }
          directCall.accept();
        });
      } else {
        Alert.alert(
          Strings.Insufficient_permissions,

          Strings.to_call_allow_buzzmi_access,
          [
            {
              text: Strings.Cancel,
              style: 'cancel',
              onPress: async () => {
                await directCall.end();
              },
            },
            {
              text: Strings.okay,
              onPress: async () => {
                await directCall.end();
                Linking.openSettings();
              },
            },
          ],
          {cancelable: false},
        );
      }
    }
  });

  const unsubscribe = directCall.addListener({
    // Update notification on established
    // onEstablished() {
    //   return IncomingCall.display(
    //     call.callId, // Call UUID v4
    //     `${getrelamContactName(call.remoteUser?.metaData.phone) ?? "Unknown"}`,
    //     call?.caller?.profileUrl || null, // Avatar URL
    //     'Incomming Call', // Info text
    //     20000 // Timeout for end call after 20s
    //   );

    //   // Notifee.displayNotification({
    //   //   id: call.callId,
    //   //   title: `${callType} Call with ${getrelamContactName(directCall.remoteUser?.metaData.phone) ?? 'Unknown'}`,
    //   //   data: { call: JSON.stringify(call) },
    //   //   android: {
    //   //     asForegroundService: true,
    //   //     channelId: NOTIFICATION_CHANNEL_ID,
    //   //     actions: [{ title: 'End', pressAction: { id: 'decline' } }],
    //   //     timestamp: Date.now(),
    //   //     showTimestamp: true,
    //   //     showChronometer: true,
    //   //   },
    //   // });
    // },
    // Remove notification on ended
    onEnded() {
      IncomingCall.dismiss();
      Notifee.stopForegroundService();
      unsubscribe();
    },
  });
}
