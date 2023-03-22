import Notifee, {EventType} from '@notifee/react-native';
import type {Event} from '@notifee/react-native/dist/types/Notification';
import PushNotificationIOS, {
  PushNotification,
} from '@react-native-community/push-notification-ios';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  isSendbirdNotification,
  parseSendbirdNotification,
  getFileExtension,
  getFileType,
} from '@sendbird/uikit-utils';

import {Routes, navigationRef, runAfterAppReady} from './navigation';
import {getrelamContactName} from '../commonAction';
import {
  setFirebaseMessageHandlers,
  setNotificationForegroundService,
} from '../callHandler/android';
import {CONST_TYPES} from '../uikit-app';
import {removeData} from '../res/asyncStorageHelper';
import Strings from '../string_key/Strings';

const channelId = 'onesay';
Notifee.createChannel({id: channelId, name: 'onesay', importance: 4});
const iconText = {
  audio: 'Audio',
  image: 'Photo',
  video: 'Video',
  file: 'File',
} as const;

export const onNotificationAndroid: (event: Event) => Promise<void> = async ({
  type,
  detail,
}) => {
  //if (Platform.OS !== 'android') return;
  console.log('yes tapped');
  if (
    type === EventType.PRESS &&
    detail?.notification &&
    detail?.notification?.data?.title == 'Missed Call'
  ) {
    removeData('call_history');
    navigationRef.navigate('CallHistory');
  } else if (
    type === EventType.PRESS &&
    detail.notification &&
    isSendbirdNotification(detail.notification.data)
  ) {
    const sendbird = parseSendbirdNotification(detail.notification.data);

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
};

export const onForegroundAndroid = () =>
  Notifee.onForegroundEvent(onNotificationAndroid);

export const onForegroundIOS = () => {
  return () => PushNotificationIOS.removeEventListener('localNotification');
};

// export const onForegroundIOS = () => {
//   if (Platform.OS !== 'ios') return NOOP;

//   const onNotificationIOS = (notification: PushNotification) => {
//     const data = notification.getData();
//     if (data.userInteraction === 1 && isSendbirdNotification(data)) {
//       const sendbird = parseSendbirdNotification(data);
//       runAfterAppReady(async (sdk, actions) => {
//         const channelUrl = sendbird.channel.channel_url;
//         const channel = await sdk.GroupChannel.getChannel(sendbird.channel.channel_url);

//         if (Routes.Home === navigationRef.getCurrentRoute()?.name) {
//           actions.push(Routes.GroupChannelTabs, undefined);
//         } else {
//           actions.navigate(Routes.GroupChannel, { serializedChannel: channel.serialize() });
//         }
//       });
//     }
//   };

//   const checkAppOpenedWithNotification = async () => {
//     const notification = await PushNotificationIOS.getInitialNotification();
//     notification && onNotificationIOS(notification);
//   };

//   checkAppOpenedWithNotification();
//   PushNotificationIOS.addEventListener('localNotification', onNotificationIOS);
//   return () => PushNotificationIOS.removeEventListener('localNotification');
// };

const CustomText = (messages: any) => {
  const message = messages.trim().split(' ');
  return message.map(text => {
    if (text.includes('@+')) {
      return '@' + getrelamContactName(text.slice(1));
    } else if (text.includes('@')) {
      let text_g = text;
      return text_g;
    } else {
      return `${text} `;
    }
  });
};

export const onBackgroundAndroid = () =>
  Notifee.onBackgroundEvent(onNotificationAndroid);

export const onInitalNotificationAndroid = async () => {
  const initialNotification = await Notifee.getInitialNotification();

  if (initialNotification) {
    if (isSendbirdNotification(initialNotification?.notification?.data)) {
      const sendbird = parseSendbirdNotification(
        initialNotification?.notification?.data,
      );

      runAfterAppReady(async (sdk, actions) => {
        console.log('running after app ready on click');

        if (Routes.Home === navigationRef.getCurrentRoute()?.name) {
          actions.push(Routes.GroupChannelTabs, undefined);
        }
        const channel = await sdk.GroupChannel.getChannel(
          sendbird.channel.channel_url,
        );
        if (channel) {
          // @ts-ignore
          actions.navigate('chat', {
            screen: Routes.GroupChannel,
            params: {
              serializedChannel: channel.serialize(),
            },
          });
        }
      });
    }
  }
};

messaging().onMessage(async (message: FirebaseMessagingTypes.RemoteMessage) => {
  if (message.data.title == 'Missed Call') {
    Notifee.displayNotification({
      id: String(new Date()),
      title: Strings.missed_call,
      body: `${message.data.body}`,
      data: {
        title: 'Missed Call',
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

  if (isSendbirdNotification(message.data) && !global.hideNotification) {
    const sendbird = parseSendbirdNotification(message.data);
    console.log(sendbird);
    if (
      sendbird.channel.custom_type == CONST_TYPES.ROOM_CHANNEL ||
      sendbird.channel.custom_type == CONST_TYPES.ROOM_GROUP
    ) {
      await Notifee.displayNotification({
        id: String(sendbird.message_id),
        title: `${sendbird.channel.name || 'Message received'}`,
        body:
          `${getrelamContactName(sendbird.sender?.metadata.phone)}: ` +
          (sendbird.type == 'MESG'
            ? sendbird.mentioned_users.length > 0
              ? CustomText(sendbird.message).join('')
              : sendbird.message
            : `The ${
                iconText[
                  getFileType(
                    sendbird.files[0].type ||
                      getFileExtension(sendbird.message),
                  )
                ]
              } received`),
        data: message.data,
        android: {
          channelId,
          importance: 4,
          // smallIcon: 'drawable/icon_push_lollipop',
          largeIcon:
            sendbird.sender?.profile_url || sendbird.channel.channel_url,
          circularLargeIcon: true,
          pressAction: {id: 'default'},
          showTimestamp: true,
          timestamp: sendbird.created_at,
        },
        ios: {
          threadId: sendbird.channel.channel_url,
        },
      });
    } else {
      await Notifee.displayNotification({
        id: String(sendbird.message_id),
        title: `${
          sendbird.channel.name ||
          getrelamContactName(sendbird.sender?.metadata.phone) ||
          'Message received'
        }`,
        body:
          sendbird.type == 'MESG'
            ? sendbird.message
            : `The ${
                iconText[
                  getFileType(
                    sendbird.files[0].type ||
                      getFileExtension(sendbird.message),
                  )
                ]
              } received`,
        data: message.data,
        android: {
          channelId,
          importance: 4,
          largeIcon:
            sendbird.sender?.profile_url || sendbird.channel.channel_url,
          circularLargeIcon: true,
          pressAction: {id: 'default'},
          showTimestamp: true,
          timestamp: sendbird.created_at,
        },
        ios: {
          threadId: sendbird.channel.channel_url,
        },
      });
    }
  } else {
    setFirebaseMessageHandlers();
    setNotificationForegroundService();
  }
});

messaging().setBackgroundMessageHandler(
  async (message: FirebaseMessagingTypes.RemoteMessage) => {
    // if (Platform.OS !== 'android') return;
    if (isSendbirdNotification(message.data)) {
      const sendbird = parseSendbirdNotification(message.data);
      console.log('notfication received');

      if (
        sendbird.channel.custom_type == CONST_TYPES.ROOM_CHANNEL ||
        sendbird.channel.custom_type == CONST_TYPES.ROOM_GROUP
      ) {
        await Notifee.displayNotification({
          id: String(sendbird.message_id),
          title: `${sendbird.channel.name || 'Message received'}`,
          body:
            `${getrelamContactName(sendbird.sender?.metadata.phone)}: ` +
            (sendbird.type == 'MESG'
              ? sendbird.mentioned_users.length > 0
                ? CustomText(sendbird.message).join('')
                : sendbird.message
              : `The ${
                  iconText[
                    getFileType(
                      sendbird.files[0].type ||
                        getFileExtension(sendbird.message),
                    )
                  ]
                } received`),
          data: message.data,
          android: {
            channelId,
            importance: 4,
            largeIcon:
              sendbird.sender?.profile_url || sendbird.channel.channel_url,
            circularLargeIcon: true,
            pressAction: {id: 'default'},
            showTimestamp: true,
            timestamp: sendbird.created_at,
          },
          ios: {
            threadId: sendbird.channel.channel_url,
          },
        });
      } else {
        await Notifee.displayNotification({
          id: String(sendbird.message_id),
          title: `${
            sendbird.channel.name ||
            getrelamContactName(sendbird.sender?.metadata.phone) ||
            'Message received'
          }`,
          body:
            sendbird.type == 'MESG'
              ? sendbird.message
              : `The ${
                  iconText[
                    getFileType(
                      sendbird.files[0].type ||
                        getFileExtension(sendbird.message),
                    )
                  ]
                } received`,
          data: message.data,
          android: {
            channelId,
            importance: 4,
            largeIcon:
              sendbird.sender?.profile_url || sendbird.channel.channel_url,
            circularLargeIcon: true,
            pressAction: {id: 'default'},
            showTimestamp: true,
            timestamp: sendbird.created_at,
          },
          ios: {
            threadId: sendbird.channel.channel_url,
          },
        });
      }
    } else {
      setFirebaseMessageHandlers();
      setNotificationForegroundService();
    }
  },
);
