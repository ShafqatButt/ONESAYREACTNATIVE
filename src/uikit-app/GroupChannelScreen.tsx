// @ts-ignore
import React, {useState, useEffect, useRef} from 'react';
import {Text, Keyboard} from 'react-native';
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native/src';
import {colors} from '../res/colors';
import {fonts} from '../res/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {Routes} from '../libs/navigation';
import EmojiBoard from 'react-native-emoji-board';

import RNFetchBlob from 'rn-fetch-blob';
import {useAudioRecorderPlayer} from '../hooks/useAudioRecorderPlayer';
import {
  LoadingSpinner,
  Palette,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import {useLocalization} from '@sendbird/uikit-react-native/src/hooks/useContext';
import {
  CONST_TYPES,
  deleteFile,
  getChannelWithCustomType,
  underDevelopment,
} from './index';

import {useEventEmitter} from '../hooks/useEventEmitter';

import {GroupChannel, PublicGroupChannelListQuery} from 'sendbird';
import Loading from '../components/Loading';
import {Camera} from 'react-native-vision-camera';
import {EventRegister} from 'react-native-event-listeners';
import Strings from '../string_key/Strings';

const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelScreen = () => {
  const toast = useToast();
  const refEmojiVisible = useRef(false);
  const refNativeKeyboardVisible = useRef(false);
  const [isLoading, setLoading] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [renderKey, setRenderKey] = useState(9032);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {STRINGS} = useLocalization();
  const [start, stop] = useAudioRecorderPlayer();
  const {navigation, params} = useAppNavigation<Routes.GroupChannel>();
  const {sdk, currentUser} = useSendbirdChat();
  const [channel, setChannel] = useState(() =>
    sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
  );

  // sdk.GroupChannel.createPublicGroupChannelListQuery();
  // console.log('channel ==> ', JSON.stringify(channel));

  useEventEmitter('contacts-synced', () => {
    setRenderKey(prevState => ++prevState);
  });

  useEventEmitter('channel-update', data => {
    console.log('channel-update ==> ', JSON.stringify(data));
    if (data?.userLeftChannel?.userId === currentUser?.userId) {
      navigation.navigate(Routes.GroupChannelList);
    } else if (
      data?.userJoinnedChannel?.userId !== currentUser?.userId ||
      data?.operatorCountUpdated
    ) {
      channel.refresh(ch => {
        setChannel(() => ch);
      });
    }
  });

  const _keyboardDidShow = () => {
    if (refEmojiVisible?.current) {
      setVisible(prevState => {
        refEmojiVisible.current = !prevState;
        return !prevState;
      });
    }

    setKeyboardVisible(() => {
      refNativeKeyboardVisible.current = true;
      return true;
    });
  };
  const _keyboardDidHide = () =>
    setKeyboardVisible(() => {
      refNativeKeyboardVisible.current = false;
      return false;
    });

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    if (refEmojiVisible.current) {
      if (refNativeKeyboardVisible.current) {
        Keyboard.dismiss();
      }
    }
  }, [isKeyboardVisible, isVisible]);

  // useEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: {
  //       display: 'none',
  //     },
  //   });
  //   return () =>
  //     navigation.getParent()?.setOptions({
  //       tabBarStyle: undefined,
  //     });
  // }, [navigation]);

  const checkCameraPermissions = async () => {
    let cameraPermission = await Camera.getCameraPermissionStatus();
    let cameraStatus = cameraPermission === 'authorized';
    let microphonePermission = await Camera.getMicrophonePermissionStatus();
    let microphoneStatus = microphonePermission === 'authorized';

    if (!cameraStatus) {
      cameraPermission = await Camera.requestCameraPermission();
      cameraStatus = cameraPermission === 'authorized';
    }

    if (!cameraStatus) {
      underDevelopment(Strings.need_camera_permission);

      return;
    }

    if (!microphoneStatus) {
      microphonePermission = await Camera.requestMicrophonePermission();
      microphoneStatus = microphonePermission === 'authorized';
    }

    if (!microphoneStatus) {
      underDevelopment(Strings.warn_need_mic_permission);
      return;
    }

    // @ts-ignore
    navigation.navigate('CameraScreen', {
      onSendFile: file => {
        if (file === null || file === undefined) {
          console.log('Photo/Video picker cancelled...');
          return;
        }

        RNFetchBlob.fs
          .stat(file.uri.replace('file://', ''))
          .then(stats => {
            const mediaFile = {
              uri: file.uri,
              type:
                file.customFileType === 'video' ? 'video/mp4' : 'image/jpeg',
              size: stats.size,
              name: stats.filename,
            };
            EventRegister.emit('send-file-message', {
              file: mediaFile,
            });
          })
          .catch(e => {
            console.log('Recorder file path => ', e.message);
          });
      },
    });
  };

  return (
    <>
      <GroupChannelFragment
        key={renderKey}
        channel={channel}
        isKeyboardVisible={isKeyboardVisible}
        isEmojiKeyboardVisible={isVisible || isKeyboardVisible}
        emojiView={(onEmojiSelect, onRemove) => (
          <EmojiBoard
            showBoard={isVisible}
            onChangeTab={i => console.log('onChangeTab => ', i)}
            containerStyle={{
              position: !isVisible ? 'absolute' : undefined,
              height: isVisible ? wp('75%') : undefined,
            }}
            onRemove={() => onRemove()}
            onClick={emoji => onEmojiSelect(emoji)}
          />
        )}
        onEmojiPressed={(openNativeKeyboard = true) => {
          if (openNativeKeyboard === -1) {
            Keyboard.dismiss();
            return;
          }
          setVisible(prevState => {
            refEmojiVisible.current = !prevState;
            if (!refEmojiVisible.current && openNativeKeyboard) {
              EventRegister.emit('pop-open-keyboard', {open: true});
            }
            return !prevState;
          });
        }}
        onCameraPressed={() => checkCameraPermissions()}
        // @ts-ignore
        onRecordingEvent={(isRecording, onSendFile) => {
          if (isRecording === 2) {
            start();
          } else if (isRecording === 0) {
            stop(audioPath => deleteFile(audioPath.replace('file:///', '')));
          } else {
            // @ts-ignore
            stop(audioPath => {
              RNFetchBlob.fs
                .stat(audioPath.replace('file:///', ''))
                .then(stats => {
                  console.log('Recorder file stats => ', stats);
                  const audioFile = {
                    uri: audioPath,
                    type: 'audio/aac',
                    size: stats.size,
                    name: stats.filename,
                  };
                  console.log('audioFile ===> ', audioFile);
                  onSendFile(audioFile).catch(() =>
                    toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error'),
                  );
                })
                .catch(e => {
                  console.log('Recorder file path => ', e.message);
                });
            });
          }
        }}
        onPressMediaMessage={(fileMessage, deleteMessage) => {
          // Navigate to media viewer
          console.log('fileMessage => ', fileMessage);
          if (!fileMessage.type.includes('audio')) {
            navigation.navigate(Routes.FileViewer, {
              serializedFileMessage: fileMessage.serialize(),
              deleteMessage,
            });
          }
        }}
        onUploadFileProgress={loading => setLoading(() => loading)}
        onReplyMessage={(msg, toast) => {
          // TODO: Uncomment line number 234 in
          //    node_modules/@sendbird/uikit-react-native/src/domain/groupChannel/component/GroupChannelMessageList.tsx
          console.log('msg ===> ', msg);
          toast.show('Under Development', 'success');
        }}
        onReadByPressed={(msg, toast) => {
          channel.refresh(c => {
            // @ts-ignore
            navigation.navigate(Routes.UserListModal, {
              title: 'Read by',
              users: c.getReadMembers(msg).concat([{nickname: Strings.you}]),
            });
          });
          // toast.show('Under Development', 'success');
        }}
        onDeliveredToPressed={(msg, toast) => {
          channel.refresh(c => {
            let deliveredMembers = c
              .getUnreadMembers(msg)
              .concat(c.getReadMembers(msg))
              .unique();

            // @ts-ignore
            navigation.navigate(Routes.UserListModal, {
              title: 'Delivered to',
              users: deliveredMembers.concat([{nickname: Strings.you}]),
            });
          });
          // toast.show('Under Development', 'success');
        }}
        onChannelDeleted={() => {
          // Should leave channel, navigate to channel list
          navigation.navigate(Routes.GroupChannelList);
        }}
        onPressHeaderLeft={() => {
          // Navigate back
          navigation.goBack();
        }}
        // @ts-ignore
        onPressHeaderRight={id => {
          if (
            getChannelWithCustomType(channel).customType !==
            CONST_TYPES.ROOM_DIRECT
          ) {
            // Navigate to group channel settings
            if (id === 'info') {
              navigation.navigate(Routes.GroupChannelSettings, {
                serializedChannel: params.serializedChannel,
              });
            }
            if (id === 'search') {
              console.log(id);

              // @ts-ignore
              navigation.navigate('SearchMessageScreen', {
                serializedChannel: params.serializedChannel,
              });
            }
          }
        }}
        onProfilePressed={() => {
          if (
            getChannelWithCustomType(channel).customType ===
            CONST_TYPES.ROOM_DIRECT
          ) {
            const user = channel.members.filter(
              m => m.userId !== currentUser.userId,
            )[0];
            console.log('Hello direct chat!', JSON.stringify(user));
            navigation.navigate('ProfileView', {
              data: user,
              channelUrl: channel?.url,
              is_super: channel?.isSuper,
            });
          }
        }}
        flatListProps={{
          ListFooterComponent: () => (
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.MEDIUM,
                color: colors.PRIMARY_COLOR,
                fontSize: wp('3.8%'),
              }}>
              {Strings.sa_str_end_to_end_encrypted}
            </Text>
          ),
        }}
      />
      <Loading visible={isLoading} />
    </>
  );
};

export default GroupChannelScreen;
