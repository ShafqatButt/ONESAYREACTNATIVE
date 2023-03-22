import dayjs from 'dayjs';
import React, {FC, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import IconAssets from '../assets';
import {getrelamContactName} from '../commonAction';
import {CallHistory} from '../libs/CallHistoryManager';
import Palette from '../styles/palette';
import SBIcon, {IconNames} from './SBIcon';
import SBText from './SBText';
import {POST} from '../api_helper/ApiServices';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {CHECK_SENDBIRD_USER} from '../api_helper/Api';
import {useSendbirdChat} from '@sendbird/uikit-react-native';
import {Routes} from '../libs/navigation';
import {useDirectNavigation} from '../navigations/useDirectNavigation';
import {DirectRoutes} from '../navigations/routes';
import Loading from './Loading';
import Strings from '../string_key/Strings';

const CallHistoryCell: FC<{
  history: CallHistory;
  onDial: (userId: string, isVideoCall: boolean) => void;
}> = ({history, onDial}) => {
  const remoteUser = history.remoteUser;
  const profileSource = remoteUser?.profileUrl
    ? {uri: remoteUser.profileUrl}
    : IconAssets.Avatar;

  const [isLoading, setIsLoading] = useState(false);
  const {sdk, currentUser} = useSendbirdChat();
  const {navigation} = useDirectNavigation<DirectRoutes.HISTORY>();

  const icon: IconNames = useMemo(() => {
    if (history.isVideoCall) {
      return history.isOutgoing
        ? 'CallVideoOutgoingFilled'
        : history.endResult == 'COMPLETED'
        ? 'CallVideoIncomingFilled'
        : 'PhoneMissed';
    } else {
      return history.isOutgoing
        ? 'CallVoiceOutgoingFilled'
        : history.endResult == 'COMPLETED'
        ? 'CallVideoIncomingFilled'
        : 'PhoneMissed';
    }
  }, [history]);

  const onCheckSendBirdUser = async (item: any) => {
    let postData = {mobileNumbers: [item?.remoteUser?.metaData.phone]};
    const userData = await AsyncStorage.getItem('userDetails');
    // const uniqueID = await DeviceInfo.getUniqueId();
    setIsLoading(true);
    POST(
      CHECK_SENDBIRD_USER,
      true,
      JSON.parse(userData).token,
      '',
      postData,
      async data => {
        if (data?.length > 0) {
          if (data[0]?.isSendBirdUser == true) {
            setIsLoading(false);
            const params = new sdk.GroupChannelParams();
            params.isSuper = false;
            params.isPublic = false;
            if (currentUser) {
              params.operatorUserIds = [currentUser.userId];
            }
            params.addUserIds([item?.remoteUser?.userId]);
            params.name = '';
            params.isDistinct = true;
            const channel = await sdk.GroupChannel.createChannel(params);
            navigation.navigate(Routes.GroupChannel, {
              serializedChannel: channel.serialize(),
            });
          }
        }
      },
    );
  };

  return (
    <TouchableOpacity
      onPress={() =>
        onDial(history.remoteUser?.userId ?? 'unknown', history.isVideoCall)
      }
      style={styles.cellContainer}>
      <Image source={profileSource} style={styles.cellProfile} />
      <View style={{...styles.cellInfo}}>
        <View style={{flex: 1}}>
          <SBText
            subtitle1
            color={Palette.onBackgroundLight01}
            numberOfLines={2}>
            {getrelamContactName(remoteUser?.metaData.phone) || '—'}
          </SBText>
          <View style={{flexDirection: 'row'}}>
            <SBIcon
              icon={icon}
              size={
                history.isOutgoing == false && history.endResult != 'COMPLETED'
                  ? 17
                  : 20
              }
              containerStyle={{marginRight: 8}}
            />
            <View style={{alignSelf: 'center'}}>
              {history.isOutgoing ? (
                <SBText
                  body3
                  color={Palette.onBackgroundLight03}
                  numberOfLines={2}>
                  {[Strings.outgoing, history.duration].join(' · ')}
                </SBText>
              ) : history.endResult == 'COMPLETED' ? (
                <SBText
                  body3
                  color={Palette.onBackgroundLight03}
                  numberOfLines={2}>
                  {[Strings.incoming, history.duration].join(' · ')}
                </SBText>
              ) : (
                <SBText body3 color={Palette.error300} numberOfLines={2}>
                  {[Strings.missed]}
                </SBText>
              )}
            </View>
          </View>
        </View>
        <View style={{alignItems: 'flex-end', alignSelf: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              style={{marginRight: 4}}
              disabled={!history.remoteUser}
              onPress={() => onCheckSendBirdUser(history)}>
              {({pressed}) => {
                return (
                  <SBIcon
                    size={35}
                    icon={(() => {
                      if (pressed) {
                        return 'chatFillOn';
                      }
                      return 'chatOn';
                    })()}
                  />
                );
              }}
            </Pressable>

            <Pressable
              style={{marginRight: 4}}
              disabled={!history.remoteUser}
              onPress={() =>
                onDial(history.remoteUser?.userId ?? 'unknown', true)
              }>
              {({pressed}) => {
                return (
                  <SBIcon
                    size={35}
                    icon={(() => {
                      if (!history.remoteUser) {
                        return 'btnCallVideoTertiaryDisabled';
                      }
                      if (pressed) {
                        return 'btnCallVideoFillTertiaryPressed';
                      }
                      return 'btnCallVideoTertiaryPressed';
                    })()}
                  />
                );
              }}
            </Pressable>
            <Pressable
              disabled={!history.remoteUser}
              onPress={() =>
                onDial(history.remoteUser?.userId ?? 'unknown', false)
              }>
              {({pressed}) => {
                return (
                  <SBIcon
                    size={35}
                    icon={(() => {
                      if (!history.remoteUser) {
                        return 'btnCallVoiceTertiaryDisabled';
                      }
                      if (pressed) {
                        return 'btnCallVoiceTertiaryfillPressed';
                      }
                      return 'btnCallVoiceTertiaryPressed';
                    })()}
                  />
                );
              }}
            </Pressable>
          </View>
        </View>
      </View>
      <Loading visible={isLoading} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Palette.background100,
    borderBottomWidth: 1,
  },
  cellProfile: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  cellInfo: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
  },
});

export default React.memo(CallHistoryCell);
