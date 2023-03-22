// @ts-ignore
import React, {useEffect, useState} from 'react';
import {Text, Image, View, Pressable} from 'react-native';
import {createGroupChannelInviteFragment} from '@sendbird/uikit-react-native/src';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import type {SendbirdUser} from '@sendbird/uikit-utils/src';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Icon} from '@sendbird/uikit-react-native-foundation/src';
import {useAppNavigation} from '../hooks/useAppNavigation';
//import Clipboard from '@react-native-clipboard/clipboard';
import Clipboard from '@react-native-community/clipboard';
import {Routes} from '../libs/navigation';
import {colors} from '../res/colors';
import {fonts} from '../res/fonts';
import IconAssets from '../assets';
import {createChannelInviteLink, underDevelopment} from './index';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import Strings from '../string_key/Strings';

const ICON_SIZE = wp('22%');

const GroupChannelInviteFragment =
  createGroupChannelInviteFragment<SendbirdUser>();

const ChannelInviteViaLinkScreen = () => {
  const {navigation, params} = useAppNavigation<Routes.GroupChannelInvite>();
  // @ts-ignore
  const {sdk} = useSendbirdChat();

  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const [channel] = useState(() =>
    sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
  );

  useEffect(() => {
    setLoading(() => true);
    createChannelInviteLink(channel).then(link => {
      setLoading(() => false);
      setInviteLink(() => link);
    });
  }, []);

  return (
    <GroupChannelInviteFragment
      channel={channel}
      headerOnly={true}
      customTitle={Strings.invite_to_channel_via_link}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onInviteMembers={channel => {
        navigation.navigate(Routes.GroupChannel, {
          serializedChannel: channel.serialize(),
        });
      }}>
      <View>
        <View style={{height: wp('1%')}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingVertical: hp('2%'),
          }}>
          <Image
            source={IconAssets.ic_one_say_sign}
            resizeMode={'contain'}
            style={{
              height: ICON_SIZE,
              width: ICON_SIZE,
              marginHorizontal: wp('3%'),
            }}
          />
          <View>
            <Text
              style={{
                color: 'black',
                fontFamily: fonts.BOLD,
                fontSize: wp('4%'),
              }}>
              {channel.name}
            </Text>
            <Text style={{width: wp('50%'), color: '#137df1'}}>
              {inviteLink}
            </Text>
          </View>
        </View>
        <View style={{height: wp('2%')}} />
        <View
          style={{
            borderRadius: 6,
            overflow: 'hidden',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#edebf1',
            marginHorizontal: wp('6%'),
            paddingVertical: wp('4.5%'),
            paddingHorizontal: wp('4.5%'),
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: wp('3.8%'),
            }}>
            {Strings.invite_with_link_description}
          </Text>
        </View>
        <View style={{height: wp('3%')}} />
        <Pressable
          onPress={() =>
            navigation.navigate('InviteUser', {
              channel: channel,
              withLink: true,
              invitationLink: inviteLink,
            })
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingStart: wp('4.5%'),
            paddingVertical: wp('3.5%'),
            borderBottomColor: 'rgb(237,235,241)',
          }}>
          <Icon
            icon={'arrow-left'}
            size={wp('5%')}
            color={colors.PRIMARY_COLOR}
            style={{
              transform: [{rotate: '180deg'}],
              marginStart: wp('1.5%'),
              marginEnd: wp('3%'),
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: wp('4.5%'),
            }}>
            {Strings.send_link_via_buzzmi}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Clipboard.setString(inviteLink);
            underDevelopment(Strings.link_copied_with_success);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingStart: wp('4.5%'),
            paddingVertical: wp('3.5%'),
            borderBottomColor: 'rgb(237,235,241)',
          }}>
          <Icon
            icon={'copy'}
            size={wp('5%')}
            color={colors.PRIMARY_COLOR}
            style={{
              transform: [{rotate: '180deg'}],
              marginStart: wp('1.5%'),
              marginEnd: wp('3%'),
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: wp('4.5%'),
            }}>
            {Strings.copy_link}
          </Text>
        </Pressable>
      </View>
      {loading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: hp(90),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </GroupChannelInviteFragment>
  );
};

export default ChannelInviteViaLinkScreen;
