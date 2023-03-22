// @ts-ignore
import React, {useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
// @ts-ignore
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/en-gb';
import {fonts} from '../res/fonts';
import {images} from '../res/images';
import {POST} from '../api_helper/ApiServices';
import Loading from '../components/Loading';
import {POST_SENDBIRD_OPERATOR_PERMISSION} from '../api_helper/Api';
import {
  useSendbirdChat,
  createGroupChannelMembersFragment,
} from '@sendbird/uikit-react-native/src';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {MenuBar, Switch} from '@sendbird/uikit-react-native-foundation';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {Routes} from '../libs/navigation';
import {CONST_TYPES, getChannelWithCustomType} from './index';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import Strings from '../string_key/Strings';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();

const CONST_PROFILE_SIZE = wp(13.5);

const GroupChannelOperatorPermissionsScreen = () => {
  const {navigation, params} = useAppNavigation<Routes.GroupChannelInvite>();
  // @ts-ignore
  const {userData, onRefresh} = params;
  // @ts-ignore
  const {sdk} = useSendbirdChat();
  const [channel] = useState(() =>
    sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
  );

  const identifier =
    getChannelWithCustomType(channel).customType === CONST_TYPES.ROOM_GROUP
      ? 'Admin'
      : 'Operator';

  const getStringForValue = val => {
    if (val.toLowerCase().includes('opera')) {
      return Strings.operator;
    } else if (val.toLowerCase().includes('admi')) {
      return Strings.admin;
    }

    return val;
  };

  const [isLoading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({
    changeInfo: true,
    addRemoveMembers: true,
    inviteUserViaLink: true,
    addRemoveOperators: true,
    banMembers: true,
    muteMembers: true,
    reportMembers: true,
    freezeMembers: true,
  });

  const lastSeenTime = userData.lastSeenAt;

  moment.locale('es');
  const lastSeenString =
    typeof lastSeenTime === 'number'
      ? lastSeenTime === 0
        ? Strings.online
        : lastSeenTime > 0
        ? `${Strings.sa_str_last_seen} ` +
          moment.utc(lastSeenTime).local().startOf('seconds').fromNow() +
          ` ${Strings.at} ` +
          moment.utc(lastSeenTime).local().format('HH:mm')
        : ''
      : '';
  moment.locale('en-gb');

  const CONST_PERMISSIONS = [
    {
      name: Strings.change_channel_info,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            changeInfo: !prevState.changeInfo,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.changeInfo}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                changeInfo: value,
              };
            })
          }
        />
      ),
    },
    {
      name: Strings.add_remove_members,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            addRemoveMembers: !prevState.addRemoveMembers,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.addRemoveMembers}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                addRemoveMembers: value,
              };
            })
          }
        />
      ),
    },
    {
      name: Strings.invite_users_via_link,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            inviteUserViaLink: !prevState.inviteUserViaLink,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.inviteUserViaLink}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                inviteUserViaLink: value,
              };
            })
          }
        />
      ),
    },
    {
      name: `${Strings.add_or_remove} ${getStringForValue(identifier)}s`,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            addRemoveOperators: !prevState.addRemoveOperators,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.addRemoveOperators}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                addRemoveOperators: value,
              };
            })
          }
        />
      ),
    },
    {
      name: Strings.ban_members,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            banMembers: !prevState.banMembers,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.banMembers}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                banMembers: value,
              };
            })
          }
        />
      ),
    },
    {
      name: Strings.mute_members,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            muteMembers: !prevState.muteMembers,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.muteMembers}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                muteMembers: value,
              };
            })
          }
        />
      ),
    },
    {
      name: Strings.report_members,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            reportMembers: !prevState.reportMembers,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.reportMembers}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                reportMembers: value,
              };
            })
          }
        />
      ),
    },
    {
      name: Strings.freeze_channel,
      onPress: () =>
        setPermissions(prevState => {
          return {
            ...prevState,
            freezeMembers: !prevState.freezeMembers,
          };
        }),
      actionItem: (
        <Switch
          value={permissions.freezeMembers}
          onChangeValue={value =>
            setPermissions(prevState => {
              return {
                ...prevState,
                freezeMembers: value,
              };
            })
          }
        />
      ),
    },
  ];

  const addOperatorWithPermissions = async () => {
    setLoading(() => true);

    const uniqueID = await DeviceInfo.getUniqueId();
    const user = await AsyncStorage.getItem('userDetails');
    const api = POST_SENDBIRD_OPERATOR_PERMISSION(userData.userId);

    const postData = {
      sendbirdChannelId: channel.url,
      permissions: [
        {
          key: 'ActionChangeGroupInfo',
          value: permissions.changeInfo,
        },
        {
          key: 'ActionAddMembers',
          value: permissions.addRemoveMembers,
        },
        {
          key: 'ActionAddMembers',
          value: permissions.addRemoveMembers,
        },
        {
          key: 'ActionInviteUsersViaLink',
          value: permissions.inviteUserViaLink,
        },
        {
          key: 'ActionAddOperators',
          value: permissions.addRemoveOperators,
        },
        {
          key: 'ActionBanMembers',
          value: permissions.banMembers,
        },
        {
          key: 'ActionMuteMembers',
          value: permissions.muteMembers,
        },
        {
          key: 'ActionReportMembers',
          value: permissions.reportMembers,
        },
        {
          key: 'ActionFreezeChannel',
          value: permissions.freezeMembers,
        },
      ],
    };

    POST(
      api,
      true,
      JSON.parse(user).token,
      uniqueID,
      postData,
      (res, success) => {
        setLoading(() => false);
        channel.addOperators([userData.userId], (res, e) => {
          navigation.goBack();
          onRefresh();
        });

        // TODO: Check this flow after Dhruman fixes the API
        // if (success) {
        //   console.log('response => ', res);
        //   underDevelopment('Operator added successfully.');
        // } else {
        //   console.log('response => ', res);
        //   underDevelopment(res);
        // }
      },
    );
  };

  return (
    <GroupChannelMembersFragment
      channel={channel}
      renderUser={() => null}
      headerTitle={`${getStringForValue(identifier)} ${Strings.rights}`}
      onPressHeaderRight={() => addOperatorWithPermissions()}
      onPressHeaderLeft={() => navigation.goBack()}>
      <Loading visible={isLoading} />
      <ScrollView
        style={{
          paddingEnd: wp('4%'),
          paddingStart: wp('6%'),
        }}>
        <View style={{height: hp('3%')}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={
              userData.hasThumbnail
                ? {uri: userData.thumbnailPath}
                : images.avatar
            }
            style={{
              width: CONST_PROFILE_SIZE,
              height: CONST_PROFILE_SIZE,
              marginEnd: wp('2%'),
              borderRadius: CONST_PROFILE_SIZE,
            }}
          />
          <View>
            <Text
              style={{
                color: 'black',
                fontFamily: fonts.MEDIUM,
                fontSize: wp('4%'),
              }}>
              {userData.nickname}
            </Text>
            <View style={{height: hp('0.4%')}} />
            <Text
              style={{
                color: '#9ca7ba',
                fontSize: wp('3%'),
              }}>
              {lastSeenString}
            </Text>
          </View>
        </View>
        <View style={{height: hp('1%')}} />
        <Text
          style={{
            fontFamily: fonts.BOLD,
            fontSize: wp('5.5%'),
            paddingStart: wp('0.3%'),
          }}>
          {Strings.msg_what_can_this_do(
            getStringForValue(identifier).toLowerCase(),
          )}
        </Text>
        <View style={{height: hp('1%')}} />
        {CONST_PERMISSIONS.map(menu => (
          <>
            <MenuBar
              key={menu.name}
              name={menu.name}
              icon={menu.icon}
              onPress={menu.onPress}
              disabled={menu.disabled}
              iconColor={menu.iconColor}
              actionItem={menu.actionItem}
              actionLabel={menu.actionLabel}
              primaryTitle={menu.primaryTitle}
              iconBackgroundColor={menu.iconBackgroundColor}
            />
            <View style={{height: hp('0.7%')}} />
          </>
        ))}
      </ScrollView>
    </GroupChannelMembersFragment>
  );
};

export default GroupChannelOperatorPermissionsScreen;
