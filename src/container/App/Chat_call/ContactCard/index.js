import React, {useContext} from 'react';
import {Alert, View, Image, Pressable, Linking} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {BorderContainer, Text} from './style';
import {images} from '../../../../res/images';
import {fonts} from '../../../../res/fonts';
import {Button} from '../../../../components/Button';
import {GET, POST} from '../../../../api_helper/ApiServices';
import {AuthContext} from '../../../../context/Auth.context';
import {INVITE_LINK, INVITE_SEND_BIRD_USER} from '../../../../api_helper/Api';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import deviceInfoModule from 'react-native-device-info';
import SBIcon from '../../../../components/SBIcon';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import {DirectRoutes} from '../../../../navigations/routes';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {Routes} from '../../../../libs/navigation';
import {CONST_TYPES} from '../../../../uikit-app';
import {CALL_PERMISSIONS} from '../../../../hooks/usePermissions';
import Permissions from 'react-native-permissions';
import nativePermissionGranted from '@sendbird/uikit-react-native/src/utils/nativePermissionGranted';
import moment from 'moment/moment';
import Strings from '../../../../string_key/Strings';

export default ContactCard = props => {
  const {card, isSendBirdUser, sendBirdID, channel} = props.route.params;
  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;
  const {sdk, currentUser} = useSendbirdChat();

  const onSendInvitation = async () => {
    // console.log(userData);
    const user = await AsyncStorage.getItem('userDetails');
    const uniqueID = await deviceInfoModule.getUniqueId();
    const api = INVITE_LINK(userData?.userId);
    console.log(api);
    GET(api, JSON.parse(user).token, uniqueID)
      .then(res => {
        console.log('res---');
        console.log(res.data);
        if (res.data?.link) {
          let postData = {
            mobileNumbers: [card?.phoneNumber],
            channelType: channel?.channelType
              ? channel?.channelType
              : 'OneToOne',
            invitationLink: channel?.url ? channel?.url : res.data?.link,
          };
          console.log(postData);
          POST(
            INVITE_SEND_BIRD_USER,
            true,
            JSON.parse(user).token,
            uniqueID,
            postData,
            data => {
              if (data?.message == 'SUCCESS') {
                Alert.alert(
                  'Buzzmi',
                  Strings.invitation_sent_success,
                  [
                    {
                      text: Strings.okay,
                      onPress: () => {
                        setTimeout(() => {
                          props.navigation.goBack();
                        }, 500);
                      },
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                alert(data);
              }
            },
          );
        }
      })
      .catch(e => console.log('INVITATION (error) => ', e.message));
  };

  const onDial = async isVideoCall => {
    const users = channel?.members?.filter(m => m?.userId === sendBirdID);
    let metadate = null;
    if (users?.length > 0) {
      metadate = users[0]?.metaData;
    }

    if (metadate !== null && metadate !== undefined) {
      let snoozeData, dndData;
      const currentDate = new Date();
      if (metadate?.DNDData?.length > 0) {
        dndData = JSON.parse(metadate?.DNDData);

        const getHours = timestamp => parseInt(moment(timestamp).format('HH'));
        const getMinutes = timestamp =>
          parseInt(moment(timestamp).format('mm'));

        const currentHours = getHours(currentDate.getTime());
        const currentMinutes = getMinutes(currentDate.getTime());
        const currentValue = currentHours + currentMinutes;

        const startHours = getHours(dndData?.startTime);
        const startMinutes = getMinutes(dndData?.startTime);
        const startValue = startHours + startMinutes;

        const endHours = getHours(dndData?.endTime);
        const endMinutes = getMinutes(dndData?.endTime);
        const endValue = endHours + endMinutes;

        const dndEnabled =
          currentValue >= startValue && currentValue <= endValue;

        if (dndEnabled) {
          Alert.alert(Strings.failed, Strings.warn_user_is_on_dnd);
          return;
        }
      } else if (metadate?.snoozData?.length > 0) {
        snoozeData = JSON.parse(metadate?.snoozData);

        const snoozeEnabled =
          currentDate.getTime() > snoozeData?.startTimestamp &&
          currentDate.getTime() < snoozeData?.endTimestamp;

        if (snoozeEnabled) {
          Alert.alert(Strings.failed, Strings.warn_user_is_on_snooze);
          return;
        }
      }
    }
    try {
      const requestResult = await Permissions.requestMultiple(CALL_PERMISSIONS);
      const isGranted = nativePermissionGranted(requestResult);
      if (isGranted) {
        const callProps = await SendbirdCalls.dial(sendBirdID, isVideoCall);
        console.log(callProps);
        if (isVideoCall) {
          props.navigation.navigate(DirectRoutes.VIDEO_CALLING, {
            callId: callProps.callId,
          });
        } else {
          props.navigation.navigate(DirectRoutes.VOICE_CALLING, {
            callId: callProps.callId,
          });
        }
      } else {
        Alert.alert(
          Strings.Insufficient_permissions,
          Strings.to_call_allow_buzzmi_access,
          [
            {
              text: Strings.Cancel,
              style: 'cancel',
              onPress: async () => {},
            },
            {
              text: Strings.okay,
              onPress: async () => {
                Linking.openSettings();
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (e) {
      // @ts-ignore
      Alert.alert(Strings.failed, e.message);
    }
  };

  const onChat = async () => {
    const params = new sdk.GroupChannelParams();
    params.isSuper = false;
    params.isPublic = false;
    if (currentUser) {
      params.operatorUserIds = [currentUser.userId];
    }
    params.addUserIds([sendBirdID]);
    params.name = '';
    params.isDistinct = true;
    params.customType = CONST_TYPES.ROOM_DIRECT;
    const channel = await sdk.GroupChannel.createChannel(params);
    setTimeout(() => {
      props.navigation.replace(Routes.GroupChannelTabs);
      setTimeout(() => {
        props.navigation.navigate(Routes.GroupChannel, {
          serializedChannel: channel.serialize(),
        });
      }, 500);
    }, 250);
  };

  return (
    <GlobalFlex>
      <BackHeader
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={card?.value}
      />
      <Spacer space={hp(1)} />
      <View style={{flex: 1}}>
        <Image
          source={
            card?.hasThumbnail ? {uri: card?.thumbnailPath} : images.avatar
          }
          style={{width: wp(100), height: hp(30)}}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: wp(3),
            width: wp(92),
            alignSelf: 'center',
          }}>
          <View style={{flex: 1}}>
            <Text
              style={[
                {
                  fontSize: wp(3.5),
                  fontFamily: fonts.REGULAR,
                  textAlign: 'left',
                  color: colors.DARK_GRAY_93,
                },
              ]}>
              {Strings.mobile}
            </Text>
            <Text
              style={[
                {
                  fontSize: wp(4.5),
                  fontFamily: fonts.REGULAR,
                  textAlign: 'left',
                },
              ]}>
              {card?.phoneNumber}
            </Text>
          </View>

          {isSendBirdUser && (
            <View style={{alignItems: 'flex-end', alignSelf: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={{marginRight: 8}}
                  onPress={() => {
                    onChat();
                  }}>
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
                  style={{marginRight: 8}}
                  onPress={() => onDial(true)}>
                  {({pressed}) => {
                    return (
                      <SBIcon
                        size={35}
                        icon={(() => {
                          if (pressed) {
                            return 'btnCallVideoFillTertiaryPressed';
                          }
                          return 'btnCallVideoTertiaryPressed';
                        })()}
                      />
                    );
                  }}
                </Pressable>
                <Pressable onPress={() => onDial(false)}>
                  {({pressed}) => {
                    return (
                      <SBIcon
                        size={35}
                        icon={(() => {
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
          )}
        </View>
        <BorderContainer />
        <Spacer space={hp(1.5)} />
        {isSendBirdUser == false && (
          <Button
            buttonText={Strings.send_invitation}
            buttonPress={() => {
              onSendInvitation();
            }}
          />
        )}
      </View>
    </GlobalFlex>
  );
};
