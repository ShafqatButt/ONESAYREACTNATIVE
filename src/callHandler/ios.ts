import RNCallKeep from 'react-native-callkeep';

import {
  DirectCallProperties,
  SendbirdCalls,
} from '@sendbird/calls-react-native';

import {RunAfterAppReady} from '../libs/StaticNavigation';
import {DirectRouteWithParams, DirectRoutes} from '../navigations/routes';
import {AppLogger} from '../utils/logger';
import {getrelamContactName} from '../commonAction';
import {useEffect} from 'react';
import {
  DeviceEventEmitter,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {CALL_PERMISSIONS, usePermissions} from '../hooks/usePermissions';
import nativePermissionGranted from '@sendbird/uikit-react-native/src/utils/nativePermissionGranted';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import RNFBMessaging from '@react-native-firebase/messaging';
import {API_SERVER_KEY} from '../container/env';
import {FCM_SEND} from '../api_helper/Api';
import {getData, saveData} from '../res/asyncStorageHelper';
import Notifee from '@notifee/react-native';
import Strings from '../string_key/Strings';

export const setupCallKit = async () => {
  await RNCallKeep.setup({
    ios: {
      appName: 'Buzzmi',
      supportsVideo: true,
      maximumCallGroups: '1',
      maximumCallsPerCallGroup: '1',
      includesCallsInRecents: true,
      ringtoneSound: 'ringing.mp3',
    },
    android: {
      alertTitle: 'noop',
      alertDescription: 'noop',
      cancelButton: 'noop',
      okButton: 'noop',
      additionalPermissions: [],
    },
  });
};

// You can set CallKit listener on app mount with `setupCallKit`
// but it leads some weird behavior like listener is not triggered after app refresh on development mode.
export const setupCallKitListeners = () => {
  RNCallKeep.addEventListener('answerCall', async ({callUUID}) => {
    const directCall = await SendbirdCalls.getDirectCall(callUUID);

    const requestResult = await Permissions.requestMultiple(CALL_PERMISSIONS);
    const isGranted = nativePermissionGranted(requestResult);
    if (isGranted) {
      AppLogger.info('[CALL START]', directCall.callId);
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
  });

  RNCallKeep.addEventListener('endCall', async ({callUUID}) => {
    const directCall = await SendbirdCalls.getDirectCall(callUUID);
    AppLogger.info('[CALL END]', directCall.callId);
    await directCall.end();
  });

  return () => {
    RNCallKeep.removeEventListener('answerCall');
    RNCallKeep.removeEventListener('endCall');
  };
};

export const startRingingWithCallKit = async (props: DirectCallProperties) => {
  console.log("it's comming");
  if (props.remoteUser && props.ios_callUUID) {
    AppLogger.info('[startRingingWithCallKit] Report incoming call');
    console.log(props.callId);
    const uuid = props.ios_callUUID;
    const remoteUser = props.remoteUser;
    const directCall = await SendbirdCalls.getDirectCall(props.callId);

    const unsubscribeCallKit = setupCallKitListeners();
    const unsubscribeDirectCall = directCall.addListener({

      onEnded({callLog}) {

        let call_history = [];
        getData(
          'call_history',
          success => {
            if (success == null || success == 'null' || success == undefined) {
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

        if (callLog?.endResult === 'CANCELED'){
                  // Fired pushed notification.
        console.log("Push notification fired in case of cancelled!");
        RNFBMessaging().getToken().then(async val => {
          const messageNotification = {
            registration_ids: [
              val
            ],
            notification: {
              title: 'Missed Call',
              body: `${getrelamContactName(callLog.caller?.metaData.phone)}`,
              badge: call_history?.length
            },
            data: {
              title: 'Missed Call',
              body: `${getrelamContactName(callLog.caller?.metaData.phone)}`,
            },
          }

          let headers = new Headers({
            "Content-Type": "application/json",
            Authorization: "key=" + API_SERVER_KEY,
          })

          let response = await fetch(FCM_SEND, {
            method: "POST",
            headers,
            body: JSON.stringify(messageNotification),
          })
          response = await response.json()
        })
        }else{
          console.log("Push notification not fired in case of Ended!");
        }

        AppLogger.info('[startRingingWithCallKit]', 'onEnded');
        RNCallKeep.endAllCalls();
        RNCallKeep.removeEventListener('answerCall');
        RNCallKeep.removeEventListener('endCall');
        if (callLog?.endedBy?.userId === remoteUser.userId) {
          RNCallKeep.reportEndCallWithUUID(uuid, 2);
        }
        unsubscribeDirectCall();
        unsubscribeCallKit();
      },
    });

    // Accept only one ongoing call
    const onGoingCalls = await SendbirdCalls.getOngoingCalls();
    if (onGoingCalls.length > 1 || directCall.isEnded) {
      AppLogger.warn(
        '[startRingingWithCallKit] Ongoing calls:',
        onGoingCalls.length,
      );
      directCall.end();
      RNCallKeep.rejectCall(uuid);
      return;
    }

    RNCallKeep.displayIncomingCall(
      uuid,
      remoteUser.userId,
      getrelamContactName(remoteUser?.metaData.phone) ?? 'Unknown',
      'generic',
      props.isVideoCall,
    );
  }
};
