import React, {FC, Fragment, useMemo, useEffect} from 'react';
import {
  Image,
  Pressable,
  Alert,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  check,
  request,
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
} from 'react-native-permissions';

import {
  AudioDeviceRoute,
  DirectCall,
  DirectCallUserRole,
} from '@sendbird/calls-react-native';

import IconAssets from '../assets';
import {DirectCallStatus} from '../hooks/useDirectCall';
import {useDirectCallDuration} from '../hooks/useDirectCallDuration';
import Palette from '../styles/palette';
import AudioDeviceButton from './AudioDeviceButton';
import SBIcon from './SBIcon';
import SBText from './SBText';
import {getrelamContactName} from '../commonAction';
import RNFBMessaging from '@react-native-firebase/messaging';
import Strings from '../string_key/Strings';

type ControllerViewProps = {
  status: DirectCallStatus;
  call: DirectCall;
  ios_audioDevice: AudioDeviceRoute;
};
const DirectCallControllerView: FC<ControllerViewProps> = ({
  status,
  call,
  ios_audioDevice,
}) => {
  const {top} = useSafeAreaInsets();
  const remoteUserNickname = useMemo(() => {
    if (call.myRole === DirectCallUserRole.CALLEE) {
      return getrelamContactName(call.caller.metaData?.phone) ?? 'No name';
    }
    if (call.myRole === DirectCallUserRole.CALLER) {
      return getrelamContactName(call.callee.metaData?.phone) ?? 'No name';
    }
    return 'No name';
  }, [call]);

  const someOf = (stats: DirectCallStatus[]) => stats.some(s => s === status);
  const statusStandby = someOf(['pending']);
  const statusInProgress = someOf(['established', 'connected', 'reconnecting']);
  const statusEnded = someOf(['ended']);
  const isVoiceCall = !call.isVideoCall;
  const isVideoCall = call.isVideoCall;

  // useEffect(() => {
  //   if (Platform.OS == 'android') {
  //     verifyPermissions()
  //   }

  //   MicroPhonePermission()
  // }, [])

  const verifyPermissions = async () => {
    let perm: any;
    perm = [
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ];
    let permissionStatuses = await requestMultiple(perm);
    const result = permissionStatuses[perm[0]];
    // const CALL_PERMISSIONS = Platform.select({
    //   android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.BLUETOOTH_CONNECT],
    //   ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
    //   default: [],
    // });

    // const result = requestMultiple(CALL_PERMISSIONS);

    if (result !== 'granted') {
      Alert.alert(
        Strings.Insufficient_permissions,
        Strings.you_need_grant_storage_access,
        [{text: Strings.okay}],
      );
      return false;
    }
    return true;
  };

  const MicroPhonePermission = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          {
            title: Strings.permissions_for_record_audio,
            message: Strings.give_permission_record_audio,
            buttonPositive: Strings.OK,
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permission granted');
        } else {
          Alert.alert(
            Strings.Insufficient_permissions,
            Strings.You_need_grant_microphone,
            [
              {
                text: Strings.okay,
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else {
      request(PERMISSIONS.IOS.MICROPHONE).then(response => {
        console.log(response);
        if (response == 'blocked' || response == 'denied') {
          Alert.alert(
            Strings.Insufficient_permissions,
            Strings.You_need_grant_microphone,
            [
              {
                text: Strings.okay,
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
        }
      });
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, {padding: 16}]}>
      <View style={styles.topController}>
        <View style={{alignItems: 'flex-end', paddingTop: top}}>
          {isVideoCall && statusInProgress && (
            <Pressable onPress={() => call.switchCamera()}>
              <SBIcon icon={'btnCameraFlipIos'} size={48} />
            </Pressable>
          )}
        </View>
        <View style={styles.information}>
          {statusStandby && (
            <Fragment>
              <SBText
                h2
                color={Palette.onBackgroundDark01}
                style={styles.nickname}>
                {remoteUserNickname}
              </SBText>
              <SBText color={Palette.onBackgroundDark01} body3>
                {call.myRole === DirectCallUserRole.CALLER
                  ? Strings.calling + '...'
                  : `${Strings.incoming} ${
                      call.isVideoCall ? 'video' : Strings.voice
                    } ${Strings.call}...`}
              </SBText>
            </Fragment>
          )}
          {((isVoiceCall && statusInProgress) || statusEnded) && (
            <Fragment>
              <Image
                style={styles.profile}
                source={
                  call.remoteUser?.profileUrl
                    ? {uri: call.remoteUser?.profileUrl}
                    : IconAssets.Avatar
                }
              />
              <SBText
                h2
                color={Palette.onBackgroundDark01}
                style={styles.nickname}>
                {remoteUserNickname}
              </SBText>
              <StatusView statusInProgress={statusInProgress} call={call} />
            </Fragment>
          )}
          <View style={styles.remoteMuteStatus}>
            {statusInProgress && !call.isRemoteAudioEnabled && (
              <Fragment>
                <SBIcon
                  icon={'AudioOff'}
                  size={40}
                  color={Palette.onBackgroundDark01}
                  containerStyle={{marginBottom: 16}}
                />
                <SBText
                  color={Palette.onBackgroundDark01}
                  body3>{`${remoteUserNickname} ${Strings.is_muted}`}</SBText>
              </Fragment>
            )}
          </View>
        </View>
      </View>

      <View style={styles.bottomController}>
        {(statusStandby || statusInProgress) && (
          <>
            <View style={[styles.bottomButtonGroup, {marginBottom: 24}]}>
              <Pressable
                style={styles.bottomButton}
                onPress={() => {
                  if (call.isLocalAudioEnabled) {
                    call.muteMicrophone();
                  } else {
                    call.unmuteMicrophone();
                  }
                }}>
                <SBIcon
                  icon={
                    call.isLocalAudioEnabled
                      ? 'btnAudioOff'
                      : 'btnAudioOffSelected'
                  }
                  size={64}
                />
              </Pressable>
              {isVideoCall && (
                <Pressable
                  style={styles.bottomButton}
                  onPress={() => {
                    if (call.isLocalVideoEnabled) {
                      call.stopVideo();
                    } else {
                      call.startVideo();
                    }
                  }}>
                  <SBIcon
                    icon={
                      call.isLocalVideoEnabled
                        ? 'btnVideoOff'
                        : 'btnVideoOffSelected'
                    }
                    size={64}
                  />
                </Pressable>
              )}
              <AudioDeviceButton
                currentAudioDeviceIOS={ios_audioDevice}
                availableAudioDevicesAndroid={
                  call.android_availableAudioDevices
                }
                currentAudioDeviceAndroid={call.android_currentAudioDevice}
                onSelectAudioDeviceAndroid={call.android_selectAudioDevice}
              />
            </View>

            <View style={styles.bottomButtonGroup}>
              {statusStandby && call.myRole === DirectCallUserRole.CALLEE && (
                <Pressable
                  style={styles.bottomButton}
                  onPress={() => call.accept()}>
                  <SBIcon icon={'btnCallVideoAccept'} size={64} />
                </Pressable>
              )}
              <Pressable onPress={() => call.end()}>
                <SBIcon icon={'btnCallEnd'} size={64} />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const StatusView = ({
  call,
  statusInProgress,
}: {
  call: DirectCall;
  statusInProgress: boolean;
}) => {
  const seconds = useDirectCallDuration(call);
  return (
    <SBText color={Palette.onBackgroundDark01} body3>
      {statusInProgress
        ? seconds
        : call.endResult.toLowerCase().includes('completed')
        ? Strings.completed
        : call.endResult}
    </SBText>
  );
};

const styles = StyleSheet.create({
  topController: {
    flex: 1,
  },
  information: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profile: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 32,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  remoteMuteStatus: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomController: {
    flex: 0.8,
    justifyContent: 'flex-end',
    paddingBottom: 64,
  },
  bottomButton: {
    marginRight: 24,
  },
  bottomButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default DirectCallControllerView;
