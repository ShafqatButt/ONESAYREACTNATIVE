// noinspection ES6CheckImport

import React, {useCallback, useState} from 'react';
import {Pressable, View, Image, Text, Alert} from 'react-native';
import {Spacer} from '../../../../res/spacer';
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import {images} from '../../../../res/images';
import {styles} from './style';
import realm from '../../../../realmStore';
import AlphabetList from 'react-native-flatlist-alphabet';
import {POST} from '../../../../api_helper/ApiServices';
import {CHECK_SENDBIRD_USER} from '../../../../api_helper/Api';
import Loading from '../../../../components/Loading';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {TextInput} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useActiveGroupChannel} from '@sendbird/uikit-chat-hooks';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {Routes} from '../../../../libs/navigation';
import IconAssets from '../../../../assets';
import {Icon} from '@sendbird/uikit-react-native-foundation/src';
import dynamicLinks, {
  ShortLinkType,
} from '@react-native-firebase/dynamic-links';
import {
  CONST_TYPES,
  createChannelInviteLink,
  getSearchParamsFromURL,
  removeSpecialCharacters,
  underDevelopment,
} from '../../../../uikit-app';
import Strings from '../../../../string_key/Strings';

export default InviteUser = props => {
  const [search, setSerach] = useState('');
  const [loading, setLoading] = useState('');
  const [contactData, setContactData] = useState(
    JSON.parse(JSON.stringify(realm.objects('Contact').sorted('givenName'))),
  );
  const {channel, withLink, invitationLink} = props.route.params;
  const {sdk, currentUser} = useSendbirdChat();
  const {activeChannel} = useActiveGroupChannel(sdk, channel);
  const [selected, setSelected] = useState({
    phone: '',
    data: null,
  });

  const onPressNext = data => {
    Alert.alert(
      Strings.add_a_contact +
        ' "' +
        data.value.trim() +
        '" ' +
        Strings.to_a_channel +
        ' "' +
        channel.name.trim() +
        '"?',
      '',
      [
        {
          text: Strings.Cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'destructive',
        },
        {
          text: Strings.add,
          onPress: () => onCheckSendBirdUser(data),
        },
      ],
    );
  };

  const renderListItem = item => {
    return (
      <Pressable
        style={styles.listItemContainer}
        onPress={() =>
          withLink
            ? setSelected(() => {
                if (selected?.phone === item?.phoneNumber) {
                  return {
                    phone: '',
                    data: null,
                  };
                }

                return {
                  phone: item?.phoneNumber,
                  data: item,
                };
              })
            : onCheckSendBirdUser(item).then()
        }>
        <View style={{width: wp(10)}}>
          <Image
            source={
              item.hasThumbnail ? {uri: item.thumbnailPath} : images.avatar
            }
            style={{
              width: withLink ? wp(10) : wp(6),
              height: withLink ? wp(10) : wp(6),
              borderRadius: withLink ? wp(10) : wp(6),
            }}
          />
          {selected?.phone === item?.phoneNumber && (
            <View
              style={{
                right: 0,
                bottom: 0,
                borderRadius: 90,
                alignItems: 'center',
                position: 'absolute',
                alignSelf: 'baseline',
                justifyContent: 'center',
                backgroundColor: '#15bdbc',
                padding: wp('0.3%'),
              }}>
              <Image
                source={IconAssets.ic_done}
                style={{
                  tintColor: 'white',
                  width: wp('3%'),
                  height: wp('3%'),
                }}
              />
            </View>
          )}
        </View>
        <Text style={styles.listItemLabel}>{item.value}</Text>
      </Pressable>
    );
  };

  const renderSectionHeader = section => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
      </View>
    );
  };

  const createOrGetExistingChat = async sendBirdID => {
    const params = new sdk.GroupChannelParams();
    params.isSuper = false;
    params.isPublic = false;
    params.isEphemeral = false;
    params.customType = CONST_TYPES.ROOM_DIRECT;
    if (currentUser) {
      params.operatorUserIds = [currentUser.userId];
    }
    params.addUserIds(sendBirdID);
    params.name = '';
    params.isDistinct = true;
    const _channel = await sdk.GroupChannel.createChannel(params);

    _channel.sendUserMessage(invitationLink, message => {
      setTimeout(() => {
        props.navigation.goBack();
        underDevelopment(Strings.warn_invitation_link_sent);
      }, 250);
    });
  };

  const onCheckSendBirdUser = async item => {
    let postData = {mobileNumbers: [item?.phoneNumber]};
    const userData = await AsyncStorage.getItem('userDetails').then(userData =>
      JSON.parse(userData),
    );
    const uniqueID = await DeviceInfo.getUniqueId();
    setLoading(true);
    POST(
      CHECK_SENDBIRD_USER,
      true,
      userData.token,
      uniqueID,
      postData,
      async data => {
        setLoading(false);
        //   console.log(data)
        if (data?.length > 0) {
          if (data[0]?.isSendBirdUser == true) {
            const userIds = [data[0]?.sendBirdId];

            if (withLink) {
              createOrGetExistingChat(userIds).then();
              return;
            }

            const updatedChannel = await activeChannel.inviteWithUserIds(
              userIds,
            );
            props.navigation.navigate(Routes.GroupChannel, {
              serializedChannel: updatedChannel.serialize(),
            });
          } else {
            props.navigation.pop();
            props.navigation.navigate('chat', {
              screen: 'ContactCard',
              params: {
                card: item,
                isSendBirdUser: false,
                channel: channel,
              },
            });
          }
        }
      },
    );
  };

  return (
    <GlobalFlex>
      <BackHeader
        isLeftText={true}
        background={{
          backgroundColor: colors.PRIMARY_COLOR,
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
        }}
        textColor={{color: colors.WHITE}}
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={withLink ? Strings.send : Strings.add_members}
      />
      <View style={{backgroundColor: colors.PRIMARY_COLOR}}>
        <Spacer space={hp(0.4)} />
        <View style={styles.search_wrapper}>
          <Image source={images.search_ic} style={styles.search_ic} />
          <TextInput
            placeholder={Strings.search}
            placeholderTextColor={colors.OSLO_GRAY}
            value={search}
            onChangeText={val => {
              setSerach(val);
              const _contacts = JSON.parse(
                JSON.stringify(
                  realm
                    .objects('Contact')
                    .sorted('givenName')
                    .filtered(
                      'givenName CONTAINS $0 OR familyName CONTAINS $0 ',
                      val,
                    ),
                ),
              );
              setContactData(() => _contacts);
            }}
            style={styles.Input}
            clearButtonMode={'always'}
          />
        </View>
        <Spacer space={hp(0.6)} />
      </View>
      <View style={{flex: 1, backgroundColor: colors.WHITE}}>
        {contactData && contactData.length > 0 && (
          <>
            <AlphabetList
              style={{flex: 1}}
              data={contactData}
              renderItem={renderListItem}
              renderSectionHeader={renderSectionHeader}
              letterItemStyle={{height: 20}}
              indexLetterColor={colors.PRIMARY_COLOR}
            />
            <Spacer space={hp(1)} />
          </>
        )}
      </View>
      <Loading visible={loading} />
      {selected?.phone?.length > 0 && (
        <Pressable
          onPress={() => onPressNext(selected?.data)}
          style={{
            borderRadius: 90,
            position: 'absolute',
            alignSelf: 'baseline',
            bottom: hp('8%'),
            width: wp('6.5%'),
            right: wp('4.5%'),
            padding: hp('3%'),
            height: wp('6.5%'),
            backgroundColor: colors.PRIMARY_COLOR,
          }}>
          <Icon
            icon={'arrow-left'}
            size={wp('6%')}
            color={'white'}
            style={{
              transform: [{rotate: '180deg'}],
            }}
          />
        </Pressable>
      )}
    </GlobalFlex>
  );
};
